export interface WelcomeEmailData {
  name: string;
  locale: 'en' | 'es';
  journeyStage: string;
  dashboardUrl: string;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');
}

export function welcomeEmail(data: WelcomeEmailData): { subject: string; html: string; text: string } {
  const { name, locale, journeyStage, dashboardUrl } = data;
  const stageName = capitalize(journeyStage);

  if (locale === 'es') {
    const subject = `Bienvenido/a a Propiology, ${name} — tu viaje comienza ahora`;
    const text = `
Hola ${name},

Bienvenido/a a Propiology. Tu cuenta está activa y tu prueba gratuita de 14 días ha comenzado.

Tu etapa actual: ${stageName}

Lo que puedes hacer ahora:
• Revisa tu Puntaje de Disposición inicial en el panel de control
• Registra tu primer hábito diario
• Explora las herramientas de IA (Care-Multiplier y Escudo Cognitivo)
• Activa los mensajes de WhatsApp para recibir recordatorios diarios

Accede a tu panel de control:
${dashboardUrl}

Durante los próximos 14 días tienes acceso completo a todas las funciones Pro. Después podrás elegir el plan que mejor se adapte a ti.

Si tienes alguna pregunta, responde a este correo.

— El equipo de Propiology
hello@propiology.com
`.trim();

    const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#f2ede0;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2ede0;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <!-- Header -->
        <tr><td style="background:#0b2a38;padding:36px 48px;">
          <p style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Propiology</p>
          <p style="margin:6px 0 0;font-size:13px;color:#83d6d2;letter-spacing:0.5px;">Tu Sistema Operativo Personal</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:48px;">
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f2f4f;">Hola ${name},</h1>
          <p style="margin:0 0 24px;font-size:15px;color:#22496b;line-height:1.6;">Bienvenido/a a Propiology. Tu cuenta está activa y tu <strong>prueba gratuita de 14 días</strong> ha comenzado.</p>

          <!-- Stage pill -->
          <div style="background:#0b2a38;border-radius:10px;padding:20px 24px;margin-bottom:32px;">
            <p style="margin:0 0 4px;font-size:12px;color:#83d6d2;text-transform:uppercase;letter-spacing:1px;">Tu etapa actual</p>
            <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">${stageName}</p>
          </div>

          <p style="margin:0 0 16px;font-size:14px;font-weight:600;color:#0f2f4f;">Lo que puedes hacer ahora:</p>
          <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
            ${[
              ['📊', 'Revisa tu Puntaje de Disposición inicial'],
              ['✅', 'Registra tu primer hábito diario'],
              ['🤖', 'Explora Care-Multiplier y Escudo Cognitivo'],
              ['💬', 'Activa mensajes de WhatsApp para recordatorios diarios'],
            ].map(([icon, text]) => `
            <tr><td style="padding:8px 0;font-size:14px;color:#22496b;"><span style="margin-right:10px;">${icon}</span>${text}</td></tr>`).join('')}
          </table>

          <a href="${dashboardUrl}" style="display:inline-block;background:#1aa6ad;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;">Ir a mi panel de control →</a>

          <p style="margin:32px 0 0;font-size:13px;color:#6b7280;line-height:1.6;">Tienes acceso completo a todas las funciones Pro durante 14 días. Después podrás elegir el plan que mejor se adapte a ti.</p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f2ede0;padding:24px 48px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#6b7280;">© ${new Date().getFullYear()} Propiology · <a href="https://www.propiology.com" style="color:#1aa6ad;text-decoration:none;">propiology.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    return { subject, html, text };
  }

  // English (default)
  const subject = `Welcome to Propiology, ${name} — your journey starts now`;
  const text = `
Hi ${name},

Welcome to Propiology. Your account is active and your 14-day free trial has started.

Your current stage: ${stageName}

What you can do now:
• Check your initial Readiness Score in the dashboard
• Log your first daily habit
• Explore AI tools (Care-Multiplier and Cognitive Shield)
• Enable WhatsApp messages for daily check-ins

Go to your dashboard:
${dashboardUrl}

For the next 14 days you have full access to all Pro features. After that, choose the plan that fits you best.

If you have any questions, reply to this email.

— The Propiology team
hello@propiology.com
`.trim();

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#f2ede0;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2ede0;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
        <!-- Header -->
        <tr><td style="background:#0b2a38;padding:36px 48px;">
          <p style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Propiology</p>
          <p style="margin:6px 0 0;font-size:13px;color:#83d6d2;letter-spacing:0.5px;">Your Personal Operating System</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:48px;">
          <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f2f4f;">Hi ${name},</h1>
          <p style="margin:0 0 24px;font-size:15px;color:#22496b;line-height:1.6;">Welcome to Propiology. Your account is active and your <strong>14-day free trial</strong> has started.</p>

          <!-- Stage pill -->
          <div style="background:#0b2a38;border-radius:10px;padding:20px 24px;margin-bottom:32px;">
            <p style="margin:0 0 4px;font-size:12px;color:#83d6d2;text-transform:uppercase;letter-spacing:1px;">Your current stage</p>
            <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">${stageName}</p>
          </div>

          <p style="margin:0 0 16px;font-size:14px;font-weight:600;color:#0f2f4f;">What you can do now:</p>
          <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
            ${[
              ['📊', 'Check your initial Readiness Score'],
              ['✅', 'Log your first daily habit'],
              ['🤖', 'Explore Care-Multiplier and Cognitive Shield AI tools'],
              ['💬', 'Enable WhatsApp messages for daily check-ins'],
            ].map(([icon, text]) => `
            <tr><td style="padding:8px 0;font-size:14px;color:#22496b;"><span style="margin-right:10px;">${icon}</span>${text}</td></tr>`).join('')}
          </table>

          <a href="${dashboardUrl}" style="display:inline-block;background:#1aa6ad;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:10px;">Go to my dashboard →</a>

          <p style="margin:32px 0 0;font-size:13px;color:#6b7280;line-height:1.6;">You have full access to all Pro features for 14 days. After that, choose the plan that fits you best.</p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f2ede0;padding:24px 48px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#6b7280;">© ${new Date().getFullYear()} Propiology · <a href="https://www.propiology.com" style="color:#1aa6ad;text-decoration:none;">propiology.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
