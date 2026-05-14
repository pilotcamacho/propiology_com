# www.propiology.com — Implementation Plan

## Status key
- ✅ Complete
- 🔄 In progress
- [ ] To do
- ⏭ Deferred / skipped

---

## Phase 1: Foundation & Infrastructure [ ] Weeks 1–3

### 1.1 Project setup [ ]
- [ ] Next.js 15 + App Router + TypeScript (strict mode)
- [ ] Tailwind CSS v4
- [ ] ESLint + Prettier (same config as propiology.org)
- [ ] Environment variables template (`.env.local.example`)
- [ ] `.npmrc`: `legacy-peer-deps=false`
- [ ] `package.json` `overrides: { "graphql": "15.10.2" }`

### 1.2 Internationalization [ ]
- [ ] Locale-based routing (`app/[locale]/`)
- [ ] Language detection middleware (`middleware.ts`) — reads `Accept-Language` header, redirects to `/en` or `/es`
- [ ] Translation files: `public/locales/{en,es}/{common,nav,auth,dashboard,billing}.json`
- [ ] `getTranslations` server utility (`lib/i18n/getTranslations.ts`)
- [ ] Language switcher in header (marketing pages only; dashboards use account language preference)

### 1.3 Authentication — AWS Cognito [ ]
- [ ] `defineAuth` in `amplify/auth/resource.ts`
- [ ] Email login + verification CODE + optional TOTP MFA
- [ ] Custom Cognito attributes: `subscription_tier`, `organization_id`, `language_preference`, `journey_stage`, `role`
- [ ] Groups: `EndUsers`, `Coaches`, `CorporateAdmins`, `HealthcareProviders`, `SuperAdmins`
- [ ] Auth pages: `app/(auth)/login/`, `app/(auth)/register/`, `app/(auth)/password-reset/`
- [ ] `RequireAuth` guard component (`components/auth/RequireAuth.tsx`)
- [ ] Role-based redirect middleware (coaches → `/command`, end-users → `/dashboard`)

### 1.4 Database — DynamoDB via Amplify AppSync [ ]
Add resources one at a time and confirm CI passes between each:
- [ ] `User` — profile, language, journey_stage, subscription_tier, organization_id
- [ ] `Organization` — B2B account, seat count, billing status
- [ ] `Subscription` — Stripe subscription ID, tier, renewal date, status
- [ ] `HabitDefinition` — user-defined habits (name, frequency, category)
- [ ] `HabitLog` — daily log entry per habit (date, completed, notes)
- [ ] `ReadinessScore` — daily score per user (composite + component breakdown)
- [ ] `BiometricEntry` — wearable data snapshot (HRV, sleep, steps, heart rate)
- [ ] `JournalEntry` — reflection journal (date, prompt, content, mood tag)
- [ ] `AIConversation` — per-tool conversation history (tool, messages array, session date)
- [ ] `WhatsAppSession` — linked WhatsApp number, opt-in status, last interaction
- [ ] GraphQL API with Cognito user-pool auth + API key auth modes

### 1.5 AWS Storage — S3 [ ]
- [ ] `amplify/storage/resource.ts`
- [ ] `reports/` — B2B PDF/CSV reports (admin write, org-member read)
- [ ] `profile-images/` — user avatars (owner write, authenticated read)
- [ ] `onboarding-assets/` — welcome guides, PDFs (public read)

### 1.6 Hosting & CI/CD — AWS Amplify [ ]
- [ ] GitHub → Amplify CI/CD pipeline (auto-deploy on push to `main`)
- [ ] SSL/TLS via Amplify (automatic)
- [ ] Branch preview environments for feature branches
- ⏭ Custom domain — configure in Amplify Console when DNS access is ready

---

## Phase 2: Design System & Core Components [ ] Weeks 4–5

### 2.1 Design tokens [ ]
- [ ] Tailwind config: ink blues, aqua accents, sand backgrounds, gold achievements, alert red, success green
- [ ] Typography scale: Cormorant Garamond (display) + Inter (body/UI)
- [ ] Shadows, border-radius, spacing tokens

