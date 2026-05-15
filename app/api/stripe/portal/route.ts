import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe/client';

export async function POST(req: NextRequest) {
  try {
    const { customerId, returnUrl } = await req.json() as {
      customerId: string;
      returnUrl: string;
    };

    if (!customerId || !returnUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const stripe = getStripeClient();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[stripe/portal]', err);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}
