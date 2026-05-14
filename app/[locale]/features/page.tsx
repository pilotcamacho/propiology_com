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
    title: locale === 'es' ? 'Características' : 'Features',
    description:
      locale === 'es'
        ? 'Todas las herramientas de Propiology: Puntaje de Disposición, rastreador de hábitos, IA, WhatsApp y Centro de Comando B2B.'
        : 'All Propiology tools: Readiness Score, habit tracker, AI tools, WhatsApp micro-learning, and B2B Command Center.',
    locale,
    path: '/features',
  });
}

const copy = {
  en: {
    eyebrow: 'Platform Features',
    headline: 'Built for individual transformation.\nDesigned for team performance.',
    sub: 'One platform, two experiences — a Personal OS for individuals and a Command Center for the organizations that support them.',

    b2cLabel: 'For Individuals',
    b2cFeatures: [
      {
        title: 'Readiness Score',
        sub: 'Know where you stand, every morning',
        desc: 'A daily 0–100 composite that synthesizes your habit adherence (40%), biometric signals (30%), and reflective journal activity (30%). Color-coded: gold for excellence, teal for good progress, amber for building, red for rest needed.',
        detail: ['Recalculated every morning', 'Tracks 30-day trend', 'Component breakdown view', 'Milestone badges at 7, 14, 30, 90 days'],
      },
      {
        title: 'Habit Tracker',
        sub: 'Build the behavioral infrastructure of the person you intend to become',
        desc: 'Create unlimited habits across 4 categories — Body, Mind, Relationships, and Work. Log daily completions, track streaks, and see pattern data that reveals when you drift and what pulls you back.',
        detail: ['Daily and weekly frequency options', 'Streak tracking with visual indicators', 'Category-based filtering', 'WhatsApp check-in integration'],
      },
      {
        title: 'Care-Multiplier (AI)',
        sub: 'Understand your relational patterns — not just your behavior',
        desc: 'Describe a relationship dynamic, a recurring conflict, or a pattern you cannot break. Care-Multiplier responds using the Propiology Circle of Love framework to give you insight and specific micro-actions. Conversations stored and accessible across sessions.',
        detail: ["Grounded in Propiology's 6 elements", 'Stores conversation history', 'Generates specific micro-actions', 'Available in English and Spanish'],
        pro: true,
      },
      {
        title: 'Cognitive Shield (AI)',
        sub: 'See your decisions clearly before they make themselves',
        desc: 'Describe a decision or thought pattern. Cognitive Shield identifies the active cognitive biases — confirmation bias, sunk cost, availability heuristic — and offers a Propiology-aligned reframe. Commit to a new framing and save it as a journal entry.',
        detail: ['Identifies 15+ cognitive biases', 'Propiology reframe for each pattern', 'Saves reframes as journal entries', 'Step-by-step guided process'],
        pro: true,
      },
      {
        title: 'Narrative Journal',
        sub: 'The self-knowledge that makes everything else work',
        desc: 'Daily Propiology reflection prompts (30-prompt rotating cycle) with mood tagging using Propiology emotional vocabulary. Journal activity contributes 30% of your Readiness Score. Entry list with mood history and individual entry view.',
        detail: ['30-prompt rotating cycle', '7 mood states (Propiology vocabulary)', 'Feeds Readiness Score', 'Available in English and Spanish'],
      },
      {
        title: 'WhatsApp Micro-Learning',
        sub: 'Your habit loop, where your life actually happens',
        desc: 'Link your WhatsApp number and receive: daily habit check-ins (reply ✅ or ❌), your morning Readiness Score digest, weekly Propiology behavioral insights, and AI tool follow-up nudges. Responses are logged automatically.',
        detail: ['Daily check-ins', 'Morning score digest', 'Weekly behavioral insights', 'AI follow-up nudges'],
      },
      {
        title: 'Biometric Integration',
        sub: 'Let your body speak',
        desc: 'Connect Fitbit or Garmin to pull HRV, sleep quality, resting heart rate, steps, and activity minutes. Biometric data contributes 30% of your Readiness Score. Manual entry available for users without wearables.',
        detail: ['Fitbit, Garmin, Apple Health (Pro)', 'HRV, sleep, heart rate, steps', 'Manual entry fallback', '30% of Readiness Score'],
        pro: true,
      },
    ],

    b2bLabel: 'For Organizations',
    b2bIntro: "The Command Center gives HR departments, coaching firms, and healthcare networks aggregate visibility into their team's wellbeing — without surfacing individual private data.",
    b2bFeatures: [
      {
        title: 'Aggregate Readiness Score',
        desc: "See your team's collective Readiness Score as a daily aggregate. Track 7-day and 30-day trends. Receive alerts when aggregate score drops below thresholds you configure.",
      },
      {
        title: 'Team Analytics',
        desc: 'Anonymized adherence rates by habit category. Engagement rates with WhatsApp check-ins. AI tool usage summary. All data is aggregated — individual scores are anonymized by default.',
      },
      {
        title: 'Privacy-First Individual Access',
        desc: 'Corporate Admins can request consent-based access to individual data. The End-User receives an in-app and WhatsApp notification and explicitly accepts or declines. Every consent event is logged.',
      },
      {
        title: 'Program Management',
        desc: 'Assign active Propiology programs to your team — structured sequences of habits, journal prompts, and AI tool sessions. Track program completion and engagement rates.',
      },
      {
        title: 'Reporting',
        desc: 'Download weekly and monthly PDF and CSV reports on team aggregate Readiness Score, adherence rates, and program completion. Reports are organization-scoped and stored securely on AWS S3.',
      },
      {
        title: 'Seat Management',
        desc: 'Invite team members by email (one-time registration link via SES). Remove seats. Transfer licenses between members. Annual per-seat licensing with invoice billing.',
      },
    ],

    cta: 'Start Free Trial',
    ctaB2b: 'Contact Sales',
    ctaSub: '14 days free · No credit card required',
    proTag: 'Pro',
  },

  es: {
    eyebrow: 'Características de la Plataforma',
    headline: 'Construido para la transformación individual.\nDiseñado para el rendimiento del equipo.',
    sub: 'Una plataforma, dos experiencias — un Sistema Operativo Personal para individuos y un Centro de Comando para las organizaciones que los apoyan.',

    b2cLabel: 'Para Personas',
    b2cFeatures: [
      {
        title: 'Puntaje de Disposición',
        sub: 'Sabe dónde estás cada mañana',
        desc: 'Un compuesto diario de 0 a 100 que sintetiza tu adherencia a hábitos (40%), señales biométricas (30%) y actividad reflexiva en el diario (30%). Codificado por colores: dorado para excelencia, teal para buen progreso, ámbar para en construcción, rojo para necesidad de descanso.',
        detail: ['Recalculado cada mañana', 'Rastrea tendencia de 30 días', 'Vista de desglose por componente', 'Insignias de hito a los 7, 14, 30, 90 días'],
      },
      {
        title: 'Seguimiento de Hábitos',
        sub: 'Construye la infraestructura conductual de la persona que decides ser',
        desc: 'Crea hábitos ilimitados en 4 categorías — Cuerpo, Mente, Relaciones y Trabajo. Registra completaciones diarias, sigue rachas y ve datos de patrones que revelan cuándo te desvías y qué te regresa.',
        detail: ['Opciones de frecuencia diaria y semanal', 'Seguimiento de rachas con indicadores visuales', 'Filtrado por categoría', 'Integración de check-in por WhatsApp'],
      },
      {
        title: 'Care-Multiplier (IA)',
        sub: 'Comprende tus patrones relacionales — no solo tu comportamiento',
        desc: 'Describe una dinámica de relación, un conflicto recurrente o un patrón que no puedes romper. Care-Multiplier responde usando el marco del Círculo del Amor de Propiología para darte comprensión y micro-acciones específicas.',
        detail: ['Basado en los 6 elementos de Propiología', 'Almacena historial de conversaciones', 'Genera micro-acciones específicas', 'Disponible en inglés y español'],
        pro: true,
      },
      {
        title: 'Escudo Cognitivo (IA)',
        sub: 'Ve tus decisiones con claridad antes de que se tomen solas',
        desc: 'Describe una decisión o patrón de pensamiento. El Escudo Cognitivo identifica los sesgos cognitivos activos — sesgo de confirmación, costo hundido, heurística de disponibilidad — y ofrece un reencuadre propiológico.',
        detail: ['Identifica más de 15 sesgos cognitivos', 'Reencuadre propiológico para cada patrón', 'Guarda reencuadres como entradas de diario', 'Proceso guiado paso a paso'],
        pro: true,
      },
      {
        title: 'Diario Narrativo',
        sub: 'El autoconocimiento que hace funcionar todo lo demás',
        desc: 'Preguntas de reflexión propiológica diarias (ciclo rotativo de 30 preguntas) con etiquetas de estado de ánimo usando el vocabulario emocional de Propiología. La actividad del diario contribuye el 30% de tu Puntaje de Disposición.',
        detail: ['Ciclo rotativo de 30 preguntas', '7 estados de ánimo (vocabulario Propiología)', 'Alimenta el Puntaje de Disposición', 'Disponible en inglés y español'],
      },
      {
        title: 'Micro-aprendizaje por WhatsApp',
        sub: 'Tu ciclo de hábitos, donde realmente vives',
        desc: 'Vincula tu número de WhatsApp y recibe: check-ins diarios de hábitos (responde ✅ o ❌), tu resumen matutino del Puntaje de Disposición, insights conductuales semanales de Propiología y recordatorios de seguimiento de herramientas de IA.',
        detail: ['Check-ins diarios', 'Resumen matutino del puntaje', 'Insights conductuales semanales', 'Recordatorios de seguimiento de IA'],
      },
      {
        title: 'Integración Biométrica',
        sub: 'Deja que tu cuerpo hable',
        desc: 'Conecta Fitbit o Garmin para obtener HRV, calidad del sueño, frecuencia cardíaca en reposo, pasos y minutos de actividad. Los datos biométricos contribuyen el 30% de tu Puntaje de Disposición. Entrada manual disponible para usuarios sin wearables.',
        detail: ['Fitbit, Garmin, Apple Health (Pro)', 'HRV, sueño, frecuencia cardíaca, pasos', 'Entrada manual de respaldo', '30% del Puntaje de Disposición'],
        pro: true,
      },
    ],

    b2bLabel: 'Para Organizaciones',
    b2bIntro: 'El Centro de Comando da a los departamentos de RR.HH., empresas de coaching y redes de salud visibilidad agregada del bienestar de su equipo — sin exponer datos individuales privados.',
    b2bFeatures: [
      {
        title: 'Puntaje de Disposición Agregado',
        desc: 'Ve el Puntaje de Disposición colectivo de tu equipo como un agregado diario. Rastrea tendencias de 7 y 30 días. Recibe alertas cuando el puntaje agregado cae por debajo de umbrales que configures.',
      },
      {
        title: 'Analítica de Equipo',
        desc: 'Tasas de adherencia anónimas por categoría de hábito. Tasas de participación en check-ins de WhatsApp. Resumen de uso de herramientas de IA. Todos los datos son agregados — los puntajes individuales son anónimos por defecto.',
      },
      {
        title: 'Acceso Individual con Privacidad Primero',
        desc: 'Los administradores corporativos pueden solicitar acceso basado en consentimiento a datos individuales. El usuario final recibe una notificación en la app y por WhatsApp y acepta o rechaza explícitamente. Cada evento de consentimiento queda registrado.',
      },
      {
        title: 'Gestión de Programas',
        desc: 'Asigna programas activos de Propiología a tu equipo — secuencias estructuradas de hábitos, preguntas de diario y sesiones de herramientas de IA. Rastrea la finalización y tasas de participación.',
      },
      {
        title: 'Reportes',
        desc: 'Descarga reportes semanales y mensuales en PDF y CSV sobre el Puntaje de Disposición agregado del equipo, tasas de adherencia y finalización de programas. Los reportes están limitados a la organización y almacenados de forma segura en AWS S3.',
      },
      {
        title: 'Gestión de Asientos',
        desc: 'Invita miembros del equipo por correo electrónico (enlace de registro de un solo uso vía SES). Elimina asientos. Transfiere licencias entre miembros. Licenciamiento anual por asiento con facturación por invoice.',
      },
    ],

    cta: 'Comenzar Gratis',
    ctaB2b: 'Contactar Ventas',
    ctaSub: '14 días gratis · Sin tarjeta de crédito',
    proTag: 'Pro',
  },
};

