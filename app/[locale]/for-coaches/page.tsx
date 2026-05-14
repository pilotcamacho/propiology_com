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
    title: locale === 'es' ? 'Para Coaches' : 'For Coaches',
    description:
      locale === 'es'
        ? 'Propiology para coaches: datos conductuales diarios entre sesiones, gestión de clientes y programas estructurados basados en la ciencia Propiológica.'
        : 'Propiology for coaches: daily behavioral data between sessions, client management, and structured programs grounded in Propiology science.',
    locale,
    path: '/for-coaches',
  });
}

const copy = {
  en: {
    eyebrow: 'For Coaches',
    headline: 'What happens between\nyour sessions matters most.',
    sub: 'Propiology gives coaches an operational view of every client\'s behavioral progress — habits, Readiness Score, journal activity, and AI tool use — updated daily between sessions.',

    problemTitle: 'The gap every coach knows',
    problem: 'Your client has a breakthrough in session. They leave with clear intentions. Then 72 hours pass, life intervenes, and by the next session you\'re back to reconstructing what happened from memory. The between-session window is where transformation either takes root or fades. Propiology closes that gap.',

    featuresTitle: 'What Propiology gives you',
    features: [
      {
        title: 'Daily behavioral signals',
        desc: 'See your client\'s Readiness Score, habit check-ins, and journal engagement every day — not just what they report in session. Spot drifts before they become patterns.',
      },
      {
        title: 'Consent-based client access',
        desc: 'Clients grant you access explicitly. Each grant is logged. Clients can revoke at any time. You see only what they\'ve consented to share — individual dashboards, not aggregates.',
      },
      {
        title: 'AI tool conversation summaries',
        desc: 'When a client uses Care-Multiplier or Cognitive Shield, the session summary (with their consent) is visible in their dashboard. Use it to deepen your next conversation.',
      },
      {
        title: 'Program assignment',
        desc: 'Build structured Propiology programs — sequences of habits, journal prompts, and AI tool sessions — and assign them to clients. Track completion from the Command Center.',
      },
      {
        title: 'Propiology framework alignment',
        desc: 'Every metric in Propiology is grounded in the methodology\'s 6 elements and 5-stage journey. Your clients\' data speaks the same language you use in session.',
      },
      {
        title: 'Scale without losing depth',
        desc: 'Manage multiple clients from a single Command Center. See at a glance who is engaged, who needs attention, and where AI tools are surfacing patterns that deserve human follow-up.',
      },
    ],

    journeyTitle: 'The 5-stage transformation journey',
    journeySub: 'Every client dashboard maps to the Propiology journey. Track where your client is — and where they\'re moving.',
    stages: [
      { name: 'Darkness', desc: 'Disconnected from self. Low Readiness Scores, irregular habits, minimal journal engagement.' },
      { name: 'Glimpse', desc: 'Awareness beginning. Score improving, habits forming, AI sessions starting to reveal patterns.' },
      { name: 'Inner Light', desc: 'Consistent behavioral practice. High adherence, meaningful journal depth, regular AI tool use.' },
      { name: 'Mastery', desc: 'Stable behavioral infrastructure. Scores 70+, strong streaks, proactive use of AI for refinement.' },
      { name: 'Illumination', desc: 'Integration complete. Acting from values, not reactivity. Score 85+, consistent across all elements.' },
    ],

    ctaTitle: 'Bring Propiology into your coaching practice.',
    ctaSub: 'Start with a personal Pro trial. Then explore the Command Center for your client roster.',
    cta: 'Start Free Trial',
    b2bCta: 'Contact Sales for team pricing',
    trialNote: '14 days free · No credit card required',
  },

  es: {
    eyebrow: 'Para Coaches',
    headline: 'Lo que pasa entre\ntus sesiones importa más.',
    sub: 'Propiology da a los coaches una vista operativa del progreso conductual de cada cliente — hábitos, Puntaje de Disposición, actividad en el diario y uso de herramientas de IA — actualizada diariamente entre sesiones.',

    problemTitle: 'La brecha que todo coach conoce',
    problem: 'Tu cliente tiene un avance en la sesión. Se va con intenciones claras. Luego pasan 72 horas, la vida interviene, y para la próxima sesión vuelves a reconstruir lo que pasó desde la memoria. La ventana entre sesiones es donde la transformación echa raíces o se desvanece. Propiology cierra esa brecha.',

    featuresTitle: 'Qué te da Propiology',
    features: [
      {
        title: 'Señales conductuales diarias',
        desc: 'Ve el Puntaje de Disposición, los check-ins de hábitos y la participación en el diario de tu cliente cada día — no solo lo que reportan en sesión. Detecta desvíos antes de que se conviertan en patrones.',
      },
      {
        title: 'Acceso al cliente basado en consentimiento',
        desc: 'Los clientes te otorgan acceso explícitamente. Cada otorgamiento queda registrado. Los clientes pueden revocar en cualquier momento. Ves solo lo que han consentido compartir — dashboards individuales, no agregados.',
      },
      {
        title: 'Resúmenes de conversaciones de herramientas de IA',
        desc: 'Cuando un cliente usa Care-Multiplier o Escudo Cognitivo, el resumen de la sesión (con su consentimiento) es visible en su dashboard. Úsalo para profundizar en tu próxima conversación.',
      },
      {
        title: 'Asignación de programas',
        desc: 'Construye programas estructurados de Propiología — secuencias de hábitos, preguntas de diario y sesiones de herramientas de IA — y asígnalos a clientes. Sigue la finalización desde el Centro de Comando.',
      },
      {
        title: 'Alineación con el marco de Propiología',
        desc: 'Cada métrica en Propiology está fundamentada en los 6 elementos y el viaje de 5 etapas de la metodología. Los datos de tus clientes hablan el mismo idioma que usas en sesión.',
      },
      {
        title: 'Escala sin perder profundidad',
        desc: 'Gestiona múltiples clientes desde un solo Centro de Comando. Ve de un vistazo quién está comprometido, quién necesita atención y dónde las herramientas de IA están revelando patrones que merecen seguimiento humano.',
      },
    ],

    journeyTitle: 'El viaje de transformación de 5 etapas',
    journeySub: 'Cada dashboard de cliente se mapea al viaje de Propiología. Rastrea dónde está tu cliente — y hacia dónde se mueve.',
    stages: [
      { name: 'Oscuridad', desc: 'Desconectado de sí mismo. Puntajes de Disposición bajos, hábitos irregulares, participación mínima en el diario.' },
      { name: 'Destello', desc: 'Conciencia comenzando. Puntaje mejorando, hábitos formándose, sesiones de IA empezando a revelar patrones.' },
      { name: 'Luz Interior', desc: 'Práctica conductual consistente. Alta adherencia, profundidad significativa en el diario, uso regular de herramientas de IA.' },
      { name: 'Maestría', desc: 'Infraestructura conductual estable. Puntajes 70+, rachas sólidas, uso proactivo de IA para refinamiento.' },
      { name: 'Iluminación', desc: 'Integración completa. Actuando desde valores, no desde reactividad. Puntaje 85+, consistente en todos los elementos.' },
    ],

    ctaTitle: 'Lleva Propiology a tu práctica de coaching.',
    ctaSub: 'Comienza con una prueba Pro personal. Luego explora el Centro de Comando para tu lista de clientes.',
    cta: 'Comenzar Gratis',
    b2bCta: 'Contactar Ventas para precios de equipo',
    trialNote: '14 días gratis · Sin tarjeta de crédito',
  },
};

