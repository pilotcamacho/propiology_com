import Link from 'next/link';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { faqPageSchema, softwareAppSchema, jsonLdScript } from '@/lib/seo/jsonld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'es' ? 'Tu Sistema Operativo Personal' : 'Your Personal OS',
    description:
      locale === 'es'
        ? 'La plataforma de Propiología: hábitos, Puntaje de Disposición, herramientas de IA y micro-aprendizaje por WhatsApp.'
        : 'The Propiology platform: habit tracking, Readiness Score, AI tools, and WhatsApp micro-learning.',
    locale,
    path: '',
  });
}

// ── Bilingual copy ────────────────────────────────────────────────────────────

const copy = {
  en: {
    eyebrow: 'Propiology Platform',
    headline: 'Your Personal OS for\nbehavioral transformation.',
    sub: 'Track habits, understand your Readiness Score, and use AI-powered tools grounded in the science of Propiology — the study of oneself.',
    cta: 'Start Free Trial',
    ctaSub: '14 days free · No credit card required',
    learnMore: 'See how it works',

    howTitle: 'The Propiology Method',
    howSub: 'Three integrated loops that build on each other every day.',
    steps: [
      { n: '01', title: 'Track your habits', body: 'Log daily habits across Body, Mind, Relationships, and Work. Each check-in feeds your Readiness Score and reinforces the neural pathways of change.' },
      { n: '02', title: 'Read your score', body: 'Your Readiness Score (0–100) synthesizes habit adherence, biometric signals, and reflection activity into a single, actionable number every morning.' },
      { n: '03', title: 'Use your AI tools', body: 'Care-Multiplier and Cognitive Shield are AI conversations grounded in Propiology — designed to help you act from your best self, not just your reactive self.' },
    ],

    featuresTitle: 'Everything you need to run your Personal OS',
    features: [
      { icon: '◎', title: 'Readiness Score', desc: 'A daily 0–100 composite of habit adherence, biometric signals, and reflective practice. Know where you stand before the day pulls you in any direction.' },
      { icon: '⬡', title: 'Habit Tracker', desc: 'Create and log habits across 4 categories. Track streaks, spot patterns, and build the behavioral infrastructure of the person you intend to become.' },
      { icon: '◈', title: 'AI Tools', desc: 'Care-Multiplier and Cognitive Shield — AI conversations that use the Propiology framework to give you insight, not just information.' },
      { icon: '◎', title: 'WhatsApp Micro-Learning', desc: 'Daily habit check-ins, your morning Readiness Score, and weekly behavioral insights delivered where you already live — your phone.' },
      { icon: '⬡', title: 'Narrative Journal', desc: 'Daily Propiology reflection prompts with mood tagging. The journal feeds your score and builds the self-narrative that sustains transformation.' },
      { icon: '◈', title: 'Command Center', desc: 'For HR teams, coaching firms, and healthcare networks: aggregate wellbeing analytics with full privacy controls and consent-based access.' },
    ],

    socialTitle: 'Trusted by people serious about transformation',
    testimonials: [
      { quote: 'The Readiness Score changed how I think about mornings. I stopped asking "how do I feel?" and started asking "what does the data say about what I\'m ready for?"', name: 'Rafael M.', role: 'Executive Coach, Bogotá' },
      { quote: 'Our HR team deployed Propiology to 40 employees. Within 90 days, self-reported stress scores dropped and engagement in our habit program hit 78%. Numbers I couldn\'t ignore.', name: 'Claudia V.', role: 'Chief People Officer, Medellín' },
      { quote: 'Cognitive Shield helped me see that I was making a major career decision from sunk-cost bias. That one session was worth the whole subscription.', name: 'Tomás E.', role: 'Product Manager, Mexico City' },
    ],

    pricingTitle: 'Simple, honest pricing',
    pricingCta: 'See full pricing',
    plans: [
      { name: 'Trial', price: 'Free', period: '14 days', bullets: ['Readiness Score', 'Habit Tracker (up to 3 habits)', 'Narrative Journal', 'WhatsApp daily check-in'], cta: 'Start Free Trial', featured: false },
      { name: 'Basic', price: '$19', period: '/month', bullets: ['Everything in Trial', 'Unlimited habits', 'Readiness Score history', 'WhatsApp micro-learning'], cta: 'Get Basic', featured: false },
      { name: 'Pro', price: '$39', period: '/month', bullets: ['Everything in Basic', 'Care-Multiplier AI tool', 'Cognitive Shield AI tool', 'Biometric integrations', 'Priority support'], cta: 'Get Pro', featured: true },
    ],

    faqTitle: 'Frequently asked questions',
    faqs: [
      { q: 'What is the Readiness Score?', a: 'It is a daily 0–100 composite score that combines your habit adherence (40%), biometric signals (30%), and reflective journal activity (30%). It tells you, in a single number, how prepared you are to act from your best self that day.' },
      { q: 'Do I need a wearable to use Propiology?', a: 'No. Biometric signals can be entered manually (sleep hours, energy level, activity minutes). Wearable integrations with Fitbit and Garmin are available on the Pro plan.' },
      { q: 'How does the 14-day trial work?', a: 'You get full access to the Basic plan features for 14 days with no credit card required. At the end of the trial, you choose a plan — or your account moves to a read-only state while your data is preserved for 90 days.' },
      { q: 'Is my data private?', a: 'Yes. Your personal journal entries, biometric data, and AI conversations are private to you by default. In team plans, Corporate Admins see only anonymized aggregate scores unless you explicitly grant individual access.' },
      { q: 'Can my organization use Propiology for a team?', a: 'Yes. The Command Center (B2B plan) is designed for HR departments, coaching firms, and healthcare networks. It provides aggregate Readiness Score analytics with consent-based access to individual data. Contact us for a team demo.' },
      { q: 'What is Propiology?', a: 'Propiology (from Latin propius, "of oneself," and Greek lógos, "study") is the science of self-knowledge created by Dr. Fernando Camacho Ospina. It integrates psychology, neuroscience, and behavioral science into a structured methodology built around 6 personal elements and a 5-stage transformation journey.' },
    ],

    finalCta: 'Ready to run your Personal OS?',
    finalSub: 'Start your 14-day free trial. No credit card required.',
  },

  es: {
    eyebrow: 'Plataforma Propiology',
    headline: 'Tu Sistema Operativo Personal\npara la transformación del comportamiento.',
    sub: 'Registra hábitos, comprende tu Puntaje de Disposición y usa herramientas de IA fundamentadas en la ciencia de la Propiología — el estudio de uno mismo.',
    cta: 'Comenzar Gratis',
    ctaSub: '14 días gratis · Sin tarjeta de crédito',
    learnMore: 'Ver cómo funciona',

    howTitle: 'El Método Propiológico',
    howSub: 'Tres ciclos integrados que se refuerzan mutuamente cada día.',
    steps: [
      { n: '01', title: 'Registra tus hábitos', body: 'Anota hábitos diarios en Cuerpo, Mente, Relaciones y Trabajo. Cada registro alimenta tu Puntaje de Disposición y refuerza las vías neurales del cambio.' },
      { n: '02', title: 'Lee tu puntaje', body: 'Tu Puntaje de Disposición (0–100) sintetiza adherencia a hábitos, señales biométricas y actividad reflexiva en un solo número accionable cada mañana.' },
      { n: '03', title: 'Usa tus herramientas de IA', body: 'Care-Multiplier y Escudo Cognitivo son conversaciones de IA basadas en la Propiología — diseñadas para que actúes desde tu mejor yo, no desde tu yo reactivo.' },
    ],

    featuresTitle: 'Todo lo que necesitas para operar tu Sistema Operativo Personal',
    features: [
      { icon: '◎', title: 'Puntaje de Disposición', desc: 'Un compuesto diario de 0 a 100 de adherencia a hábitos, señales biométricas y práctica reflexiva. Sabe dónde estás antes de que el día te lleve hacia cualquier dirección.' },
      { icon: '⬡', title: 'Seguimiento de Hábitos', desc: 'Crea y registra hábitos en 4 categorías. Sigue rachas, detecta patrones y construye la infraestructura conductual de la persona que decides ser.' },
      { icon: '◈', title: 'Herramientas de IA', desc: 'Care-Multiplier y Escudo Cognitivo — conversaciones de IA que usan el marco de Propiología para darte comprensión, no solo información.' },
      { icon: '◎', title: 'Micro-aprendizaje por WhatsApp', desc: 'Check-ins diarios de hábitos, tu Puntaje de Disposición matutino e insights conductuales semanales entregados donde ya vives — tu teléfono.' },
      { icon: '⬡', title: 'Diario Narrativo', desc: 'Preguntas de reflexión propiológica diarias con etiquetas de estado de ánimo. El diario alimenta tu puntaje y construye la narrativa que sostiene la transformación.' },
      { icon: '◈', title: 'Centro de Comando', desc: 'Para equipos de RR.HH., empresas de coaching y redes de salud: analítica de bienestar agregada con controles de privacidad y acceso basado en consentimiento.' },
    ],

    socialTitle: 'La confianza de personas serias en su transformación',
    testimonials: [
      { quote: 'El Puntaje de Disposición cambió cómo pienso en las mañanas. Dejé de preguntarme "¿cómo me siento?" y empecé a preguntarme "¿para qué estoy listo hoy?"', name: 'Rafael M.', role: 'Coach Ejecutivo, Bogotá' },
      { quote: 'Nuestro equipo de RR.HH. implementó Propiology con 40 empleados. En 90 días, el estrés autoreportado bajó y la participación en el programa de hábitos llegó al 78%.', name: 'Claudia V.', role: 'Chief People Officer, Medellín' },
      { quote: 'El Escudo Cognitivo me ayudó a ver que estaba tomando una decisión de carrera importante desde el sesgo del costo hundido. Esa sesión valió toda la suscripción.', name: 'Tomás E.', role: 'Product Manager, Ciudad de México' },
    ],

    pricingTitle: 'Precios simples y transparentes',
    pricingCta: 'Ver precios completos',
    plans: [
      { name: 'Prueba', price: 'Gratis', period: '14 días', bullets: ['Puntaje de Disposición', 'Seguimiento de hábitos (hasta 3)', 'Diario Narrativo', 'Check-in diario por WhatsApp'], cta: 'Comenzar Gratis', featured: false },
      { name: 'Básico', price: '$19', period: '/mes', bullets: ['Todo lo del plan Prueba', 'Hábitos ilimitados', 'Historial del Puntaje', 'Micro-aprendizaje WhatsApp'], cta: 'Obtener Básico', featured: false },
      { name: 'Pro', price: '$39', period: '/mes', bullets: ['Todo lo del plan Básico', 'Herramienta IA Care-Multiplier', 'Herramienta IA Escudo Cognitivo', 'Integraciones biométricas', 'Soporte prioritario'], cta: 'Obtener Pro', featured: true },
    ],

    faqTitle: 'Preguntas frecuentes',
    faqs: [
      { q: '¿Qué es el Puntaje de Disposición?', a: 'Es un compuesto diario de 0 a 100 que combina tu adherencia a hábitos (40%), señales biométricas (30%) y actividad reflexiva en el diario (30%). Te indica, en un solo número, qué tan preparado estás para actuar desde tu mejor yo ese día.' },
      { q: '¿Necesito un dispositivo wearable para usar Propiology?', a: 'No. Las señales biométricas pueden ingresarse manualmente (horas de sueño, nivel de energía, minutos de actividad). Las integraciones con Fitbit y Garmin están disponibles en el plan Pro.' },
      { q: '¿Cómo funciona el período de prueba de 14 días?', a: 'Obtienes acceso completo a las funciones del plan Básico por 14 días sin tarjeta de crédito. Al final de la prueba, eliges un plan o tu cuenta pasa a modo de solo lectura con tus datos preservados por 90 días.' },
      { q: '¿Mis datos son privados?', a: 'Sí. Tus entradas de diario personal, datos biométricos y conversaciones de IA son privados por defecto. En planes de equipo, los administradores ven solo puntajes agregados anónimos a menos que les otorgues acceso individual explícitamente.' },
      { q: '¿Puede mi organización usar Propiology para un equipo?', a: 'Sí. El Centro de Comando (plan B2B) está diseñado para departamentos de RR.HH., empresas de coaching y redes de salud. Proporciona analítica agregada del Puntaje de Disposición con acceso individual basado en consentimiento.' },
      { q: '¿Qué es la Propiología?', a: 'La Propiología (del latín propius, "de uno mismo", y el griego lógos, "estudio") es la ciencia del autoconocimiento creada por el Dr. Fernando Camacho Ospina. Integra psicología, neurociencia y ciencia del comportamiento en una metodología estructurada con 6 elementos personales y 5 etapas de transformación.' },
    ],

    finalCta: '¿Listo para operar tu Sistema Operativo Personal?',
    finalSub: 'Comienza tu período de prueba de 14 días. Sin tarjeta de crédito.',
  },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = copy[locale as keyof typeof copy] ?? copy.en;

  const faqSchema = faqPageSchema(t.faqs.map((f) => ({ question: f.q, answer: f.a })));
  const appSchema = softwareAppSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(appSchema) }}
      />

      {/* ── Hero ── */}
      <section className="bg-[var(--color-surface-dark)] px-4 py-28 sm:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-300)]">
            {t.eyebrow}
          </p>
          <h1
            className="mt-5 font-display text-4xl font-semibold leading-tight text-white sm:text-6xl"
            style={{ whiteSpace: 'pre-line' }}
          >
            {t.headline}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--color-brand-100)] sm:text-xl">
            {t.sub}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={`/${locale}/register`}
              className="rounded-lg bg-[var(--color-brand-500)] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-400)]"
            >
              {t.cta}
            </Link>
            <Link
              href={`/${locale}/features`}
              className="text-sm font-medium text-[var(--color-brand-200)] hover:text-white"
            >
              {t.learnMore} →
            </Link>
          </div>
          <p className="mt-4 text-xs text-[var(--color-brand-300)]">{t.ctaSub}</p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-b border-[var(--color-border)] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-semibold text-[var(--color-brand-950)] sm:text-4xl">
              {t.howTitle}
            </h2>
            <p className="mt-3 text-[var(--color-text-secondary)]">{t.howSub}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {t.steps.map((s) => (
              <div key={s.n} className="flex flex-col gap-3">
                <span className="text-xs font-bold tracking-widest text-[var(--color-brand-500)]">
                  {s.n}
                </span>
                <h3 className="text-lg font-semibold text-[var(--color-brand-900)]">{s.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="bg-[var(--color-surface-subtle)] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-display text-3xl font-semibold text-[var(--color-brand-950)] sm:text-4xl">
            {t.featuresTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-50)] text-lg text-[var(--color-brand-600)]">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-[var(--color-brand-900)]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href={`/${locale}/features`}
              className="text-sm font-medium text-[var(--color-brand-700)] hover:underline"
            >
              {t.learnMore} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-b border-[var(--color-border)] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-display text-3xl font-semibold text-[var(--color-brand-950)] sm:text-4xl">
            {t.socialTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {t.testimonials.map((tm) => (
              <figure
                key={tm.name}
                className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
              >
                <blockquote className="flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  &ldquo;{tm.quote}&rdquo;
                </blockquote>
                <figcaption>
                  <p className="text-sm font-semibold text-[var(--color-brand-900)]">{tm.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{tm.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing preview ── */}
      <section className="bg-[var(--color-surface-subtle)] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-display text-3xl font-semibold text-[var(--color-brand-950)] sm:text-4xl">
            {t.pricingTitle}
          </h2>
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
                <p
                  className={`text-xs font-bold uppercase tracking-widest ${plan.featured ? 'text-[var(--color-brand-300)]' : 'text-[var(--color-text-muted)]'}`}
                >
                  {plan.name}
                </p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-bold ${plan.featured ? 'text-white' : 'text-[var(--color-brand-950)]'}`}
                  >
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.featured ? 'text-[var(--color-brand-200)]' : 'text-[var(--color-text-muted)]'}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="mt-6 flex flex-1 flex-col gap-2">
                  {plan.bullets.map((b) => (
                    <li
                      key={b}
                      className={`flex items-start gap-2 text-sm ${plan.featured ? 'text-[var(--color-brand-100)]' : 'text-[var(--color-text-secondary)]'}`}
                    >
                      <span className="mt-0.5 text-[var(--color-brand-500)]">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/register`}
                  className={`mt-8 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                    plan.featured
                      ? 'bg-[var(--color-brand-500)] text-white hover:bg-[var(--color-brand-400)]'
                      : 'border border-[var(--color-border)] bg-transparent text-[var(--color-brand-700)] hover:bg-[var(--color-brand-50)]'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
            <Link href={`/${locale}/pricing`} className="font-medium text-[var(--color-brand-700)] hover:underline">
              {t.pricingCta} →
            </Link>
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-b border-[var(--color-border)] px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center font-display text-3xl font-semibold text-[var(--color-brand-950)] sm:text-4xl">
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

      {/* ── Final CTA ── */}
      <section className="bg-[var(--color-surface-dark)] px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">{t.finalCta}</h2>
          <p className="mt-4 text-[var(--color-brand-200)]">{t.finalSub}</p>
          <Link
            href={`/${locale}/register`}
            className="mt-8 inline-block rounded-lg bg-[var(--color-brand-500)] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-400)]"
          >
            {t.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
