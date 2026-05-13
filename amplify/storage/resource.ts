import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'propiologyComStorage',
  access: (allow) => ({
    'reports/*': [
      allow.authenticated.to(['read']),
      allow.groups(['SuperAdmins', 'CorporateAdmins']).to(['read', 'write', 'delete']),
    ],
    'profile-images/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read', 'write']),
      allow.groups(['SuperAdmins']).to(['read', 'write', 'delete']),
    ],
    'onboarding-assets/*': [
      allow.guest.to(['read']),
      allow.groups(['SuperAdmins']).to(['read', 'write', 'delete']),
    ],
  }),
});
