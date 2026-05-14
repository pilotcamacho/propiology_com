export type PlanTier = 'trial' | 'basic' | 'pro';
export type BillingInterval = 'month' | 'year';

export interface PlanConfig {
  key: string;
  priceId: () => string;
  tier: PlanTier;
  interval: BillingInterval;
  label: string;
  monthlyPrice: number;
  annualTotal?: number;
}

export const PLANS: PlanConfig[] = [
  {
    key: 'basic_monthly',
    priceId: () => process.env.STRIPE_BASIC_PRICE_ID_MONTHLY ?? '',
    tier: 'basic',
    interval: 'month',
    label: 'Basic',
    monthlyPrice: 19,
  },
  {
    key: 'basic_annual',
    priceId: () => process.env.STRIPE_BASIC_PRICE_ID_ANNUAL ?? '',
    tier: 'basic',
    interval: 'year',
    label: 'Basic Annual',
    monthlyPrice: 15,
    annualTotal: 180,
  },
  {
    key: 'pro_monthly',
    priceId: () => process.env.STRIPE_PRO_PRICE_ID_MONTHLY ?? '',
    tier: 'pro',
    interval: 'month',
    label: 'Pro',
    monthlyPrice: 39,
  },
  {
    key: 'pro_annual',
    priceId: () => process.env.STRIPE_PRO_PRICE_ID_ANNUAL ?? '',
    tier: 'pro',
    interval: 'year',
    label: 'Pro Annual',
    monthlyPrice: 29,
    annualTotal: 348,
  },
];

export const TRIAL_DAYS = 14;

export function planFromPriceId(priceId: string): PlanConfig | undefined {
  return PLANS.find((p) => p.priceId() === priceId);
}

export function tierCanAccess(userTier: PlanTier, requiredTier: PlanTier): boolean {
  const rank: Record<PlanTier, number> = { trial: 0, basic: 1, pro: 2 };
  return rank[userTier] >= rank[requiredTier];
}
