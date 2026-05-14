'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { CheckoutButton } from '@/components/billing/CheckoutButton';
import { PLANS } from '@/lib/stripe/prices';

const copy = {
  en: {
    title: 'Upgrade your plan',
    sub: 'Choose the plan that matches your commitment to transformation.',
    annualSave: 'Save 20% with annual billing',
    mo: '/mo',
    billedAnnually: 'billed annually',
    perMonth: 'per month',
    currentPlan: 'Current plan',
    features: {
      basic_monthly: ['Readiness Score history', 'Unlimited habits', 'Full WhatsApp micro-learning', 'Journal mood history'],
      basic_annual: ['Everything in Basic Monthly', 'Save 20% vs monthly'],
      pro_monthly: ['Everything in Basic', 'Care-Multiplier AI (unlimited)', 'Cognitive Shield AI (unlimited)', 'Biometric integrations', 'Priority support'],
      pro_annual: ['Everything in Pro Monthly', 'Save 20% vs monthly'],
    },
  },
  es: {
    title: 'Mejorar tu plan',
    sub: 'Elige el plan que corresponde a tu compromiso con la transformación.',
    annualSave: 'Ahorra 20% con facturación anual',
    mo: '/mes',
    billedAnnually: 'facturado anualmente',
    perMonth: 'por mes',
    currentPlan: 'Plan actual',
    features: {
      basic_monthly: ['Historial del Puntaje', 'Hábitos ilimitados', 'Micro-aprendizaje completo WhatsApp', 'Historial de estados de ánimo'],
      basic_annual: ['Todo lo de Básico Mensual', 'Ahorra 20% vs mensual'],
      pro_monthly: ['Todo lo de Básico', 'IA Care-Multiplier (ilimitado)', 'IA Escudo Cognitivo (ilimitado)', 'Integraciones biométricas', 'Soporte prioritario'],
      pro_annual: ['Todo lo de Pro Mensual', 'Ahorra 20% vs mensual'],
    },
  },
};

interface UserInfo {
  userId: string;
  email: string;
  tier: string;
}

export default function UpgradePage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const t = copy[locale as keyof typeof copy] ?? copy.en;

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const user = await getCurrentUser();
        const attrs = await fetchUserAttributes();
        setUserInfo({
          userId: user.userId,
          email: attrs.email ?? '',
          tier: attrs['custom:subscription_tier'] ?? 'trial',
        });
      } catch {
        // RequireAuth handles redirect
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  if (loading || !userInfo) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-brand-600)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold text-[var(--color-brand-950)]">{t.title}</h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{t.sub}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const features = t.features[plan.key as keyof typeof t.features] ?? [];
          const isCurrent = userInfo.tier === plan.tier;
          const isPro = plan.tier === 'pro';

          return (
            <div
              key={plan.key}
              className={`flex flex-col rounded-xl border p-5 ${
                isPro
                  ? 'border-[var(--color-brand-500)] ring-1 ring-[var(--color-brand-500)]'
                  : 'border-[var(--color-border)]'
              } bg-white`}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                {plan.label}
              </p>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[var(--color-brand-950)]">
                  ${plan.monthlyPrice}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">{t.mo}</span>
              </div>
              {plan.interval === 'year' && (
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                  {t.billedAnnually} · ${plan.annualTotal}
                </p>
              )}

              <ul className="mt-4 flex flex-1 flex-col gap-1.5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-[var(--color-text-secondary)]">
                    <span className="mt-0.5 shrink-0 text-[var(--color-brand-500)]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                {isCurrent ? (
                  <span className="block rounded-lg border border-[var(--color-border)] px-4 py-2 text-center text-xs font-medium text-[var(--color-text-muted)]">
                    {t.currentPlan}
                  </span>
                ) : (
                  <CheckoutButton
                    priceId={plan.priceId()}
                    userId={userInfo.userId}
                    email={userInfo.email}
                    locale={locale}
                    label={`Get ${plan.label}`}
                    featured={isPro}
                    className="w-full text-center"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
        {t.annualSave}
      </p>
    </div>
  );
}
