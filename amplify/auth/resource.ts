import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'Welcome to Propiology — Verify your email',
      verificationEmailBody: (createCode) =>
        `Your Propiology verification code is: ${createCode()}`,
    },
  },
  userAttributes: {
    preferredUsername: { mutable: true, required: false },
    'custom:language_preference': { dataType: 'String', mutable: true },
    'custom:journey_stage':       { dataType: 'String', mutable: true },
    'custom:subscription_tier':   { dataType: 'String', mutable: true },
    'custom:organization_id':     { dataType: 'String', mutable: true },
    'custom:role':                { dataType: 'String', mutable: true },
  },
  groups: ['EndUsers', 'Coaches', 'CorporateAdmins', 'HealthcareProviders', 'SuperAdmins'],
  multifactor: {
    mode: 'OPTIONAL',
    totp: true,
  },
});