### 2.2 Core UI components [ ]
- [ ] **Button** (`components/ui/Button.tsx`): primary, secondary, ghost, danger; sm/md/lg; loading spinner
- [ ] **Form fields** (`components/ui/Input.tsx`): TextInput, Textarea, Select, Checkbox, RadioGroup, FormField, FormError
- [ ] **Cards** (`components/ui/Card.tsx`): DashboardCard, MetricCard, HabitCard, FeatureCard
- [ ] **Modals** (`components/ui/Modal.tsx`): base Modal + ConfirmModal
- [ ] **Score display** (`components/ui/ReadinessScore.tsx`): circular gauge, color-coded 0–100
- [ ] **Badges** (`components/ui/Badge.tsx`): tier badges, streak badges, journey stage

### 2.3 Layout components [ ]
- [ ] **MarketingHeader** — public nav with Login / Start Free Trial CTAs, language switcher
- [ ] **DashboardShell** — authenticated shell with sidebar nav (B2C)
- [ ] **CommandShell** — authenticated shell with sidebar nav (B2B)
- [ ] **Footer** — marketing footer with links, social icons

### 2.4 SEO components (marketing pages) [ ]
- [ ] `lib/seo/metadata.ts` — `buildMetadata()` with canonical, hreflang, OG tags
- [ ] `lib/seo/jsonld.ts` — `organizationSchema()`, `softwareAppSchema()`, `faqPageSchema()`
- [ ] `app/opengraph-image.tsx` — default OG image 1200×630

---

## Phase 3: Marketing & Conversion Pages ✅ Weeks 6–7

### 3.1 Homepage (`app/[locale]/page.tsx`) ✅
- ✅ Hero: "Your Personal OS for behavioral transformation" — primary CTA "Start Free Trial"
- ✅ Feature overview: 3-column grid (B2C tools, B2B Command Center, WhatsApp integration)
- ✅ Social proof: testimonials (3 rotating cards)
- ✅ Pricing section (link to `/pricing`)
- ✅ FAQ section

### 3.2 Core marketing pages ✅
- ✅ `app/[locale]/features/page.tsx` — full feature breakdown (B2C vs B2B sections)
- ✅ `app/[locale]/pricing/page.tsx` — pricing table (B2C tiers + B2B "Contact Sales")
- ✅ `app/[locale]/for-teams/page.tsx` — B2B value proposition (HR, coaching, healthcare)
- ✅ `app/[locale]/for-coaches/page.tsx` — coach onboarding value prop + 5-stage journey
- ✅ `app/[locale]/security/page.tsx` — data privacy, AWS/Cognito compliance, consent model

### 3.3 SEO infrastructure ✅
- ✅ `app/sitemap.ts` — all marketing routes, both locales, with hreflang alternates
- ✅ `app/robots.ts` — disallows dashboard/command/api/onboarding/billing, points to sitemap
- ✅ Canonical URLs and hreflang on every marketing page via `buildMetadata()`

---

## Phase 4: Subscription & Payments ✅ Weeks 8–9

### 4.1 Stripe setup ✅ (manual steps for user)
- ✅ Create Stripe Products: B2C Basic (monthly + annual), B2C Pro (monthly + annual)
- ✅ `STRIPE_BASIC_PRICE_ID_MONTHLY/ANNUAL`, `STRIPE_PRO_PRICE_ID_MONTHLY/ANNUAL` in .env.local.example
- ✅ Configure webhook endpoint in Stripe Dashboard → `STRIPE_WEBHOOK_SECRET`

### 4.2 API routes & utilities ✅
- ✅ `lib/stripe/client.ts` — Stripe SDK singleton
- ✅ `lib/stripe/prices.ts` — plan config, tierCanAccess(), TRIAL_DAYS=14
- ✅ `lib/billing/subscription.ts` — DynamoDB read/write (getSubscriptionByUserId, upsertSubscription)
- ✅ `app/api/stripe/create-session/route.ts` — B2C Checkout session (14-day trial, customer upsert)
- ✅ `app/api/stripe/portal/route.ts` — Stripe Customer Portal session
- ✅ `app/api/stripe/webhook/route.ts` — handles: checkout.session.completed, invoice.paid, invoice.payment_failed, customer.subscription.deleted/updated

### 4.3 Billing UI ✅
- ✅ `app/[locale]/billing/layout.tsx` — RequireAuth + DashboardSidebar wrapper
- ✅ `app/[locale]/billing/page.tsx` — current plan, renewal date, portal button, upgrade/cancel links
- ✅ `app/[locale]/billing/upgrade/page.tsx` — all 4 plan cards with CheckoutButton
- ✅ `app/[locale]/billing/cancel/page.tsx` — retention offer, alternatives, portal CTA

