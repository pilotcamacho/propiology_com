# www.propiology.com — Technical & Architectural Definition

> **Implementation Plan:** [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) — current phase status, task checklist, and decisions log. Always check this before starting new work.
> **SaaS Architecture:** [doc/SAAS_ARCHITECTURE.md](./doc/SAAS_ARCHITECTURE.md) — deep-dive into role model, data schema, dashboard specs, and external API integrations.
> **Ecosystem Context:** [PROPIOLOGY_ECOSYSTEM.md](./PROPIOLOGY_ECOSYSTEM.md) — the three-portal strategy (.org, .com, peopleart.co) and how this portal fits.

---

## What is www.propiology.com?

**propiology.com is the commercial SaaS application** — the monetization engine and "Personal OS" of the Propiology ecosystem. While propiology.org educates and attracts users (top of funnel), propiology.com converts that interest into **recurring subscription revenue** through AI-driven behavioral tools.

This portal serves two distinct client types:

| Client type | What they get |
|---|---|
| **B2C End-User** | Personal dashboard: habit tracking, Readiness Score, biometric feedback, AI tools (Care-Multiplier, Cognitive Shield), micro-learning via WhatsApp |
| **B2B Enterprise** (HR, coaching, healthcare) | Command Center: aggregated Readiness Scores, adherence tracking, employee/patient management, reporting |

> **Relationship to propiology.org:** The `.org` portal gives away free value (education, tools, community). The `.com` portal is where visitors convert into paying subscribers. Every `.org` CTA pointing to the `.com` platform should reinforce this: "Apply what you've learned — start your Personal OS."

---

## Deployment — AWS Amplify Gen 2

This project is a **Next.js** app deployed on **AWS Amplify Gen 2** (CDK-based backend, automatic CI/CD). The architecture mirrors propiology.org.

### Standard project structure

```
propiology-com/          ← repo root
├── amplify/             ← Amplify Gen 2 backend
│   ├── backend.ts
│   ├── auth/resource.ts
│   ├── data/resource.ts
│   └── functions/...
├── app/                 ← Next.js App Router pages
│   ├── (auth)/          ← login, register, password-reset (unauthenticated routes)
│   ├── (protected)/     ← all authenticated routes
│   │   ├── dashboard/   ← B2C end-user dashboard
│   │   └── command/     ← B2B command center
│   ├── api/             ← Next.js API Routes (webhooks, external APIs)
│   └── [locale]/        ← locale-prefixed marketing pages
├── components/          ← shared React components
├── lib/                 ← utilities, data, API clients
├── types/               ← TypeScript type definitions
├── public/              ← static assets
├── package.json
├── next.config.ts
└── tsconfig.json
```

### Infrastructure rules (same as propiology.org — do not deviate)

- **One `package.json` at the repo root.** No separate `amplify/package.json`.
- **Never set `legacy-peer-deps=true`** in `.npmrc`. It silently disables npm `overrides`.
- **Add backend resources one at a time.** Push to a branch and confirm CI passes before merging.
- **`defineData` (AppSync GraphQL) is the most complex resource.** Add only after auth and functions are confirmed working.

### If a CI build fails

1. Read the full error in the Amplify Console build log — do not guess.
2. Check `package.json` has `overrides: { "graphql": "15.10.2" }` and `graphql` as a direct dependency.
3. Confirm `.npmrc` has `legacy-peer-deps=false`.
4. If the error is `Cannot use GraphQLObjectType from another module or realm`, a graphql version conflict exists — see propiology.org CLAUDE.md for the fix pattern.

---

## High-Level Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR for authenticated dashboards; SSG for marketing pages |
| Styling | Tailwind CSS v4 | Design tokens aligned with propiology.org palette |
| Language | TypeScript (strict) | All new files must be `.ts` / `.tsx` |
| Authentication | AWS Cognito (via Amplify) | Multi-role: End-User, Coach, Corporate Admin, Healthcare Provider, Super Admin |
| Database | DynamoDB (via Amplify Gen 2 AppSync GraphQL) | Subscription, usage, biometric, and reporting data |
| File storage | AWS S3 (via Amplify Storage) | User uploads, reports, onboarding assets |
| Payments | Stripe | Subscriptions (B2C) + seat-based licensing (B2B) |
| Email | AWS SES | Transactional emails, Readiness Score digests |
| Async micro-learning | WhatsApp API (via Twilio or WhatsApp Business API) | Behavioral nudges, habit check-ins |
| Biometric integrations | REST/OAuth adapters | Fitbit, Apple Health, Garmin (Phase 9) |
| AI / ML | AWS Bedrock or OpenAI API | Care-Multiplier and Cognitive Shield tools |
| Hosting & CI/CD | AWS Amplify Gen 2 | GitHub → Amplify auto-deploy on push to `main` |
| i18n | Next.js locale routing | Spanish and English; `app/[locale]/` pattern |
| Analytics | PostHog or Segment | Product analytics, funnel tracking |

