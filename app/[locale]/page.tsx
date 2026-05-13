import Link from 'next/link';

const copy = {
  en: {
    eyebrow: 'Propiology Platform',
    headline: 'Your Personal OS for behavioral transformation.',
    sub: 'Track habits, understand your Readiness Score, and use AI-powered tools grounded in the science of Propiology — the study of oneself.',
    cta: 'Start Free Trial',
    ctaSub: '14 days free · No credit card required',
    learnMore: 'See how it works',
    features: [
      { title: 'Readiness Score', desc: 'A daily 0–100 composite of your habit adherence, biometric signals, and reflective practice.' },
      { title: 'AI Tools', desc: 'Care-Multiplier and Cognitive Shield — AI conversations grounded in Propiology to help you act from your best self.' },
      { title: 'Command Center', desc: 'For HR teams, coaching firms, and healthcare networks: aggregate wellbeing analytics with full privacy controls.' },
    ],
  },
  es: {
    eyebrow: 'Plataforma Propiology',
    headline: 'Tu Sistema Operativo Personal para la transformación del comportamiento.',
    sub: 'Registra hábitos, comprende tu Puntaje de Disposición y usa herramientas de IA fundamentadas en la ciencia de la Propiología — el estudio de uno mismo.',
    cta: 'Comenzar Gratis',
    ctaSub: '14 días gratis · Sin tarjeta de crédito',
    learnMore: 'Ver cómo funciona',
    features: [
      { title: 'Puntaje de Disposición', desc: 'Un compuesto diario de 0 a 100 de tu adherencia a hábitos, señales biométricas y práctica reflexiva.' },
      { title: 'Herramientas de IA', desc: 'Care-Multiplier y Escudo Cognitivo — conversaciones de IA fundamentadas en Propiología para actuar desde tu mejor yo.' },
      { title: 'Centro de Comando', desc: 'Para equipos de RR.HH., empresas de coaching y redes de salud: analítica de bienestar agregada con controles de privacidad.' },
    ],
  },
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = copy[locale as keyof typeof copy] ?? copy.en;

  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-surface-subtle)] px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-brand-600)]">
            {t.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-[var(--color-brand-950)] sm:text-5xl">
            {t.headline}
          </h1>
          <p className="mt-6 text-lg text-[var(--color-text-secondary)]">{t.sub}</p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={`/${locale}/register`}
              className="rounded-lg bg-[var(--color-brand-600)] px-8 py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors"
            >
              {t.cta}
            </Link>
            <Link
              href={`/${locale}/features`}
              className="text-sm font-medium text-[var(--color-brand-700)] hover:underline"
            >
              {t.learnMore} →
            </Link>
          </div>
          <p className="mt-3 text-xs text-[var(--color-text-muted)]">{t.ctaSub}</p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-3">
          {t.features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]"
            >
              <h3 className="text-lg font-semibold text-[var(--color-brand-900)]">{f.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
