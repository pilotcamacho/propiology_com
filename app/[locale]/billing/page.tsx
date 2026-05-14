'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

const copy = {
  en: {
    title: 'Billing',
    planLabel: 'Current plan',
    statusLabel: 'Status',
    renewalLabel: 'Next renewal',
    noSub: 'No active subscription. You are on the free trial.',
    manageCta: 'Manage subscription',
    upgradeCta: 'Upgrade plan',
    cancelCta: 'Cancel subscription',
    statuses: {
      trialing: 'Trial',
      active: 'Active',
      past_due: 'Past due',
      cancelled: 'Cancelled',
    },
    tiers: { trial: 'Trial', basic: 'Basic', pro: 'Pro' },
  },
  es: {
    title: 'Facturación',
    planLabel: 'Plan actual',
    statusLabel: 'Estado',
    renewalLabel: 'Próxima renovación',
    noSub: 'Sin suscripción activa. Estás en el período de prueba.',
    manageCta: 'Gestionar suscripción',
    upgradeCta: 'Mejorar plan',
    cancelCta: 'Cancelar suscripción',
    statuses: {
      trialing: 'Prueba',
      active: 'Activa',
      past_due: 'Pago pendiente',
      cancelled: 'Cancelada',
    },
    tiers: { trial: 'Prueba', basic: 'Básico', pro: 'Pro' },
  },
};

interface SubscriptionData {
  tier: string;
  status: string;
  currentPeriodEnd?: string | null;
  stripeCustomerId?: string | null;
  cancelAtPeriodEnd?: boolean | null;
}

export default function BillingPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const t = copy[locale as keyof typeof copy] ?? copy.en;

  const [sub, setSub] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        await getCurrentUser();
        const { data } = await client.models.UserSubscription.list();
        if (data && data.length > 0) {
          const record = data[0];
          setSub({
            tier: record.tier ?? 'trial',
            status: record.status ?? 'trialing',
            currentPeriodEnd: record.currentPeriodEnd,
            stripeCustomerId: record.stripeCustomerId,
            cancelAtPeriodEnd: record.cancelAtPeriodEnd,
          });
        }
      } catch {
        // Not signed in or no subscription — handled by RequireAuth or empty state
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const openPortal = async () => {
    if (!sub?.stripeCustomerId) return;
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: sub.stripeCustomerId,
          returnUrl: window.location.href,
        }),
      });
      const { url } = await res.json() as { url: string };
      if (url) window.location.href = url;
    } catch (err) {
      console.error('[BillingPage] portal error', err);
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-brand-600)] border-t-transparent" />
      </div>
    );
  }

  const tier = sub?.tier ?? 'trial';
  const status = sub?.status ?? 'trialing';
  const periodEnd = sub?.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd).toLocaleDateString(locale === 'es' ? 'es-CO' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const tierLabel = t.tiers[tier as keyof typeof t.tiers] ?? tier;
  const statusLabel = t.statuses[status as keyof typeof t.statuses] ?? status;

  const statusColor =
    status === 'active' || status === 'trialing'
      ? 'text-[var(--color-success-500)]'
      : status === 'past_due'
        ? 'text-[var(--color-warning-500)]'
        : 'text-[var(--color-text-muted)]';

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-[var(--color-brand-950)]">{t.title}</h1>

      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-white p-6">
        {/* Plan details */}
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              {t.planLabel}
            </dt>
            <dd className="mt-1 text-2xl font-bold text-[var(--color-brand-950)]">{tierLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              {t.statusLabel}
            </dt>
            <dd className={`mt-1 text-sm font-semibold ${statusColor}`}>{statusLabel}</dd>
          </div>
          {periodEnd && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                {t.renewalLabel}
              </dt>
              <dd className="mt-1 text-sm text-[var(--color-text-secondary)]">{periodEnd}</dd>
            </div>
          )}
        </dl>

        {sub?.cancelAtPeriodEnd && (
          <p className="mt-4 rounded-lg bg-[var(--color-warning-100)] px-4 py-2 text-xs text-[var(--color-warning-500)]">
            Your subscription will cancel at the end of the current billing period.
          </p>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          {sub?.stripeCustomerId ? (
            <button
              onClick={() => void openPortal()}
              disabled={portalLoading}
              className="rounded-lg bg-[var(--color-brand-600)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-60"
            >
              {portalLoading ? 'Loading…' : t.manageCta}
            </button>
          ) : null}
          {tier === 'trial' || tier === 'basic' ? (
            <Link
              href={`/${locale}/billing/upgrade`}
              className="rounded-lg border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-brand-700)] hover:bg-[var(--color-brand-50)] transition-colors"
            >
              {t.upgradeCta}
            </Link>
          ) : null}
          {sub?.stripeCustomerId && status === 'active' ? (
            <Link
              href={`/${locale}/billing/cancel`}
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-alert-500)] transition-colors"
            >
              {t.cancelCta}
            </Link>
          ) : null}
        </div>
      </div>

      {!sub && (
        <p className="mt-4 text-sm text-[var(--color-text-muted)]">{t.noSub}</p>
      )}
    </div>
  );
}