---

## Role Architecture

Five Cognito user groups drive role-based access control (RBAC) throughout the app.

```
Super Admin
  ├── Corporate Admin      ← HR department or coaching business account owner
  │     └── Healthcare Provider / Coach  ← monitors assigned clients
  └── End User             ← individual subscriber (B2C)
```

| Role | Cognito Group | Can access |
|---|---|---|
| End-User | `EndUsers` | Personal dashboard, AI tools, WhatsApp nudges |
| Coach | `Coaches` | Client list, individual client dashboards (read-only), booking |
| Corporate Admin | `CorporateAdmins` | Command Center: team aggregated view, seat management, billing |
| Healthcare Provider | `HealthcareProviders` | Patient panel, clinical metric view, HIPAA-compliant reports |
| Super Admin | `SuperAdmins` | Full platform admin, billing, feature flags |

---

## Core Features & Next.js Implementation

### 1. Authentication & Onboarding

**Goal:** Secure, role-aware login with a smart onboarding flow that personalizes the experience from the first interaction.

- **Implementation:** `defineAuth` in Amplify with Cognito user pools. Custom attributes: `subscription_tier`, `organization_id`, `language_preference`, `journey_stage`, `role`.
- **Auth pages:** `app/(auth)/login/`, `app/(auth)/register/`, `app/(auth)/password-reset/`.
- **Onboarding wizard:** Multi-step flow at `app/(protected)/onboarding/` — collects role, goals, language, initial Propiology assessment. Triggers Cognito group assignment and Welcome email via SES.
- **`RequireAuth` guard:** Middleware checks Cognito session and redirects unauthenticated users to `/login`. Role checks redirect to appropriate dashboard.

### 2. Subscription & Payment Management

**Goal:** Frictionless subscription purchase for B2C; seat-based licensing with invoicing for B2B.

- **Stripe Products:**
  - B2C: Monthly / Annual subscription tiers (Basic, Pro).
  - B2B: Per-seat license (minimum 5 seats), annual contract, invoice billing.
- **Implementation:**
  - `app/api/stripe/create-session/route.ts` — checkout session (B2C).
  - `app/api/stripe/create-subscription/route.ts` — B2B seat license.
  - `app/api/stripe/webhook/route.ts` — handles `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`. Updates DynamoDB `Subscription` record.
  - `app/(protected)/billing/` — manage plan, payment method, invoices.
- **Trial:** 14-day free trial for B2C; no credit card required on registration.

### 3. B2C End-User Dashboard

**Goal:** A personalized, motivating daily interface showing behavioral progress in simple, actionable terms.

Routes under `app/(protected)/dashboard/`:

| Route | Purpose |
|---|---|
| `/dashboard` | Home — Readiness Score, today's habits, AI insight of the day |
| `/dashboard/habits` | Habit tracker: create, log, view streaks |
| `/dashboard/tools` | AI tools catalog (Care-Multiplier, Cognitive Shield) |
| `/dashboard/tools/care-multiplier` | AI conversation tool for relationship patterns |
| `/dashboard/tools/cognitive-shield` | Cognitive bias identification & reframing tool |
| `/dashboard/biometrics` | Wearable data overview (heart rate, sleep, HRV) |
| `/dashboard/journal` | Narrative journal with Propiology reflection prompts |
| `/dashboard/progress` | Historical Readiness Score trend, milestone badges |
| `/dashboard/settings` | Profile, notifications, WhatsApp link, language |

**Readiness Score:** A composite 0–100 score calculated server-side from habit adherence (40%), biometric inputs (30%), and journal/reflection activity (30%). Recalculated daily. Stored in DynamoDB.

### 4. B2B Command Center Dashboard

**Goal:** Give HR departments, coaching firms, and hospital networks aggregate visibility into their team's wellbeing without surfacing individual private data.

Routes under `app/(protected)/command/`:

| Route | Purpose |
|---|---|
| `/command` | Home — aggregate Readiness Score, adherence rate, flagged alerts |
| `/command/team` | Team list with individual Readiness Score (anonymized by default) |
| `/command/team/[userId]` | Individual deep-dive (requires consent) |
| `/command/programs` | Manage active Propiology programs assigned to the team |
| `/command/reports` | Download PDF/CSV reports (weekly, monthly) |
| `/command/seats` | Seat management — invite, remove, transfer members |
| `/command/billing` | License billing (invoices, renewal date) |

**Privacy rules:** Individual data in the Command Center is aggregated by default. A Corporate Admin can request consent-based individual access; the End-User must accept via in-app or WhatsApp notification.

### 5. AI Tools

**Care-Multiplier:**
- Conversational AI that analyzes relational patterns described by the user.
- Built on AWS Bedrock (Claude claude-sonnet-4-6) or OpenAI API via Lambda.
- Input: free-text narrative about a relationship or situation.
- Output: Propiology-framed insights, specific micro-actions, follow-up questions.
- Route: `app/(protected)/dashboard/tools/care-multiplier/`

