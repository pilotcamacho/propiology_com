# www.propiology.com — SaaS Architecture Deep-Dive

This document is the technical reference for the SaaS-specific concerns of propiology.com: role model, DynamoDB schema, dashboard data flows, AI tool design, scoring algorithm, and external API integrations. Read [CLAUDE.md](../CLAUDE.md) first for the overall architecture and stack.

---

## 1. User Role Model

### Cognito Groups and permissions

```
SuperAdmins
  └─ can: manage all data, configure feature flags, view all org data, impersonate users

CorporateAdmins
  └─ can: manage their org's seats, view team aggregate data, access Command Center
  └─ cannot: view individual user data without explicit consent

HealthcareProviders
  └─ can: view assigned patient panel, book sessions, view clinical metrics (with consent)
  └─ cannot: access other org's data or unassigned users

Coaches
  └─ can: view their client roster, access client dashboard (with consent)
  └─ cannot: modify client data, access billing

EndUsers
  └─ can: full personal dashboard, AI tools (per tier), WhatsApp, journal, habits
  └─ cannot: access any other user's data, Command Center
```

### Role assignment flow

1. User registers via `app/(auth)/register/` — role not yet assigned.
2. Onboarding wizard (Step 1) asks: "I am an individual" OR "I represent a team or organization."
3. Lambda (`amplify/functions/roleAssignFunction/`) adds user to appropriate Cognito group.
4. Middleware reads Cognito `cognito:groups` claim from JWT to enforce route-level access.

### DynamoDB access patterns per role

| Role | Read access | Write access |
|---|---|---|
| EndUser | Own records only | Own records only |
| Coach | Client records (consent = true) | Nothing |
| CorporateAdmin | All org records (aggregate by default) | `Organization`, `Seat` management |
| HealthcareProvider | Assigned patient records (consent = true) | Nothing |
| SuperAdmin | Everything | Everything |

---

## 2. DynamoDB Schema

### Design pattern

All tables follow single-table design with a composite `pk` / `sk` pattern where possible. GSIs (Global Secondary Indexes) support query patterns that cross entity boundaries.

---

### `User`

| Attribute | Type | Notes |
|---|---|---|
| `pk` | String | `USER#<cognitoSub>` |
| `sk` | String | `PROFILE` |
| `email` | String | GSI: `EmailIndex` |
| `displayName` | String | |
| `avatarUrl` | String | S3 key |
| `languagePreference` | String | `en` \| `es` |
| `journeyStage` | String | `darkness` \| `glimpse` \| `inner-light` \| `mastery` \| `illumination` |
| `subscriptionTier` | String | `trial` \| `basic` \| `pro` |
| `organizationId` | String \| null | FK → `Organization.pk` |
| `role` | String | `end-user` \| `coach` \| `corporate-admin` \| `healthcare-provider` \| `super-admin` |
| `consentToOrgView` | Boolean | Default: false — allows org admin to see individual data |
| `trialStartDate` | String | ISO 8601 |
| `createdAt` | String | ISO 8601 |

---

### `Organization`

| Attribute | Type | Notes |
|---|---|---|
| `pk` | String | `ORG#<uuid>` |
| `sk` | String | `PROFILE` |
| `name` | String | Company name |
| `adminUserId` | String | FK → `User.pk` |
| `seatCount` | Number | Paid seats |
| `activeSeats` | Number | Enrolled members |
| `billingStatus` | String | `active` \| `past_due` \| `cancelled` |
| `stripeCustomerId` | String | |
| `stripeSubscriptionId` | String | |
| `renewalDate` | String | ISO 8601 |
| `createdAt` | String | ISO 8601 |

---

### `Subscription`

| Attribute | Type | Notes |
|---|---|---|
| `pk` | String | `USER#<cognitoSub>` |
| `sk` | String | `SUBSCRIPTION` |
| `stripeCustomerId` | String | |
| `stripeSubscriptionId` | String | |
| `tier` | String | `basic` \| `pro` |
| `interval` | String | `month` \| `year` |
| `status` | String | `active` \| `trialing` \| `past_due` \| `cancelled` |
| `currentPeriodEnd` | String | ISO 8601 |
| `cancelAtPeriodEnd` | Boolean | |
| `updatedAt` | String | ISO 8601 |

---

### `HabitDefinition`

