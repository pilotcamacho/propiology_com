import Link from 'next/link';
import type { PlanTier } from '@/lib/stripe/prices';
import { tierCanAccess } from '@/lib/stripe/prices';

interface PaywallGateProps {
  userTier: PlanTier;
  requiredTier: 'basic' | 'pro';
  locale: string;
  children: React.ReactNode;
  featureLabel?: string;
}

export function PaywallGate({ userTier, requiredTier, locale, children, featureLabel }: PaywallGateProps) {
  if (tierCanAccess(userTier, requiredTier)) {
    return <>{children}</>;
  }

  const tierLabel = requiredTier === 'pro' ? 'Pro' : 'Basic';
  const label = featureLabel ?? `This feature requires the ${tierLabel} plan`;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] px-6 py-10 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand-100)] text-xl text-[var(--color-brand-600)]">
        ◈
      </div>
      <p className="text-sm font-semibold text-[var(--color-brand-900)]">{label}</p>
      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
        Upgrade to {tierLabel} to unlock this feature.
      </p>
      <Link
        href={`/${locale}/billing/upgrade`}
        className="mt-5 rounded-lg bg-[var(--color-brand-600)] px-5 py-2 text-xs font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors"
      >
        Upgrade to {tierLabel}
      </Link>
    </div>
  );
}