**Cognitive Shield:**
- Cognitive bias detection and reframing tool.
- User describes a decision or thought pattern; AI identifies active biases (confirmation bias, sunk cost, etc.) and offers a Propiology-aligned reframe.
- Route: `app/(protected)/dashboard/tools/cognitive-shield/`

**Implementation:** Both tools call `app/api/ai/[tool]/route.ts`, which calls the LLM via a Lambda function. User prompts and AI responses are stored in DynamoDB (`AIConversation` table) for continuity across sessions.

### 6. WhatsApp Micro-Learning

**Goal:** Asynchronous behavioral nudges delivered via WhatsApp so the user's habit loop continues outside the app.

- **Provider:** Twilio (WhatsApp Business API) or Meta's direct WhatsApp Cloud API.
- **Opt-in:** User links their WhatsApp number in `/dashboard/settings`.
- **Message types:**
  - Daily habit check-in (✅ / ❌ reply).
  - Readiness Score morning digest.
  - Weekly behavioral insight (Propiology concept + micro-action).
  - AI tool session follow-up nudge.
- **Implementation:** Lambda function (`amplify/functions/whatsappFunction/`) triggered on schedule (EventBridge) or on user action. Sends via Twilio API. Incoming webhook: `app/api/whatsapp/webhook/route.ts`.

### 7. Marketing Pages (SEO + Conversion)

Routes under `app/[locale]/` — server-rendered for SEO, linked from propiology.org.

| Route | Purpose |
|---|---|
| `/` | Hero: "Your Personal OS for behavioral transformation" + Pricing |
| `/features` | Feature overview (B2C and B2B) |
| `/pricing` | Pricing table (B2C tiers + B2B inquiry) |
| `/for-teams` | B2B landing page (HR, coaching, healthcare verticals) |
| `/for-coaches` | Coach-specific value proposition and onboarding |
| `/security` | Data privacy, HIPAA posture, Cognito/AWS compliance |

---

## Design System & Brand Guidelines

### Palette (aligned with propiology.org, but higher-contrast for app UI)

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0f2f4f` | Primary text, nav |
| `--ink-soft` | `#22496b` | Secondary text |
| `--aqua` | `#1aa6ad` | Primary action color, highlights |
| `--aqua-soft` | `#83d6d2` | Hover states, chips |
| `--sand` | `#f2ede0` | Section backgrounds |
| `--paper` | `#fbfcfb` | Page background |
| `--panel` | `#ffffff` | Cards, modals |
| `--alert` | `#e84855` | Error, destructive actions |
| `--success` | `#2cb67d` | Confirmation, streaks |
| `--gold` | `#d4a843` | Readiness Score high, achievement badges |

### Typography

- **Display / Headings:** Cormorant Garamond (same as propiology.org) — philosophical authority.
- **Body / UI:** Inter — clean, highly legible for dense dashboard data.

### Vibe: "Secure, High-Tech, Action-Oriented"

The UI should feel like a professional wellness technology product — not a therapy app, not a gamified fitness app. Think calm confidence: generous whitespace, data visualizations that enlighten rather than overwhelm, micro-animations that feel earned.

- **No aviation, flying, or sailing metaphors** anywhere in copy or UI.
- Dashboard widgets use behavioral science language, not medical jargon.
- Progress indicators celebrate consistency, not perfection.

---

## What is Propiology? (Context for developers)

**Propiology** (from Latin *propius* meaning "of oneself" and Greek *lógos* meaning "study" or "science") is **the study of oneself** — a comprehensive framework for self-knowledge and personal transformation created by Dr. Fernando Camacho Ospina.

It integrates psychology, neuroscience, and applied behavioral science into a structured methodology built around **6 personal elements**: Life Narrative, Senses & Perception, External World, Body, Behavior, and Circle of Love.

The **5-stage transformation journey:** Darkness → Glimpse → Inner Light → Mastery → Illumination.

The **Readiness Score** is Propiology's operational metric — a daily composite of behavioral adherence, physiological signals, and reflective practice that tells the user, in a single number, how prepared they are to act from their best self.

> **For developers:** You do not need to deeply understand Propiology theory to build this portal. What you need to know: users care about their score, their streaks, and their AI conversations. Everything else is context that makes those three things meaningful.

---

## Environment Variables

See `.env.local.example` for the full list. Key groups:

```
# AWS / Amplify
NEXT_PUBLIC_AMPLIFY_REGION=
NEXT_PUBLIC_USER_POOL_ID=
NEXT_PUBLIC_USER_POOL_CLIENT_ID=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_B2C_PRICE_ID_MONTHLY=
STRIPE_B2C_PRICE_ID_ANNUAL=

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=

# AI
ANTHROPIC_API_KEY=          # or OPENAI_API_KEY
AI_PROVIDER=anthropic        # or openai

# Email (SES)
AWS_SES_FROM_EMAIL=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
```
