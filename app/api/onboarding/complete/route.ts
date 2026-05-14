import { NextRequest, NextResponse } from 'next/server';
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { upsertSubscription } from '@/lib/billing/subscription';
import { sendEmail } from '@/lib/email/ses';
import { welcomeEmail } from '@/lib/email/templates';

const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION ?? 'us-east-1',
});

const ROLE_TO_GROUP: Record<string, string> = {
  end_user: 'EndUsers',
  corporate_admin: 'CorporateAdmins',
  coach: 'Coaches',
  healthcare_provider: 'HealthcareProviders',
};

async function assignCognitoGroup(email: string, role: string): Promise<void> {
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  if (!userPoolId) {
    console.warn('[onboarding/complete] COGNITO_USER_POOL_ID not set — skipping group assignment');
    return;
  }
  const group = ROLE_TO_GROUP[role] ?? 'EndUsers';
  await cognito.send(
    new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: email,
      GroupName: group,
    })
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      userId: string;
      email: string;
      name: string;
      locale: 'en' | 'es';
      journeyStage: string;
      role?: string;
    };

    const { userId, email, name, locale, journeyStage, role = 'end_user' } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create trial subscription record
    await upsertSubscription(userId, {
      tier: 'trial',
      status: 'trialing',
    });

    // Assign user to the appropriate Cognito group (non-blocking)
    await assignCognitoGroup(email, role).catch((err) => {
      console.error('[onboarding/complete] Cognito group assignment failed:', err);
    });

    // Send welcome email (non-blocking — don't fail onboarding if email fails)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.propiology.com';
    const dashboardUrl = `${siteUrl}/${locale}/dashboard`;
    const { subject, html, text } = welcomeEmail({ name, locale, journeyStage, dashboardUrl });

    await sendEmail({ to: email, subject, html, text }).catch((err) => {
      console.error('[onboarding/complete] SES send failed:', err);
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[onboarding/complete] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