### 4.4 Paywall components ✅
- ✅ `components/billing/PaywallGate.tsx` — server component, shows upgrade prompt when tier insufficient
- ✅ `components/billing/CheckoutButton.tsx` — client component, calls create-session API and redirects
- ✅ 14-day free trial (no credit card required on registration)
- ✅ Soft paywall via PaywallGate (show prompt, do not hard-block data)

---

## Phase 5: Onboarding Flow ✅ Weeks 10–11

### 5.1 Onboarding wizard ✅
- ✅ `app/[locale]/onboarding/page.tsx` — 7-step wizard (Welcome, Goal, Assessment, Stage reveal, WhatsApp, First Habit, Done)
- ✅ Role selection captured at registration (`RegisterForm` — sets `custom:role` in Cognito)
- ✅ Language preference captured at registration (sets `custom:language_preference`; locale from URL)
- ✅ Step: Primary goal (self-knowledge, habit building, performance, team health)
- ✅ Step: Initial Propiology assessment (5 questions → maps to journey stage)
- ✅ Step: WhatsApp opt-in (optional)
- ✅ Step: First habit creation

### 5.2 Post-onboarding ✅
- ✅ Welcome email via SES (`lib/email/ses.ts` + `lib/email/templates.ts`) — bilingual HTML + plain-text
- ✅ Assign Cognito group based on role (`AdminAddUserToGroup` in `api/onboarding/complete/route.ts`)
- ✅ Set `journey_stage` Cognito attribute based on assessment result
- ✅ First Readiness Score calculation (baseline from assessment → DynamoDB via AppSync)
- ✅ Redirect to appropriate dashboard (B2C → `/dashboard`, B2B → `/command`)

---

## Phase 6: B2C End-User Dashboard ✅ Weeks 12–15

### 6.1 Dashboard home ✅
- ✅ `app/[locale]/dashboard/page.tsx` — Readiness Score widget (circular gauge, today + 7-day avg)
- ✅ Today's habit checklist (top 3 active habits, check-in toggle)
- ✅ AI insight of the day (rotating 30-insight static pool — `lib/habits/insights.ts`)
- ✅ Quick links: Journal, AI Tools, Progress, Habits

### 6.2 Habit tracker ✅
- ✅ `app/[locale]/dashboard/habits/page.tsx` — full habit tracker
- ✅ Create habit: name, category (Body / Mind / Relationships / Work), frequency (daily/weekly)
- ✅ Daily check-in: mark complete / incomplete; streak display per habit
- ✅ `lib/habits/streaks.ts` — currentStreak(), bestStreak() pure functions
- ✅ `app/api/habits/route.ts` — GET (list + streaks via DynamoDB), POST (create habit)
- ✅ `app/api/habits/log/route.ts` — POST (log completion, used by WhatsApp webhook Phase 8)

### 6.3 Readiness Score detail ✅
- ✅ `app/[locale]/dashboard/progress/page.tsx` — score trend chart (inline SVG polyline, no dep)
- ✅ Component breakdown bars: Habit adherence (40%) / Biometric signals (30%) / Reflection (30%)
- ✅ Milestone badges: 6 achievable badges (first habit, 7-day streak, 30-day, journal, score 70+, 90+)
- ⏭ Score recalculation Lambda (EventBridge → Lambda → DynamoDB) — deferred; baseline set at onboarding

### 6.4 Narrative journal ✅
- ✅ `app/[locale]/dashboard/journal/page.tsx` — editor + past entries with expand/collapse
- ✅ `lib/journal/prompts.ts` — 30 bilingual Propiology reflection prompts, daily rotation
- ✅ Mood tagging: 7 states (clarity, tension, curiosity, resistance, flow, fatigue, gratitude)
- ✅ Entry list with date, mood, word count; inline expand to read full entry

### 6.5 Dashboard settings ✅
- ✅ `app/[locale]/dashboard/settings/page.tsx` — profile, WhatsApp, security sections
- ✅ Profile: display name + language preference (updates Cognito attributes)
- ✅ WhatsApp: link/unlink number, opt-in toggles (habit check-in, score digest, weekly insights)
- ✅ Account: change password (Amplify `updatePassword`)
- ✅ `app/[locale]/dashboard/tools/page.tsx` — AI tools catalog stub (Phase 7 fills in)

