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
    title: locale === 'es' ? 'Para Equipos y Organizaciones' : 'For Teams & Organizations',
    description:
      locale === 'es'
        ? 'El Centro de Comando de Propiology: analítica de bienestar agregada para RR.HH., coaching y salud con controles de privacidad completos.'
        : 'Propiology Command Center: aggregate wellbeing analytics for HR, coaching, and healthcare with full privacy controls.',
    locale,
    path: '/for-teams',
  });
}

const copy = {
  en: {
    eyebrow: 'For Organizations',
    headline: 'Run behavioral transformation\nat the team level.',
    sub: 'The Propiology Command Center gives HR departments, coaching firms, and healthcare networks the aggregate visibility they need — without compromising individual privacy.',

    verticals: [
      {
        label: 'HR & People Teams',
        headline: 'Move from wellness surveys to behavioral data',
        body: 'Quarterly engagement surveys tell you what happened. Propiology tells you what\'s happening now. Track aggregate Readiness Scores, habit adherence rates, and AI tool engagement across your workforce — updated daily.',
        outcomes: ['Identify burnout patterns before they become attrition', 'Measure the ROI of wellness initiatives with behavioral data', 'Track adherence to company-assigned wellbeing programs'],
      },
      {
        label: 'Coaching Firms',
        headline: 'Scale your practice without losing depth',
        body: 'Propiology gives coaches an operational view of every client\'s behavioral progress between sessions. See who is engaging, who is drifting, and where AI tools are surfacing patterns that need human attention.',
        outcomes: ['Daily behavioral data between coaching sessions', 'Consent-based individual access to client dashboards', 'Program management for structured coaching sequences'],
      },
      {
        label: 'Healthcare & Clinics',
        headline: 'Behavioral data that complements clinical assessment',
        body: 'Track patient habit adherence, daily Readiness Scores, and journal engagement alongside clinical data. HIPAA-compliant data architecture built on AWS Cognito and DynamoDB with audit logging for every consent event.',
        outcomes: ['HIPAA-compliant data architecture (AWS)', 'Consent audit log for every individual access event', 'Complement clinical assessment with daily behavioral signals'],
      },
    ],

    howTitle: 'How the Command Center works',
    steps: [
      { n: '01', title: 'Invite your team', body: 'Send email invitations from the Command Center. Each member receives a one-time registration link and completes the Propiology onboarding wizard (role, goals, language, initial assessment).' },
      { n: '02', title: 'Monitor aggregate data', body: 'Your Command Center dashboard shows daily aggregate Readiness Scores, 7-day and 30-day trends, habit adherence rates by category, and AI tool engagement. All individual data is anonymized by default.' },
      { n: '03', title: 'Request individual access', body: 'If you need to review an individual\'s data (coaching session, clinical assessment), request consent-based access. The team member receives a notification and accepts or declines. Every event is logged.' },
      { n: '04', title: 'Assign programs', body: 'Create and assign structured Propiology programs — sequences of habits, journal prompts, and AI tool sessions. Track completion rates and engagement from the programs dashboard.' },
    ],

    privacyTitle: 'Privacy first. Always.',
    privacyPoints: [
      { title: 'Anonymized by default', body: 'Individual Readiness Scores, journal entries, and AI conversations are never visible to administrators without explicit user consent.' },
      { title: 'Consent-based access', body: 'Every individual data access request triggers a notification to the user. Users can accept or decline — and can revoke access at any time.' },
      { title: 'Audit logging', body: 'Every consent event, access grant, and data export is logged to DynamoDB with timestamp and actor ID. Exportable for compliance review.' },
      { title: 'AWS security', body: 'Data stored on AWS DynamoDB and S3 with Cognito authentication. Encryption at rest and in transit. SOC 2 compliance posture documented on our security page.' },
    ],

    ctaTitle: 'Ready to bring Propiology to your organization?',
    ctaSub: 'Talk to us about seat pricing, onboarding, and custom programs.',
    cta: 'Contact Sales',
    ctaLink: 'mailto:hello@propiology.com',
    trialNote: 'Or start a 14-day individual trial to experience the platform first.',
    trialCta: 'Start Free Trial',
  },

  es: {
    eyebrow: 'Para Organizaciones',
    headline: 'Implementa la transformación conductual\na nivel de equipo.',
    sub: 'El Centro de Comando de Propiology da a los departamentos de RR.HH., empresas de coaching y redes de salud la visibilidad agregada que necesitan — sin comprometer la privacidad individual.',

    verticals: [
      {
        label: 'RR.HH. y Equipos de Personas',
        headline: 'Pasa de encuestas de bienestar a datos conductuales',
        body: 'Las encuestas de compromiso trimestral te dicen lo que pasó. Propiology te dice lo que está pasando ahora. Rastrea Puntajes de Disposición agregados, tasas de adherencia a hábitos y participación en herramientas de IA en toda tu fuerza laboral — actualizado diariamente.',
        outcomes: ['Identifica patrones de agotamiento antes de que se conviertan en rotación', 'Mide el ROI de las iniciativas de bienestar con datos conductuales', 'Sigue la adherencia a programas de bienestar asignados por la empresa'],
      },
      {
        label: 'Empresas de Coaching',
        headline: 'Escala tu práctica sin perder profundidad',
        body: 'Propiology da a los coaches una vista operativa del progreso conductual de cada cliente entre sesiones. Ve quién está comprometido, quién se está desviando y dónde las herramientas de IA están revelando patrones que necesitan atención humana.',
        outcomes: ['Datos conductuales diarios entre sesiones de coaching', 'Acceso individual basado en consentimiento a dashboards de clientes', 'Gestión de programas para secuencias de coaching estructuradas'],
      },
      {
        label: 'Salud y Clínicas',
        headline: 'Datos conductuales que complementan la evaluación clínica',
        body: 'Rastrea la adherencia a hábitos del paciente, Puntajes de Disposición diarios y participación en el diario junto con datos clínicos. Arquitectura de datos compatible con HIPAA construida en AWS Cognito y DynamoDB con registro de auditoría para cada evento de consentimiento.',
        outcomes: ['Arquitectura de datos compatible con HIPAA (AWS)', 'Registro de auditoría de consentimiento para cada evento de acceso individual', 'Complementa la evaluación clínica con señales conductuales diarias'],
      },
    ],

    howTitle: 'Cómo funciona el Centro de Comando',
    steps: [
      { n: '01', title: 'Invita a tu equipo', body: 'Envía invitaciones por correo desde el Centro de Comando. Cada miembro recibe un enlace de registro de un solo uso y completa el asistente de incorporación de Propiología (rol, objetivos, idioma, evaluación inicial).' },
      { n: '02', title: 'Monitorea datos agregados', body: 'Tu dashboard del Centro de Comando muestra Puntajes de Disposición agregados diarios, tendencias de 7 y 30 días, tasas de adherencia a hábitos por categoría y participación en herramientas de IA. Todos los datos individuales son anónimos por defecto.' },
      { n: '03', title: 'Solicita acceso individual', body: 'Si necesitas revisar los datos de un individuo (sesión de coaching, evaluación clínica), solicita acceso basado en consentimiento. El miembro del equipo recibe una notificación y acepta o rechaza. Cada evento queda registrado.' },
      { n: '04', title: 'Asigna programas', body: 'Crea y asigna programas estructurados de Propiología — secuencias de hábitos, preguntas de diario y sesiones de herramientas de IA. Rastrea tasas de finalización y participación desde el dashboard de programas.' },
    ],

    privacyTitle: 'Privacidad primero. Siempre.',
    privacyPoints: [
      { title: 'Anónimo por defecto', body: 'Los Puntajes de Disposición individuales, entradas de diario y conversaciones de IA nunca son visibles para los administradores sin el consentimiento explícito del usuario.' },
      { title: 'Acceso basado en consentimiento', body: 'Cada solicitud de acceso a datos individuales activa una notificación al usuario. Los usuarios pueden aceptar o rechazar — y pueden revocar el acceso en cualquier momento.' },
      { title: 'Registro de auditoría', body: 'Cada evento de consentimiento, otorgamiento de acceso y exportación de datos se registra en DynamoDB con marca de tiempo e ID del actor. Exportable para revisión de cumplimiento.' },
      { title: 'Seguridad AWS', body: 'Datos almacenados en AWS DynamoDB y S3 con autenticación Cognito. Cifrado en reposo y en tránsito. Postura de cumplimiento SOC 2 documentada en nuestra página de seguridad.' },
    ],

    ctaTitle: '¿Listo para llevar Propiology a tu organización?',
    ctaSub: 'Habla con nosotros sobre precios por asiento, incorporación y programas personalizados.',
    cta: 'Contactar Ventas',
    ctaLink: 'mailto:hello@propiology.com',
    trialNote: 'O comienza una prueba individual de 14 días para experimentar la plataforma primero.',
    trialCta: 'Comenzar Gratis',
  },
};

