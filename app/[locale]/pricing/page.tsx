import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'es' ? 'Precios' : 'Pricing',
    description:
      locale === 'es'
        ? 'Planes de Propiology: prueba gratuita de 14 días, Básico $19/mes, Pro $39/mes. Para equipos, licenciamiento por asiento con factura.'
        : 'Propiology plans: 14-day free trial, Basic $19/mo, Pro $39/mo. For teams, per-seat annual licensing with invoice billing.',
    locale,
    path: '/pricing',
  });
}

const copy = {
  en: {
    eyebrow: 'Pricing',
    headline: 'Simple, honest pricing.',
    sub: 'Start free. Upgrade when you\'re ready. No surprise charges — cancel anytime.',

    annualLabel: 'Annual (save 20%)',
    monthlyLabel: 'Monthly',

    plans: [
      {
        name: 'Trial',
        monthlyPrice: null,
        annualPrice: null,
        priceLabel: 'Free',
        periodLabel: '14 days',
        desc: 'Everything you need to experience the Propiology method. No credit card required.',
        bullets: [
          'Readiness Score (daily)',
          'Habit Tracker (up to 3 habits)',
          'Narrative Journal (Propiology prompts)',
          'WhatsApp daily habit check-in',
          'Care-Multiplier AI (3 sessions)',
        ],
        cta: 'Start Free Trial',
        href: 'register',
        featured: false,
      },
      {
        name: 'Basic',
        monthlyPrice: 19,
        annualPrice: 15,
        priceLabel: null,
        periodLabel: null,
        desc: 'The full Propiology behavioral loop for committed individuals.',
        bullets: [
          'Everything in Trial',
          'Unlimited habits',
          '30-day Readiness Score history',
          'Full WhatsApp micro-learning',
          'Journal mood history',
          'Email Readiness Score digest (weekly)',
        ],
        cta: 'Get Basic',
        href: 'register',
        featured: false,
      },
      {
        name: 'Pro',
        monthlyPrice: 39,
        annualPrice: 29,
        priceLabel: null,
        periodLabel: null,
        desc: 'AI-powered self-knowledge and biometric integration for serious practitioners.',
        bullets: [
          'Everything in Basic',
          'Care-Multiplier AI (unlimited)',
          'Cognitive Shield AI (unlimited)',
          'Biometric integration (Fitbit, Garmin)',
          'Apple Health integration',
          'Priority support',
          'Early access to new AI tools',
        ],
        cta: 'Get Pro',
        href: 'register',
        featured: true,
      },
    ],

    b2bTitle: 'For Teams & Organizations',
    b2bDesc: 'HR departments, coaching firms, and healthcare networks use the Command Center for aggregate team wellbeing analytics with full privacy controls. Annual per-seat licensing, invoice billing, minimum 5 seats.',
    b2bBullets: [
      'Everything in Pro for each seat',
      'Command Center aggregate dashboard',
      'Team analytics (anonymized by default)',
      'Consent-based individual access',
      'PDF/CSV reporting',
      'Propiology program management',
      'Dedicated onboarding call',
      'SLA with priority support',
    ],
    b2bCta: 'Contact Sales',
    b2bNote: 'Pricing starting at $15/seat/month (billed annually). Minimum 5 seats.',

    guarantee: '90-day data retention after cancellation. Export your data anytime.',
    faqTitle: 'Pricing FAQ',
    faqs: [
      { q: 'Can I switch plans?', a: 'Yes. You can upgrade or downgrade at any time. Upgrades take effect immediately. Downgrades take effect at the next billing cycle.' },
      { q: 'What happens when my trial ends?', a: 'At the end of your 14-day trial, you choose a plan or your account moves to read-only mode. Your data is preserved for 90 days. You can export everything at any time.' },
      { q: 'Is there an annual discount?', a: 'Yes. Paying annually saves you 20% compared to the monthly rate. You can switch to annual billing from your account settings at any time.' },
      { q: 'How does B2B seat licensing work?', a: 'Organizations purchase a minimum of 5 seats, billed annually by invoice. Each seat gets full Pro access plus Command Center for the admin. Contact sales for a custom quote.' },
    ],
  },

  es: {
    eyebrow: 'Precios',
    headline: 'Precios simples y transparentes.',
    sub: 'Comienza gratis. Mejora cuando estés listo. Sin cargos sorpresa — cancela cuando quieras.',

    annualLabel: 'Anual (ahorra 20%)',
    monthlyLabel: 'Mensual',

    plans: [
      {
        name: 'Prueba',
        monthlyPrice: null,
        annualPrice: null,
        priceLabel: 'Gratis',
        periodLabel: '14 días',
        desc: 'Todo lo que necesitas para experimentar el método Propiológico. Sin tarjeta de crédito.',
        bullets: [
          'Puntaje de Disposición (diario)',
          'Seguimiento de hábitos (hasta 3)',
          'Diario Narrativo (preguntas propiológicas)',
          'Check-in diario de hábitos por WhatsApp',
          'IA Care-Multiplier (3 sesiones)',
        ],
        cta: 'Comenzar Gratis',
        href: 'register',
        featured: false,
      },
      {
        name: 'Básico',
        monthlyPrice: 19,
        annualPrice: 15,
        priceLabel: null,
        periodLabel: null,
        desc: 'El ciclo conductual completo de Propiología para personas comprometidas.',
        bullets: [
          'Todo lo del plan Prueba',
          'Hábitos ilimitados',
          'Historial del Puntaje de 30 días',
          'Micro-aprendizaje completo por WhatsApp',
          'Historial de estados de ánimo en el diario',
          'Resumen del Puntaje por correo (semanal)',
        ],
        cta: 'Obtener Básico',
        href: 'register',
        featured: false,
      },
      {
        name: 'Pro',
        monthlyPrice: 39,
        annualPrice: 29,
        priceLabel: null,
        periodLabel: null,
        desc: 'Autoconocimiento con IA e integración biométrica para practicantes serios.',
        bullets: [
          'Todo lo del plan Básico',
          'IA Care-Multiplier (ilimitado)',
          'IA Escudo Cognitivo (ilimitado)',
          'Integración biométrica (Fitbit, Garmin)',
          'Integración con Apple Health',
          'Soporte prioritario',
          'Acceso anticipado a nuevas herramientas de IA',
        ],
        cta: 'Obtener Pro',
        href: 'register',
        featured: true,
      },
    ],

    b2bTitle: 'Para Equipos y Organizaciones',
    b2bDesc: 'Departamentos de RR.HH., empresas de coaching y redes de salud usan el Centro de Comando para analítica agregada del bienestar del equipo con controles de privacidad completos. Licenciamiento anual por asiento, facturación por invoice, mínimo 5 asientos.',
    b2bBullets: [
      'Todo lo del plan Pro para cada asiento',
      'Dashboard agregado del Centro de Comando',
      'Analítica del equipo (anónima por defecto)',
      'Acceso individual basado en consentimiento',
      'Reportes en PDF/CSV',
      'Gestión de programas Propiológicos',
      'Llamada de incorporación dedicada',
      'SLA con soporte prioritario',
    ],
    b2bCta: 'Contactar Ventas',
    b2bNote: 'Precios desde $15/asiento/mes (facturado anualmente). Mínimo 5 asientos.',

    guarantee: 'Retención de datos por 90 días después de la cancelación. Exporta tus datos en cualquier momento.',
    faqTitle: 'Preguntas sobre precios',
    faqs: [
      { q: '¿Puedo cambiar de plan?', a: 'Sí. Puedes mejorar o reducir tu plan en cualquier momento. Las mejoras tienen efecto inmediato. Las reducciones tienen efecto en el próximo ciclo de facturación.' },
      { q: '¿Qué sucede cuando termina mi prueba?', a: 'Al final de tu prueba de 14 días, eliges un plan o tu cuenta pasa a modo de solo lectura. Tus datos se preservan por 90 días. Puedes exportar todo en cualquier momento.' },
      { q: '¿Hay descuento por pago anual?', a: 'Sí. Pagar anualmente te ahorra un 20% comparado con la tarifa mensual. Puedes cambiar a facturación anual desde la configuración de tu cuenta en cualquier momento.' },
      { q: '¿Cómo funciona el licenciamiento por asiento B2B?', a: 'Las organizaciones adquieren un mínimo de 5 asientos, facturados anualmente por invoice. Cada asiento obtiene acceso Pro completo más el Centro de Comando para el administrador. Contacta ventas para una cotización personalizada.' },
    ],
  },
};

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = copy[locale as keyof typeof copy] ?? copy.en;

  return (
    <>
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
            {t.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-[var(--color-brand-950)] sm:text-5xl">
            {t.headline}
          </h1>
          <p className="mt-4 text-lg text-[var(--color-text-secondary)]">{t.sub}</p>
        </div>
      </section>

      {/* Plans */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {t.plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col rounded-xl border p-6 ${
                  plan.featured
                    ? 'border-[var(--color-brand-500)] bg-[var(--color-brand-950)] text-white ring-2 ring-[var(--color-brand-500)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)]'
                }`}
              >
                {plan.featured && (
                  <span className="mb-4 self-start rounded-full bg-[var(--color-brand-500)] px-2.5 py-0.5 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <p
                  className={`text-xs font-bold uppercase tracking-widest ${plan.featured ? 'text-[var(--color-brand-300)]' : 'text-[var(--color-text-muted)]'}`}
                >
                  {plan.name}
                </p>

                <div className="mt-4">
                  {plan.priceLabel ? (
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold ${plan.featured ? 'text-white' : 'text-[var(--color-brand-950)]'}`}>
                        {plan.priceLabel}
                      </span>
                      {plan.periodLabel && (
                        <span className={`text-sm ${plan.featured ? 'text-[var(--color-brand-200)]' : 'text-[var(--color-text-muted)]'}`}>
                          · {plan.periodLabel}
                        </span>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-4xl font-bold ${plan.featured ? 'text-white' : 'text-[var(--color-brand-950)]'}`}>
                          ${plan.annualPrice}
                        </span>
                        <span className={`text-sm ${plan.featured ? 'text-[var(--color-brand-200)]' : 'text-[var(--color-text-muted)]'}`}>
                          /mo
                        </span>
                      </div>
                      <p className={`mt-0.5 text-xs ${plan.featured ? 'text-[var(--color-brand-300)]' : 'text-[var(--color-text-muted)]'}`}>
                        {t.annualLabel} · ${plan.monthlyPrice}/mo {t.monthlyLabel.toLowerCase()}
                      </p>
                    </>
                  )}
                </div>

                <p className={`mt-4 text-sm ${plan.featured ? 'text-[var(--color-brand-100)]' : 'text-[var(--color-text-secondary)]'}`}>
                  {plan.desc}
                </p>

                <ul className="mt-6 flex flex-1 flex-col gap-2">
                  {plan.bullets.map((b) => (
                    <li
                      key={b}
                      className={`flex items-start gap-2 text-sm ${plan.featured ? 'text-[var(--color-brand-100)]' : 'text-[var(--color-text-secondary)]'}`}
                    >
                      <span className="mt-0.5 shrink-0 text-[var(--color-brand-500)]">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/${locale}/${plan.href}`}
                  className={`mt-8 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                    plan.featured
                      ? 'bg-[var(--color-brand-500)] text-white hover:bg-[var(--color-brand-400)]'
                      : 'border border-[var(--color-border)] text-[var(--color-brand-700)] hover:bg-[var(--color-brand-50)]'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">{t.guarantee}</p>
        </div>
      </section>

      {/* B2B */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[var(--color-brand-950)] sm:text-3xl">
                {t.b2bTitle}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{t.b2bDesc}</p>
              <p className="mt-4 text-xs text-[var(--color-text-muted)]">{t.b2bNote}</p>
              <Link
                href={`/${locale}/for-teams`}
                className="mt-6 inline-block rounded-lg bg-[var(--color-brand-600)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors"
              >
                {t.b2bCta}
              </Link>
            </div>
            <ul className="flex flex-col gap-2 self-start">
              {t.b2bBullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                  <span className="mt-0.5 shrink-0 text-[var(--color-brand-500)]">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[var(--color-border)] px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 font-display text-2xl font-semibold text-[var(--color-brand-950)] sm:text-3xl">
            {t.faqTitle}
          </h2>
          <dl className="flex flex-col gap-6">
            {t.faqs.map((faq) => (
              <div key={faq.q} className="border-b border-[var(--color-border)] pb-6 last:border-0 last:pb-0">
                <dt className="text-sm font-semibold text-[var(--color-brand-900)]">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