---

## Phase 7: AI Tools ✅ Weeks 16–18

### 7.1 Tools catalog ✅
- ✅ `app/[locale]/dashboard/tools/page.tsx` — grid of live tools, links to tool pages

### 7.2 Care-Multiplier ✅
- ✅ `app/[locale]/dashboard/tools/care-multiplier/page.tsx` — streaming chat UI
- ✅ Bilingual system prompt grounded in the 6 Propiology elements
- ✅ `app/api/ai/care-multiplier/route.ts` — streaming route (Anthropic `claude-sonnet-4-6`, prompt caching)
- ✅ Conversation history stored in DynamoDB `AIConversation`
- ✅ Pro-tier feature; rate-limited on Basic (10/day)

### 7.3 Cognitive Shield ✅
- ✅ `app/[locale]/dashboard/tools/cognitive-shield/page.tsx` — 3-step UI (describe → biases → commit)
- ✅ AI returns structured JSON: biases, reframes, summaryInsight, microAction
- ✅ Step 3 allows optional journal entry creation via AppSync
- ✅ `app/api/ai/cognitive-shield/route.ts` — non-streaming structured analysis
- ✅ Pro-tier feature

### 7.4 AI infrastructure ✅
- ✅ `lib/ai/client.ts` — Anthropic singleton, model constant (`claude-sonnet-4-6`)
- ✅ `lib/ai/prompts.ts` — bilingual system prompts for both tools (EN + ES)
- ✅ `lib/ai/ratelimit.ts` — DynamoDB daily counter (10/day Basic; unlimited Pro/Trial)
- ✅ Prompt caching enabled (`cache_control: { type: "ephemeral" }` on system blocks)
- ✅ `AI_RATE_LIMIT_TABLE_NAME` added to `.env.local.example`

### Decisions log
- Model: `claude-sonnet-4-6` (better cost-to-quality ratio for behavioral science prompts vs Opus)
- Rate limit: 10 AI calls/day on Basic across both tools; unlimited on Pro and Trial
- Streaming: Care-Multiplier uses `ReadableStream` + `for await` loop; Cognitive Shield non-streaming (structured JSON)
- Conversation persistence: DynamoDB via SDK in API route (owner field manually set from JWT sub)

---

## Phase 8: WhatsApp Micro-Learning [ ] Weeks 19–20

### 8.1 WhatsApp opt-in [ ]
- [ ] Number linking in `/dashboard/settings` — user enters WhatsApp number, system sends verification code
- [ ] `WhatsAppSession` record created in DynamoDB on verification
- [ ] Opt-in consent logged (GDPR / LGPD compliance)

### 8.2 Message types & content [ ]
- [ ] Daily habit check-in: "Good morning [name], did you complete [habit] today? Reply ✅ or ❌"
- [ ] Morning Readiness Score digest: "Your Readiness Score today is [score]. [Micro-tip based on lowest component]"
- [ ] Weekly behavioral insight: rotating 30-lesson Propiology micro-curriculum
- [ ] AI tool follow-up: "Based on your Care-Multiplier session, here's your micro-action for today: [action]"
- [ ] Content stored in `lib/whatsapp/messages.ts` (bilingual)

### 8.3 Infrastructure [ ]
- [ ] Twilio SDK: `lib/whatsapp/twilio.ts`
- [ ] `amplify/functions/whatsappScheduler/` — EventBridge trigger (daily 7:00 AM user local time)
- [ ] `app/api/whatsapp/webhook/route.ts` — receives inbound replies, processes ✅/❌, logs to DynamoDB
- [ ] Reply handling: ✅ logs habit complete; ❌ logs habit incomplete + sends encouragement message

---

## Phase 9: B2B Command Center [ ] Weeks 21–24

### 9.1 Organization management [ ]
- [ ] `app/(protected)/command/seats/page.tsx` — invite team members (email invite → Cognito registration link), remove members, transfer seats
- [ ] `app/api/org/invite/route.ts` — sends invitation email via SES with one-time registration link
- [ ] Organization DynamoDB record: seat count, active seats, billing status