const stageColors: Record<string, string> = {
  Darkness:     '#1a1a2e',
  Glimpse:      '#8b7fa8',
  'Inner Light':'#e8c547',
  Mastery:      '#3d8bcd',
  Illumination: '#f5a623',
  Oscuridad:    '#1a1a2e',
  Destello:     '#8b7fa8',
  'Luz Interior': '#e8c547',
  Maestría:     '#3d8bcd',
  Iluminación:  '#f5a623',
};

export default async function ForCoachesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = copy[locale as keyof typeof copy] ?? copy.en;

  return (
    <>
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-dark)] px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-300)]">
            {t.eyebrow}
          </p>
          <h1
            className="mt-5 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl"
            style={{ whiteSpace: 'pre-line' }}
          >
            {t.headline}
          </h1>
          <p className="mt-5 text-lg text-[var(--color-brand-100)]">{t.sub}</p>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-[var(--color-border)] px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-brand-950)] sm:text-3xl">
            {t.problemTitle}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-text-secondary)]">{t.problem}</p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[var(--color-surface-subtle)] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 font-display text-2xl font-semibold text-[var(--color-brand-950)] sm:text-3xl">
            {t.featuresTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              >
                <h3 className="text-base font-semibold text-[var(--color-brand-900)]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey stages */}
      <section className="border-t border-[var(--color-border)] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-brand-950)] sm:text-3xl">
            {t.journeyTitle}
          </h2>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{t.journeySub}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-5">
            {t.stages.map((s) => (
              <div
                key={s.name}
                className="flex flex-col gap-3 rounded-xl p-4"
                style={{ backgroundColor: stageColors[s.name] ?? '#1a1a2e' }}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-white/70">{s.name}</p>
                <p className="text-xs leading-relaxed text-white/85">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-dark)] px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-white">{t.ctaTitle}</h2>
          <p className="mt-4 text-[var(--color-brand-200)]">{t.ctaSub}</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={`/${locale}/register`}
              className="rounded-lg bg-[var(--color-brand-500)] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-400)] transition-colors"
            >
              {t.cta}
            </Link>
            <Link
              href={`/${locale}/for-teams`}
              className="text-sm font-medium text-[var(--color-brand-200)] hover:text-white"
            >
              {t.b2bCta} →
            </Link>
          </div>
          <p className="mt-3 text-xs text-[var(--color-brand-300)]">{t.trialNote}</p>
        </div>
      </section>
    </>
  );
}
