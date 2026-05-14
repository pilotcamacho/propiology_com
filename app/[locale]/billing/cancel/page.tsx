'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

const copy = {
  en: {
    title: 'Before you cancel',
    sub: 'We want to make sure you have everything you need. Here\'s what you\'ll lose when you cancel.',
    losses: [
      'Access to Care-Multiplier and Cognitive Shield AI tools',
      'Biometric integrations (Fitbit, Garmin, Apple Health)',
      'Your Readiness Score history beyond 7 days',
      'Priority support',
    ],
    retain: 'Your data is preserved for 90 days after cancellation. You can export everything at any time.',
    alternative: 'Instead of cancelling, you can:',
    alternatives: [
      { label: 'Downgrade to Basic ($19/month)', desc: 'Keep your habits, journal, and Readiness Score history.' },
      { label: 'Pause your subscription', desc: 'Contact us to pause for up to 3 months.' },
    ],
    manageViaPortal: 'Manage via Stripe portal',
    portalNote: 'Cancellations, downgrades, and pauses are handled through our secure billing portal.',
    back: '← Back to billing',
    loadingPortal: 'Opening billing portal…',
  },
  es: {
    title: 'Antes de cancelar',
    sub: 'Queremos asegurarnos de que tienes todo lo que necesitas. Esto es lo que perderás al cancelar.',
    losses: [
      'Acceso a las herramientas de IA Care-Multiplier y Escudo Cognitivo',
      'Integraciones biométricas (Fitbit, Garmin, Apple Health)',
      'Tu historial del Puntaje de Disposición más allá de 7 días',
      'Soporte prioritario',
    ],
    retain: 'Tus datos se preservan por 90 días después de la cancelación. Puedes exportar todo en cualquier momento.',
    alternative: 'En lugar de cancelar, puedes:',
    alternatives: [
      { label: 'Cambiar al plan Básico ($19/mes)', desc: 'Mantén tus hábitos, diario e historial del Puntaje.' },
      { label: 'Pausar tu suscripción', desc: 'Contáctanos para pausar hasta 3 meses.' },
    ],
    manageViaPortal: 'Gestionar por portal de Stripe',
    portalNote: 'Las cancelaciones, cambios de plan y pausas se gestionan a través de nuestro portal de facturación seguro.',
    back: '← Volver a facturación',
    loadingPortal: 'Abriendo portal de facturación…',
  },
};

export default function CancelPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const t = copy[locale as keyof typeof copy] ?? copy.en;
  const router = useRouter();

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await client.models.UserSubscription.list();
        if (data?.[0]?.stripeCustomerId) setCustomerId(data[0].stripeCustomerId);
      } catch {
        // handled by RequireAuth
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const openPortal = async () => {
    if (!customerId) return;
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          returnUrl: `${window.location.origin}/${locale}/billing`,
        }),
      });
      const { url } = await res.json() as { url: string };
      if (url) window.location.href = url;
    } catch (err) {
      console.error('[CancelPage] portal error', err);
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

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/${locale}/billing`}
        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-brand-700)]"
      >
        {t.back}
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-[var(--color-brand-950)]">{t.title}</h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{t.sub}</p>

      {/* What you'll lose */}
      <div className="mt-6 rounded-xl border border-[var(--color-alert-100)] bg-[var(--color-alert-100)] p-5">
        <ul className="flex flex-col gap-2">
          {t.losses.map((l) => (
            <li key={l} className="flex items-start gap-2 text-sm text-[var(--color-alert-500)]">
              <span className="mt-0.5 shrink-0">✕</span>
              {l}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-[var(--color-text-muted)]">{t.retain}</p>
      </div>

      {/* Alternatives */}
      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-white p-5">
        <p className="text-sm font-semibold text-[var(--color-brand-900)]">{t.alternative}</p>
        <div className="mt-3 flex flex-col gap-3">
          {t.alternatives.map((a) => (
            <div key={a.label} className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-[var(--color-brand-700)]">{a.label}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Portal CTA */}
      <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-white p-5">
        <p className="text-sm text-[var(--color-text-secondary)]">{t.portalNote}</p>
        <button
          onClick={() => void openPortal()}
          disabled={portalLoading || !customerId}
          className="mt-4 rounded-lg bg-[var(--color-brand-600)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-60"
        >
          {portalLoading ? t.loadingPortal : t.manageViaPortal}
        </button>
      </div>
    </div>
  );
}