| Attribute | Type | Notes |
|---|---|---|
| `pk` | String | `USER#<cognitoSub>` |
| `sk` | String | `HABIT#<uuid>` |
| `name` | String | |
| `category` | String | `body` \| `mind` \| `relationships` \| `work` |
| `frequency` | String | `daily` \| `weekly` |
| `targetDays` | List\<String\> | For weekly: ['mon', 'wed', 'fri'] |
| `isActive` | Boolean | |
| `createdAt` | String | ISO 8601 |

---

### `HabitLog`

| Attribute | Type | Notes |
|---|---|---|
| `pk` | String | `USER#<cognitoSub>#HABIT#<habitId>` |
| `sk` | String | `LOG#<YYYY-MM-DD>` |
| `completed` | Boolean | |
| `notes` | String | Optional |
| `source` | String | `app` \| `whatsapp` |
| `loggedAt` | String | ISO 8601 |

**GSI:** `DateIndex` on `sk` — allows fetching all habit logs for a user on a given date.

---

### `ReadinessScore`

| Attribute | Type | Notes |
|---|---|---|
| `pk` | String | `USER#<cognitoSub>` |
| `sk` | String | `SCORE#<YYYY-MM-DD>` |
| `score` | Number | 0–100 composite |
| `habitComponent` | Number | 0–100 (40% weight) |
| `biometricComponent` | Number | 0–100 (30% weight) — 50 if no biometric data |
| `reflectionComponent` | Number | 0–100 (30% weight) |
| `calculatedAt` | String | ISO 8601 |

**Query pattern:** `pk = USER#<sub>` + `sk BETWEEN SCORE#2026-04-01 AND SCORE#2026-04-30` for 30-day history.

---

### `BiometricEntry`

| Attribute | Type | Notes |
|---|---|---|
| `pk` | String | `USER#<cognitoSub>` |
| `sk` | String | `BIOMETRIC#<YYYY-MM-DD>` |
| `source` | String | `fitbit` \| `garmin` \| `apple-health` \| `manual` |
| `sleepHours` | Number | |
| `sleepQuality` | Number | 1–5 (manual) or calculated from wearable |
| `restingHeartRate` | Number | bpm |
| `hrv` | Number | ms |
| `steps` | Number | |
| `activeMinutes` | Number | |
| `energyLevel` | Number | 1–5 (manual entry fallback) |
| `syncedAt` | String | ISO 8601 |

---

### `JournalEntry`

| Attribute | Type | Notes |
|---|---|---|
| `pk` | String | `USER#<cognitoSub>` |
| `sk` | String | `JOURNAL#<YYYY-MM-DD>T<HH:MM:SS>` |
| `prompt` | String | The reflection prompt shown to user |
| `content` | String | User's written response |
| `moodTag` | String | `clarity` \| `tension` \| `curiosity` \| `resistance` \| `flow` \| `fatigue` \| `gratitude` |
| `wordCount` | Number | Used for reflection component score |
| `createdAt` | String | ISO 8601 |

---

### `AIConversation`

| Attribute | Type | Notes |
|---|---|---|
| `pk` | String | `USER#<cognitoSub>` |
| `sk` | String | `AI#<tool>#<sessionId>` |
| `tool` | String | `care-multiplier` \| `cognitive-shield` |
| `messages` | List\<Object\> | `{role: 'user'|'assistant', content: string, timestamp: ISO}` |
| `summaryInsight` | String | AI-generated one-line insight for the dashboard widget |
| `microAction` | String | AI-generated follow-up action (used for WhatsApp nudge) |
| `createdAt` | String | ISO 8601 |
| `updatedAt` | String | ISO 8601 |

---

### `WhatsAppSession`

| Attribute | Type | Notes |
|---|---|---|
| `pk` | String | `USER#<cognitoSub>` |
| `sk` | String | `WHATSAPP` |
| `phoneNumber` | String | E.164 format |
| `verified` | Boolean | |
| `optIn` | Map | `{habitCheckin: bool, scoreDigest: bool, weeklyInsight: bool, aiFollowup: bool}` |
| `lastInteractionAt` | String | ISO 8601 |
| `consentTimestamp` | String | ISO 8601 — GDPR compliance |

---

## 3. Readiness Score Calculation

The score runs as a Lambda function (`amplify/functions/scoreCalculator/`) triggered daily at 00:05 UTC via EventBridge.

### Algorithm