export default async function ForTeamsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = copy[locale as keyof typeof copy] ?? copy.en;

  return (
    <>
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-dark)] px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
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

      {/* Verticals */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl flex flex-col gap-12">
          {t.verticals.map((v) => (
            <div key={v.label} className="grid gap-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
                  {v.label}
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-[var(--color-brand-950)]">
                  {v.headline}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">{v.body}</p>
              </div>
              <ul className="flex flex-col gap-3 self-start">
                {v.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                    <span className="mt-0.5 shrink-0 text-[var(--color-brand-500)]">→</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 font-display text-2xl font-semibold text-[var(--color-brand-950)] sm:text-3xl">
            {t.howTitle}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.map((s) => (
              <div key={s.n} className="flex flex-col gap-3">
                <span className="text-xs font-bold tracking-widest text-[var(--color-brand-500)]">{s.n}</span>
                <h3 className="text-base font-semibold text-[var(--color-brand-900)]">{s.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="border-t border-[var(--color-border)] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 font-display text-2xl font-semibold text-[var(--color-brand-950)] sm:text-3xl">
            {t.privacyTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {t.privacyPoints.map((p) => (
              <div key={p.title} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <h3 className="text-base font-semibold text-[var(--color-brand-900)]">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{p.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-[var(--color-text-muted)]">
            <Link href={`/${locale}/security`} className="font-medium text-[var(--color-brand-700)] hover:underline">
              Read our full security and privacy documentation →
            </Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-dark)] px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-white">{t.ctaTitle}</h2>
          <p className="mt-4 text-[var(--color-brand-200)]">{t.ctaSub}</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={t.ctaLink}
              className="rounded-lg bg-[var(--color-brand-500)] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-400)] transition-colors"
            >
              {t.cta}
            </a>
            <Link
              href={`/${locale}/register`}
              className="text-sm font-medium text-[var(--color-brand-200)] hover:text-white"
            >
              {t.trialCta} →
            </Link>
          </div>
          <p className="mt-3 text-xs text-[var(--color-brand-300)]">{t.trialNote}</p>
        </div>
      </section>
    </>
  );
}
