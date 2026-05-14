import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/metadata';
import { organizationSchema, jsonLdScript } from '@/lib/seo/jsonld';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === 'es' ? 'Seguridad y Privacidad' : 'Security & Privacy',
    description:
      locale === 'es'
        ? 'Cómo Propiology protege tus datos: AWS Cognito, DynamoDB, S3, cifrado en reposo y en tránsito, y modelo de consentimiento para datos de equipo.'
        : 'How Propiology protects your data: AWS Cognito, DynamoDB, S3, encryption at rest and in transit, and consent model for team data.',
    locale,
    path: '/security',
  });
}

const copy = {
  en: {
    eyebrow: 'Security & Privacy',
    headline: 'Your data belongs to you.',
    sub: 'Propiology is built on AWS infrastructure with security and privacy as architectural properties — not afterthoughts.',

    sections: [
      {
        title: 'Authentication & Identity',
        points: [
          { h: 'AWS Cognito', b: 'All user authentication is managed by AWS Cognito with industry-standard password hashing, email verification, and optional TOTP multi-factor authentication.' },
          { h: 'Role-based access control', b: 'Five Cognito user groups (End-Users, Coaches, Corporate Admins, Healthcare Providers, Super Admins) with group-level permissions enforced at the API and data layer.' },
          { h: 'Session management', b: 'JWT tokens with configurable expiry. No session tokens stored in plain text. Cognito handles token rotation and revocation.' },
        ],
      },
      {
        title: 'Data Storage & Encryption',
        points: [
          { h: 'DynamoDB at rest', b: 'All user data — habits, Readiness Scores, journal entries, AI conversations, and biometric entries — is stored in AWS DynamoDB with encryption at rest using AWS-managed keys (AES-256).' },
          { h: 'S3 object storage', b: 'Reports and profile images are stored in AWS S3 with server-side encryption. Object-level access control enforced by pre-signed URLs with short expiry windows.' },
          { h: 'In-transit encryption', b: 'All data in transit uses TLS 1.2 or higher. API endpoints are HTTPS-only. No unencrypted channels.' },
        ],
      },
      {
        title: 'Individual Data Privacy',
        points: [
          { h: 'Your data is yours', b: 'Journal entries, AI conversations, and biometric data are private to you by default. No administrator — including your organization\'s HR department — can access this data without your explicit consent.' },
          { h: 'Data export', b: 'You can export all your data (habits, scores, journal entries, AI conversations) in JSON format from account settings at any time.' },
          { h: 'Account deletion', b: 'Deleting your account permanently removes your data from our systems within 30 days. Exported reports held by your organization are not affected by this deletion.' },
          { h: '90-day data retention after cancellation', b: 'If your subscription lapses, your data is preserved in read-only mode for 90 days. You can export everything during this window.' },
        ],
      },
      {
        title: 'Team & B2B Data (Command Center)',
        points: [
          { h: 'Anonymized by default', b: 'In the Command Center, individual Readiness Scores are anonymized by default. Corporate Admins see aggregate scores, not individual data.' },
          { h: 'Consent-based individual access', b: 'A Corporate Admin can request individual access. The End-User receives an in-app and WhatsApp notification. The user explicitly accepts or declines. No access is granted without affirmative consent.' },
          { h: 'Audit logging', b: 'Every consent event, access grant, access revocation, and data export is logged to DynamoDB with ISO 8601 timestamp, actor ID, and action type. Logs are immutable and exportable for compliance review.' },
          { h: 'Consent revocation', b: 'Users can revoke individual access grants at any time from account settings. Revocation takes immediate effect.' },
        ],
      },
      {
        title: 'Infrastructure & Compliance',
        points: [
          { h: 'AWS Amplify Gen 2', b: 'Deployed on AWS Amplify Gen 2 with CDK-based backend infrastructure. CI/CD pipeline with automatic deployments from GitHub. Branch preview environments for testing.' },
          { h: 'Region', b: 'Data stored in AWS us-east-1 (United States) by default. Enterprise customers in specific regulatory jurisdictions can request data residency in other AWS regions.' },
          { h: 'HIPAA posture', b: 'Propiology\'s data architecture is designed with HIPAA compliance in mind — Cognito authentication, DynamoDB encryption at rest, audit logging, and consent model. Customers in regulated healthcare settings should consult with their compliance team before deployment.' },
          { h: 'SOC 2', b: 'AWS infrastructure (Cognito, DynamoDB, S3, Lambda) is SOC 2 Type II certified. Propiology application-level SOC 2 compliance is on the roadmap for post-MVP.' },
        ],
      },
      {
        title: 'WhatsApp & Third-Party Integrations',
        points: [
          { h: 'WhatsApp (Twilio)', b: 'WhatsApp messages are sent via Twilio\'s WhatsApp Business API. Your WhatsApp number is stored encrypted in DynamoDB. Opt-in and opt-out is controlled from your account settings. Twilio processes messages under their own privacy policy.' },
          { h: 'Biometric providers', b: 'Fitbit and Garmin integrations use OAuth 2.0. We store only the OAuth refresh token (encrypted) and the biometric data pulled via the API. We do not store raw OAuth credentials.' },
          { h: 'AI providers', b: 'AI tool conversations are sent to Anthropic\'s Claude API (or OpenAI, if configured). Your conversation content is processed according to the AI provider\'s data processing agreement. We store conversation history in DynamoDB under your account.' },
          { h: 'Stripe', b: 'Payment processing uses Stripe. We do not store full payment card numbers. Stripe processes payments under PCI DSS compliance. We store your Stripe customer ID and subscription status in DynamoDB.' },
        ],
      },
    ],

    contactTitle: 'Security questions or incidents',
    contactBody: 'For security disclosures or data privacy inquiries, contact us at ',
    contactEmail: 'hello@propiology.com',
    contactNote: 'We respond to security inquiries within 24 hours on business days.',
  },

  es: {
    eyebrow: 'Seguridad y Privacidad',
    headline: 'Tus datos te pertenecen.',
    sub: 'Propiology está construido sobre infraestructura AWS con seguridad y privacidad como propiedades arquitectónicas — no como pensamientos posteriores.',

    sections: [
      {
        title: 'Autenticación e Identidad',
        points: [
          { h: 'AWS Cognito', b: 'Toda la autenticación de usuarios es gestionada por AWS Cognito con hash de contraseñas estándar de la industria, verificación de correo electrónico y autenticación multifactor TOTP opcional.' },
          { h: 'Control de acceso basado en roles', b: 'Cinco grupos de usuarios de Cognito (Usuarios finales, Coaches, Administradores corporativos, Proveedores de salud, Super admins) con permisos a nivel de grupo aplicados en la capa de API y datos.' },
          { h: 'Gestión de sesiones', b: 'Tokens JWT con expiración configurable. Sin tokens de sesión almacenados en texto plano. Cognito gestiona la rotación y revocación de tokens.' },
        ],
      },
      {
        title: 'Almacenamiento y Cifrado de Datos',
        points: [
          { h: 'DynamoDB en reposo', b: 'Todos los datos de usuario — hábitos, Puntajes de Disposición, entradas de diario, conversaciones de IA y entradas biométricas — se almacenan en AWS DynamoDB con cifrado en reposo usando claves gestionadas por AWS (AES-256).' },
          { h: 'Almacenamiento de objetos S3', b: 'Los reportes e imágenes de perfil se almacenan en AWS S3 con cifrado del lado del servidor. Control de acceso a nivel de objeto aplicado por URLs pre-firmadas con ventanas de expiración cortas.' },
          { h: 'Cifrado en tránsito', b: 'Todos los datos en tránsito usan TLS 1.2 o superior. Los endpoints de la API son HTTPS únicamente. Sin canales sin cifrar.' },
        ],
      },
      {
        title: 'Privacidad de Datos Individuales',
        points: [
          { h: 'Tus datos son tuyos', b: 'Las entradas de diario, conversaciones de IA y datos biométricos son privados para ti por defecto. Ningún administrador — incluyendo el departamento de RR.HH. de tu organización — puede acceder a estos datos sin tu consentimiento explícito.' },
          { h: 'Exportación de datos', b: 'Puedes exportar todos tus datos (hábitos, puntajes, entradas de diario, conversaciones de IA) en formato JSON desde la configuración de la cuenta en cualquier momento.' },
          { h: 'Eliminación de cuenta', b: 'Eliminar tu cuenta elimina permanentemente tus datos de nuestros sistemas en 30 días. Los reportes exportados en posesión de tu organización no se ven afectados por esta eliminación.' },
          { h: 'Retención de datos de 90 días después de la cancelación', b: 'Si tu suscripción caduca, tus datos se preservan en modo de solo lectura por 90 días. Puedes exportar todo durante esta ventana.' },
        ],
      },
      {
        title: 'Datos de Equipo y B2B (Centro de Comando)',
        points: [
          { h: 'Anónimo por defecto', b: 'En el Centro de Comando, los Puntajes de Disposición individuales son anónimos por defecto. Los administradores corporativos ven puntajes agregados, no datos individuales.' },
          { h: 'Acceso individual basado en consentimiento', b: 'Un administrador corporativo puede solicitar acceso individual. El usuario final recibe una notificación en la app y por WhatsApp. El usuario acepta o rechaza explícitamente. No se otorga acceso sin consentimiento afirmativo.' },
          { h: 'Registro de auditoría', b: 'Cada evento de consentimiento, otorgamiento de acceso, revocación de acceso y exportación de datos se registra en DynamoDB con marca de tiempo ISO 8601, ID del actor y tipo de acción. Los registros son inmutables y exportables para revisión de cumplimiento.' },
          { h: 'Revocación de consentimiento', b: 'Los usuarios pueden revocar los otorgamientos de acceso individual en cualquier momento desde la configuración de la cuenta. La revocación tiene efecto inmediato.' },
        ],
      },
      {
        title: 'Infraestructura y Cumplimiento',
        points: [
          { h: 'AWS Amplify Gen 2', b: 'Implementado en AWS Amplify Gen 2 con infraestructura de backend basada en CDK. Pipeline de CI/CD con implementaciones automáticas desde GitHub. Entornos de vista previa de ramas para pruebas.' },
          { h: 'Región', b: 'Datos almacenados en AWS us-east-1 (Estados Unidos) por defecto. Los clientes empresariales en jurisdicciones regulatorias específicas pueden solicitar residencia de datos en otras regiones de AWS.' },
          { h: 'Postura HIPAA', b: 'La arquitectura de datos de Propiology está diseñada con el cumplimiento de HIPAA en mente — autenticación Cognito, cifrado DynamoDB en reposo, registro de auditoría y modelo de consentimiento. Los clientes en entornos de salud regulados deben consultar con su equipo de cumplimiento antes de la implementación.' },
          { h: 'SOC 2', b: 'La infraestructura AWS (Cognito, DynamoDB, S3, Lambda) tiene certificación SOC 2 Tipo II. El cumplimiento SOC 2 a nivel de aplicación de Propiology está en la hoja de ruta para después del MVP.' },
        ],
      },
      {
        title: 'WhatsApp e Integraciones de Terceros',
        points: [
          { h: 'WhatsApp (Twilio)', b: 'Los mensajes de WhatsApp se envían a través de la API de WhatsApp Business de Twilio. Tu número de WhatsApp se almacena cifrado en DynamoDB. La suscripción y cancelación se controla desde la configuración de tu cuenta. Twilio procesa los mensajes según su propia política de privacidad.' },
          { h: 'Proveedores biométricos', b: 'Las integraciones de Fitbit y Garmin usan OAuth 2.0. Almacenamos solo el token de actualización OAuth (cifrado) y los datos biométricos obtenidos a través de la API. No almacenamos credenciales OAuth en bruto.' },
          { h: 'Proveedores de IA', b: 'Las conversaciones de herramientas de IA se envían a la API de Claude de Anthropic (o OpenAI, si se configura). Tu contenido de conversación se procesa según el acuerdo de procesamiento de datos del proveedor de IA. Almacenamos el historial de conversaciones en DynamoDB bajo tu cuenta.' },
          { h: 'Stripe', b: 'El procesamiento de pagos usa Stripe. No almacenamos números completos de tarjetas de pago. Stripe procesa los pagos bajo cumplimiento PCI DSS. Almacenamos tu ID de cliente de Stripe y el estado de la suscripción en DynamoDB.' },
        ],
      },
    ],

    contactTitle: 'Preguntas de seguridad o incidentes',
    contactBody: 'Para divulgaciones de seguridad o consultas de privacidad de datos, contáctanos en ',
    contactEmail: 'hello@propiology.com',
    contactNote: 'Respondemos a consultas de seguridad dentro de las 24 horas en días hábiles.',
  },
};

export default async function SecurityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = copy[locale as keyof typeof copy] ?? copy.en;
  const orgSchema = organizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(orgSchema) }}
      />

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

      {/* Sections */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl flex flex-col gap-14">
          {t.sections.map((section) => (
            <div key={section.title}>
              <h2 className="border-b border-[var(--color-border)] pb-3 font-display text-2xl font-semibold text-[var(--color-brand-950)]">
                {section.title}
              </h2>
              <div className="mt-6 flex flex-col gap-5">
                {section.points.map((p) => (
                  <div key={p.h}>
                    <h3 className="text-sm font-semibold text-[var(--color-brand-900)]">{p.h}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">{p.b}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-brand-950)]">{t.contactTitle}</h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {t.contactBody}
            <a href={`mailto:${t.contactEmail}`} className="font-medium text-[var(--color-brand-700)] hover:underline">
              {t.contactEmail}
            </a>
            .
          </p>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">{t.contactNote}</p>
        </div>
      </section>
    </>
  );
}