```
Habit Component (max 100):
  - Fetch HabitLog for yesterday for all active habits
  - adherenceRate = completed_habits / total_scheduled_habits
  - habitScore = adherenceRate * 100
  - Apply streak bonus: +5 points per 7-day streak (max +15)
  - Cap at 100

Biometric Component (max 100):
  - If BiometricEntry exists for yesterday:
    - sleepScore = normalize(sleepHours, 5, 9) * 25         // 0–25
    - hrvScore   = normalize(hrv, 20, 80) * 25              // 0–25
    - hrScore    = normalize(restingHeartRate, 45, 80) * 25  // inverted — lower is better
    - activityScore = normalize(activeMinutes, 0, 60) * 25  // 0–25
    - biometricScore = sum(sleepScore, hrvScore, hrScore, activityScore)
  - If no BiometricEntry: biometricScore = 50 (neutral baseline)

Reflection Component (max 100):
  - journalEntries = count(JournalEntry for yesterday)
  - wordCount = sum(wordCount for yesterday's entries)
  - reflectionScore = min(100, journalEntries * 40 + min(wordCount, 150) * 0.4)

Final Score:
  score = round(habitScore * 0.40 + biometricScore * 0.30 + reflectionScore * 0.30)

Write ReadinessScore record with all three components.
```

### Org aggregate score (Command Center)

```
orgScore = mean(ReadinessScore.score for all org members, current day)
adherenceRate = mean(habitComponent for all org members)
```

---

## 4. AI Tool System Prompts

### Care-Multiplier (EN)

```
You are a Propiology AI coach specializing in relational dynamics. Propiology is the science of self-knowledge, created by Dr. Fernando Camacho Ospina. It analyzes behavior through 6 personal elements: Life Narrative, Senses & Perception, External World, Body, Behavior, and Circle of Love.

The user will describe a relationship pattern, conflict, or interaction. Your role is to:
1. Reflect back what you hear without judgment
2. Identify which personal elements are most active in the pattern
3. Ask one clarifying question that invites deeper self-awareness
4. Offer one concrete micro-action the user can take in the next 24 hours
5. End each response with a forward-looking question

Never give advice as if you know better than the user. Frame everything as an invitation to look inward. Use warm, calm, non-clinical language. Do not use medical or therapy terminology.

Language: respond in the same language the user writes in.
```

### Cognitive Shield (EN)

```
You are a Propiology AI tool that helps users identify and reframe cognitive biases. You have expert knowledge of cognitive psychology and the Propiology framework (6 personal elements, Life Narrative, journey from Darkness to Illumination).

The user will describe a decision, belief, or recurring thought pattern. Your role is to:
1. Identify the 1–2 most prominent cognitive biases present (name them clearly)
2. Explain in plain language how each bias is distorting their perception
3. Apply a Propiology lens: which personal element is driving this bias?
4. Offer 2 alternative framings of the situation
5. Ask the user which framing resonates more and why

Be direct but kind. Do not soften the identification of biases — the user is here to see clearly. Avoid clinical jargon. Use behavioral science language the user can immediately apply.

Language: respond in the same language the user writes in.
```

---

## 5. WhatsApp Message Architecture

### Daily Habit Check-In

```
trigger: EventBridge cron("5 7 * * ? *")  [07:05 user local time — approximate]
logic:
  1. Query all WhatsAppSession where optIn.habitCheckin = true and verified = true
  2. For each user: fetch top 3 active HabitDefinition
  3. Send Twilio message:
     EN: "Good morning [name] 👋 Did you complete [habit1] today? Reply ✅ yes or ❌ no"
     ES: "Buenos días [nombre] 👋 ¿Completaste [hábito1] hoy? Responde ✅ sí o ❌ no"
  4. Wait for webhook reply
  5. On reply: log HabitLog with source = 'whatsapp'
```

### Morning Readiness Digest

```
trigger: EventBridge cron("0 8 * * ? *")  [08:00 user local time]
logic:
  1. Fetch latest ReadinessScore per user
  2. Identify lowest component (habit/biometric/reflection)
  3. Select micro-tip from `lib/whatsapp/tips.ts` keyed to lowest component
  4. Send message:
     EN: "Your Readiness Score today: [score]/100 📊 Your [component] needs attention. Tip: [tip]"
```

### Inbound Webhook Handler

`app/api/whatsapp/webhook/route.ts`

