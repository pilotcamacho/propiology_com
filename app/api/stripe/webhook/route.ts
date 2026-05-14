import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { upsertSubscription } from '@/lib/billing/subscription';
import { planFromPriceId } from '@/lib/stripe/prices';

// Stripe SDK v22 (API 2025+) may not expose some legacy fields in TypeScript types
// even though the API still returns them. These helpers access them safely.
function subPeriodEnd(sub: Stripe.Subscription): number {
  return (sub as unknown as Record<string, unknown>).current_period_end as number ?? 0;
}

function subCancelAtEnd(sub: Stripe.Subscription): boolean {
  return (sub as unknown as Record<string, unknown>).cancel_at_period_end as boolean ?? false;
}

function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const raw = (invoice as unknown as Record<string, unknown>).subscription;
  if (!raw) return null;
  return typeof raw === 'string' ? raw : (raw as Stripe.Subscription).id;
}

function stripeStatusToLocal(
  s: string
): 'trialing' | 'active' | 'past_due' | 'cancelled' {
  if (s === 'trialing') return 'trialing';
  if (s === 'past_due') return 'past_due';
  if (s === 'canceled' || s === 'cancelled') return 'cancelled';
  return 'active';
}

async function syncSubscription(sub: Stripe.Subscription) {
  const userId = sub.metadata?.userId;
  if (!userId) return;

  const priceId = sub.items.data[0]?.price.id ?? '';
  const plan = planFromPriceId(priceId);
  const tier = plan?.tier === 'pro' ? 'pro' : 'basic';
  const rawInterval = sub.items.data[0]?.plan?.interval;
  const interval: 'year' | 'month' = rawInterval === 'year' ? 'year' : 'month';
  const periodEndTs = subPeriodEnd(sub);

  const customerId =
    typeof sub.customer === 'string' ? sub.customer : (sub.customer as Stripe.Customer).id;

  await upsertSubscription(userId, {
    stripeCustomerId: customerId,
    stripeSubscriptionId: sub.id,
    tier,
    interval,
    status: stripeStatusToLocal(sub.status),
    currentPeriodEnd: periodEndTs ? new Date(periodEndTs * 1000).toISOString() : undefined,
    cancelAtPeriodEnd: subCancelAtEnd(sub),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (!session.subscription || !session.metadata?.userId) break;
        const subId = typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription.id;
        const sub = await stripe.subscriptions.retrieve(subId);
        // Ensure userId is propagated if not already in subscription metadata
        if (!sub.metadata?.userId) {
          await stripe.subscriptions.update(subId, {
            metadata: { userId: session.metadata.userId },
          });
          (sub.metadata as Record<string, string>).userId = session.metadata.userId;
        }
        await syncSubscription(sub);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoiceSubscriptionId(invoice);
        if (!subId) break;
        const sub = await stripe.subscriptions.retrieve(subId);
        await syncSubscription(sub);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoiceSubscriptionId(invoice);
        if (!subId) break;
        const sub = await stripe.subscriptions.retrieve(subId);
        if (!sub.metadata?.userId) break;
        await upsertSubscription(sub.metadata.userId, { status: 'past_due' });
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        await syncSubscription(sub);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;
        await upsertSubscription(userId, {
          tier: 'trial',
          status: 'cancelled',
          cancelAtPeriodEnd: false,
        });
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error(`[webhook] failed to process ${event.type}:`, err);
    return NextResponse.json({ error: 'Event processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