export default async function FeaturesPage({ params }: { params: Promise<{ locale: string }> }) {
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
          <h1
            className="mt-4 font-display text-4xl font-semibold leading-tight text-[var(--color-brand-950)] sm:text-5xl"
            style={{ whiteSpace: 'pre-line' }}
          >
            {t.headline}
          </h1>
          <p className="mt-5 text-lg text-[var(--color-text-secondary)]">{t.sub}</p>
        </div>
      </section>

      {/* B2C Features */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 font-display text-2xl font-semibold text-[var(--color-brand-950)] sm:text-3xl">
            {t.b2cLabel}
          </h2>
          <div className="flex flex-col gap-10">
            {t.b2cFeatures.map((f) => (
              <div
                key={f.title}
                className="grid gap-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:grid-cols-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-[var(--color-brand-900)]">{f.title}</h3>
                    {'pro' in f && f.pro && (
                      <span className="rounded-full bg-[var(--color-gold-100)] px-2 py-0.5 text-xs font-semibold text-[var(--color-gold-700)]">
                        {t.proTag}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs font-medium text-[var(--color-brand-600)]">{f.sub}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">{f.desc}</p>
                </div>
                <ul className="flex flex-col gap-2 self-start">
                  {f.detail.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                      <span className="mt-0.5 text-[var(--color-brand-500)]">✓</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Features */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-brand-950)] sm:text-3xl">
            {t.b2bLabel}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {t.b2bIntro}
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.b2bFeatures.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
              >
                <h3 className="text-base font-semibold text-[var(--color-brand-900)]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}/register`}
              className="rounded-lg bg-[var(--color-brand-600)] px-6 py-2.5 text-center text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors"
            >
              {t.cta}
            </Link>
            <Link
              href={`/${locale}/for-teams`}
              className="rounded-lg border border-[var(--color-border)] px-6 py-2.5 text-center text-sm font-medium text-[var(--color-brand-700)] hover:bg-[var(--color-brand-50)] transition-colors"
            >
              {t.ctaB2b}
            </Link>
          </div>
          <p className="mt-3 text-xs text-[var(--color-text-muted)]">{t.ctaSub}</p>
        </div>
      </section>
    </>
  );
}
