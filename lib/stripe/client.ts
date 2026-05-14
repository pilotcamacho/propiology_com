import Stripe from 'stripe';

const globalForStripe = global as typeof globalThis & { _stripe?: Stripe };

export const stripe =
  globalForStripe._stripe ??
  new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
  });

if (process.env.NODE_ENV !== 'production') globalForStripe._stripe = stripe;
