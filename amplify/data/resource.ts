import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({

  // ── User profile ─────────────────────────────────────────────────────────
  User: a
    .model({
      email:                a.string().required(),
      displayName:          a.string(),
      avatarUrl:            a.string(),
      languagePreference:   a.enum(['en', 'es']),
      journeyStage:         a.enum(['darkness', 'glimpse', 'inner_light', 'mastery', 'illumination']),
      subscriptionTier:     a.enum(['trial', 'basic', 'pro']),
      organizationId:       a.string(),
      role:                 a.enum(['end_user', 'coach', 'corporate_admin', 'healthcare_provider', 'super_admin']),
      consentToOrgView:     a.boolean(),
      trialStartDate:       a.string(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['SuperAdmins']),
      allow.groups(['CorporateAdmins']).to(['read']),
    ]),

  // ── Organization (B2B account) ───────────────────────────────────────────
  Organization: a
    .model({
      name:                 a.string().required(),
      adminUserId:          a.string().required(),
      seatCount:            a.integer(),
      activeSeats:          a.integer(),
      billingStatus:        a.enum(['trialing', 'active', 'past_due', 'cancelled']),
      stripeCustomerId:     a.string(),
      stripeSubscriptionId: a.string(),
      renewalDate:          a.string(),
    })
    .authorization((allow) => [
      allow.groups(['SuperAdmins']),
      allow.groups(['CorporateAdmins']),
    ]),

  // ── Subscription ─────────────────────────────────────────────────────────
  Subscription: a
    .model({
      userId:               a.string().required(),
      stripeCustomerId:     a.string(),
      stripeSubscriptionId: a.string(),
      tier:                 a.enum(['trial', 'basic', 'pro']),
      interval:             a.enum(['month', 'year']),
      status:               a.enum(['trialing', 'active', 'past_due', 'cancelled']),
      currentPeriodEnd:     a.string(),
      cancelAtPeriodEnd:    a.boolean(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['SuperAdmins']),
    ]),

  // ── Habit definition (user-created habits) ───────────────────────────────
  HabitDefinition: a
    .model({
      name:       a.string().required(),
      category:   a.enum(['body', 'mind', 'relationships', 'work']),
      frequency:  a.enum(['daily', 'weekly']),
      targetDays: a.string().array(),
      isActive:   a.boolean(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['SuperAdmins']).to(['read']),
    ]),

  // ── Habit log entry (one per habit per day) ──────────────────────────────
  HabitLog: a
    .model({
      habitId:   a.string().required(),
      logDate:   a.string().required(),
      completed: a.boolean().required(),
      notes:     a.string(),
      source:    a.enum(['app', 'whatsapp']),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['SuperAdmins']).to(['read']),
      allow.groups(['CorporateAdmins']).to(['read']),
    ]),

  // ── Daily Readiness Score ─────────────────────────────────────────────────
  ReadinessScore: a
    .model({
      scoreDate:           a.string().required(),
      score:               a.integer().required(),
      habitComponent:      a.integer(),
      biometricComponent:  a.integer(),
      reflectionComponent: a.integer(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['SuperAdmins']).to(['read']),
      allow.groups(['CorporateAdmins']).to(['read']),
      allow.groups(['HealthcareProviders']).to(['read']),
      allow.groups(['Coaches']).to(['read']),
    ]),

  // ── Biometric data snapshot ───────────────────────────────────────────────
  BiometricEntry: a
    .model({
      entryDate:          a.string().required(),
      source:             a.enum(['fitbit', 'garmin', 'apple_health', 'manual']),
      sleepHours:         a.float(),
      sleepQuality:       a.integer(),
      restingHeartRate:   a.integer(),
      hrv:                a.integer(),
      steps:              a.integer(),
      activeMinutes:      a.integer(),
      energyLevel:        a.integer(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['SuperAdmins']).to(['read']),
    ]),

  // ── Narrative journal ─────────────────────────────────────────────────────
  JournalEntry: a
    .model({
      prompt:    a.string(),
      content:   a.string().required(),
      moodTag:   a.enum(['clarity', 'tension', 'curiosity', 'resistance', 'flow', 'fatigue', 'gratitude']),
      wordCount: a.integer(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['SuperAdmins']).to(['read']),
    ]),

  // ── AI conversation session ───────────────────────────────────────────────
  AIConversation: a
    .model({
      tool:           a.enum(['care_multiplier', 'cognitive_shield']).required(),
      messagesJson:   a.string().required(),
      summaryInsight: a.string(),
      microAction:    a.string(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['SuperAdmins']).to(['read']),
    ]),

  // ── WhatsApp opt-in session ───────────────────────────────────────────────
  WhatsAppSession: a
    .model({
      phoneNumber:        a.string().required(),
      verified:           a.boolean(),
      optInHabitCheckin:  a.boolean(),
      optInScoreDigest:   a.boolean(),
      optInWeeklyInsight: a.boolean(),
      optInAiFollowup:    a.boolean(),
      lastInteractionAt:  a.string(),
      consentTimestamp:   a.string(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.groups(['SuperAdmins']).to(['read']),
    ]),

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});
