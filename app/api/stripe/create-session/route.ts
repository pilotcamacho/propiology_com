import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe/client';
import { TRIAL_DAYS } from '@/lib/stripe/prices';
import { getSubscriptionByUserId, upsertSubscription } from '@/lib/billing/subscription';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      priceId: string;
      userId: string;
      email: string;
      successUrl: string;
      cancelUrl: string;
    };

    const { priceId, userId, email, successUrl, cancelUrl } = body;

    if (!priceId || !userId || !email || !successUrl || !cancelUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get or create Stripe customer
    let customerId: string;
    const existing = await getSubscriptionByUserId(userId);
    const stripe = getStripeClient();

    if (existing?.stripeCustomerId) {
      customerId = existing.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email,
        metadata: { userId },
      });
      customerId = customer.id;
    }

    // Only offer trial if the user has never had an active subscription
    const isFirstSubscription = !existing || existing.status === 'trialing';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        ...(isFirstSubscription ? { trial_period_days: TRIAL_DAYS } : {}),
        metadata: { userId },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId },
      allow_promotion_codes: true,
    });

    // Ensure a subscription record exists with the customer ID
    if (!existing?.stripeCustomerId) {
      await upsertSubscription(userId, { stripeCustomerId: customerId });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[stripe/create-session]', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