```
1. Verify Twilio signature header
2. Parse From (E.164 number) + Body
3. Lookup WhatsAppSession by phoneNumber
4. Determine intent:
   - "✅" or "si" or "yes" → log habit complete
   - "❌" or "no" → log habit incomplete + send encouragement
   - Other → send "I didn't understand that. Open the app to check in."
5. Return 200 OK to Twilio
```

---

## 6. Subscription Webhook State Machine

All subscription state lives in DynamoDB `Subscription` record. Stripe webhooks are the authoritative source of truth.

```
Stripe Event                    → DynamoDB Update                → Side Effect
──────────────────────────────────────────────────────────────────────────────
checkout.session.completed      → status: active, tier: [tier]   → Welcome email, add to Cognito group
invoice.paid                    → currentPeriodEnd updated        → —
invoice.payment_failed          → status: past_due               → Payment retry email
customer.subscription.updated   → tier/interval/status updated    → Update Cognito group if tier changed
customer.subscription.deleted   → status: cancelled               → Downgrade Cognito group to EndUsers (read-only mode)
```

**Read-only mode:** When `status = cancelled` and `currentPeriodEnd < now()`, the user can read all their historical data but cannot create new habits, journal entries, or AI sessions. Data retained for 90 days, then a data-deletion Lambda runs.

---

## 7. B2B Org Aggregate Query

The Command Center home page requires real-time aggregate stats for the organization.

### AppSync GraphQL resolvers

```graphql
type OrgAggregate {
  avgReadinessScore: Float!
  habitAdherenceRate: Float!     # 0.0–1.0
  activeMembers: Int!            # members who logged activity in last 7 days
  scoreTrend: [DailyScore!]!    # last 30 days
}

query GetOrgAggregate($orgId: ID!, $days: Int = 30): OrgAggregate
```

DynamoDB: query all `User` records with `organizationId = orgId`, then batch-query their `ReadinessScore` records for the last N days, compute aggregates in the resolver (Lambda-based resolver for complex computation).

### Privacy filter

```typescript
// In the AppSync resolver
if (!user.consentToOrgView) {
  // Return anonymized entry: { score: user.score, userId: null }
  return { ...entry, userId: null, displayName: "Team Member" };
}
```

---

## 8. Security Considerations

### API rate limiting

| Route | Limit | Method |
|---|---|---|
| `/api/ai/*` | 10 req/user/day (Basic), unlimited (Pro) | DynamoDB counter reset daily |
| `/api/stripe/*` | 5 req/session | IP-based, Next.js middleware |
| `/api/whatsapp/webhook` | Twilio signature verification | HMAC validation |
| All auth routes | 5 attempts/15 min/IP | Cognito built-in + Lambda trigger |

### Data privacy

- All PII stored in DynamoDB (eu-west-1 or ap-southeast-2 depending on user region — **decide at launch**).
- BiometricEntry data encrypted at rest (DynamoDB default KMS).
- AIConversation data: user can delete all sessions from settings (triggers Lambda to delete DynamoDB records + S3 artifacts).
- GDPR/LGPD: right-to-deletion Lambda (`amplify/functions/userDeletion/`) — deletes all DynamoDB records for user, removes from Cognito, cancels Stripe subscription.

### Secrets management

All secrets in AWS Secrets Manager, referenced in Lambda environment variables. **Never hardcode API keys in source code or commit `.env.local` files.**

---

## 9. Monitoring & Observability

| Signal | Tool | Alert threshold |
|---|---|---|
| Lambda error rate | CloudWatch Alarm | > 1% over 5 min |
| DynamoDB throttled requests | CloudWatch Alarm | Any throttle event |
| Stripe webhook failures | CloudWatch Logs filter | Any 4xx/5xx from Stripe handler |
| AI API latency | CloudWatch custom metric | p99 > 10 seconds |
| WhatsApp delivery failures | Twilio console + CloudWatch | > 5% failure rate |
| Score calculation job failures | EventBridge DLQ | Any failure |

### PostHog product events

Key events to instrument:

```typescript
posthog.capture('habit_logged',     { source, habitCategory, completed })
posthog.capture('ai_session_started', { tool, tier })
posthog.capture('readiness_viewed', { score, trend })
posthog.capture('subscription_started', { tier, interval })
posthog.capture('whatsapp_linked',  {})
posthog.capture('command_center_viewed', { orgSize, avgScore })
```