### 9.2 Command Center dashboards [ ]
- [ ] `app/(protected)/command/page.tsx` — home: org aggregate Readiness Score, adherence rate, 7-day trend
- [ ] `app/(protected)/command/team/page.tsx` — team list with anonymized Readiness Score bars
- [ ] `app/(protected)/command/team/[userId]/page.tsx` — individual deep-dive (requires consent flag on `User` record)
- [ ] `app/(protected)/command/programs/page.tsx` — assign/manage active Propiology programs

### 9.3 Reporting [ ]
- [ ] `app/(protected)/command/reports/page.tsx` — report selector (weekly / monthly, date range)
- [ ] `app/api/reports/generate/route.ts` — Lambda generates PDF report (team aggregate, trend data) → uploads to S3 → returns pre-signed URL
- [ ] CSV export for raw adherence data
- [ ] Reports stored in S3 `reports/` (org-scoped access)

### 9.4 Privacy enforcement [ ]
- [ ] Default: individual scores visible to Corp Admin as anonymized aggregates
- [ ] Consent flow: Corp Admin requests individual access → End-User receives in-app notification → User accepts/declines
- [ ] `User.consentToOrgView` boolean field (default: false)
- [ ] Audit log: all consent events logged to DynamoDB `AuditLog`

---

## Phase 10: Biometric Integration [ ] Weeks 25–27 (Post-MVP)

### 10.1 Wearable connections [ ]
- [ ] OAuth 2.0 adapters for: Fitbit, Garmin, Apple Health (via HealthKit bridge)
- [ ] `lib/biometrics/` — adapters per provider
- [ ] `amplify/functions/biometricSync/` — scheduled Lambda (every 6h) pulls latest data per connected user → stores in `BiometricEntry`
- [ ] `app/(protected)/dashboard/biometrics/page.tsx` — HRV, sleep quality, resting HR, steps, activity summary
- [ ] Biometric data factored into Readiness Score recalculation

### 10.2 Manual entry fallback [ ]
- [ ] Users without wearables can manually log sleep hours, energy level (1–5), and activity minutes
- [ ] Manual entries weighted at 50% of wearable data in score calculation

---

## Phase 11: Refinement & Launch [ ] Weeks 28–30

- [ ] Lighthouse audit — target 90+ on marketing pages; 85+ on dashboard
- [ ] WCAG AA accessibility audit (WAVE tool) on all pages
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iOS, Android) — dashboards must be fully functional on mobile
- [ ] Security audit: rate limiting on AI routes, CSP headers, no secrets in code, RBAC boundary testing
- [ ] Data retention policy implementation (90-day inactive user data purge)
- [ ] Google Analytics 4 + PostHog event tracking (subscription events, tool usage, habit streaks)
- [ ] CloudWatch alarms: Lambda errors, DynamoDB throttle, Stripe webhook failures
- [ ] Content review: Spanish and English proofreading of all marketing pages
- [ ] Pre-launch checklist:
  - [ ] Stripe webhook configured and tested in production
  - [ ] SES verified and out of sandbox mode
  - [ ] Twilio WhatsApp number verified
  - [ ] AI API keys set in production environment
  - [ ] Custom domain configured in Amplify Console
  - [ ] propiology.org "Start Free Trial" CTAs pointing to propiology.com

---

## Decisions log

| Topic | Decision | Revisit when |
|---|---|---|
| AI provider | Anthropic Claude claude-sonnet-4-6 (claude-sonnet-4-6) — best reasoning for behavioral science prompts; costs more than GPT-3.5 but fewer hallucinations | If cost becomes significant at scale |
| Biometric integrations | Phase 10 (post-MVP) — adds significant complexity; Readiness Score uses manual entry as fallback in MVP | First 100 B2C subscribers reached |
| WhatsApp provider | Twilio — better documentation, simpler setup than Meta Cloud API direct | If per-message cost becomes prohibitive |
| B2B billing | Annual contracts + invoicing via Stripe (not self-serve) — enterprise buyers prefer invoice over card | When B2B volume justifies self-serve portal |
| CMS | None — marketing copy hardcoded in Next.js components for MVP | When marketing team needs to update copy without deployments |
| Analytics | PostHog (product analytics, self-hosted option) — preferred over Mixpanel for privacy posture | — |
| Privacy (B2B) | Opt-in consent for individual data access; aggregate-only by default | Legal review in target markets (AU, CO, MX) |
| Score formula | Habit adherence 40% / Biometric 30% / Reflection 30% — provisional | After 6 months of user data to validate predictive value |
