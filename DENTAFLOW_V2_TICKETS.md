# DentaFlow V2 - Production Ready MVP

> **25 tickets across 6 phases** to take DentaFlow from dev playground to production MVP.
> Each phase is independently testable. Complete phases in order (except Phase 3 & 4 which can run in parallel).

---

## Phase 1: Authentication & Email (Foundation)

Nothing works without real auth. No code changes needed -- just credentials + testing.

### V2-001: Configure Plunk Email Service
- **Priority:** Critical
- **Type:** Configuration
- **Description:** Sign up at [useplunk.com](https://useplunk.com), verify a sending domain (e.g., `dentaflow.app`). Update `.env.local`:
  - `PLUNK_SECRET_API_KEY` - real API key (currently `placeholder_plunk_key`)
  - `TRANSACTIONAL_EMAIL` - verified domain email (currently `noreply@example.com`)
- **Files:** `.env.local`
- **Test:** Trigger sign-in via email OTP on localhost, confirm email arrives with 6-digit code
- **Status:** [ ]

### V2-002: Configure Google OAuth
- **Priority:** Critical
- **Type:** Configuration
- **Description:** Create a Google Cloud project, configure OAuth consent screen. Create OAuth 2.0 credentials (Web Application type). Set authorized redirect URIs:
  - Dev: `http://localhost:3000/api/auth/callback/google`
  - Prod: `https://dentaflow.app/api/auth/callback/google`
- Update `.env.local`:
  - `VITE_GOOGLE_CLIENT_ID` (currently `placeholder_google_client_id`)
  - `GOOGLE_CLIENT_SECRET` (currently `placeholder_google_secret`)
- **Files:** `.env.local`
- **Ref:** Auth config at `src/lib/auth/index.ts` lines 31-34
- **Test:** Click "Sign in with Google" on auth page, confirm OAuth flow completes
- **Status:** [ ]

### V2-003: End-to-End Auth Testing
- **Priority:** Critical
- **Type:** Testing
- **Description:** Verify all auth flows work:
  - Sign-up via email OTP (new user creation)
  - Sign-in via email OTP (existing user)
  - Sign-in via Google (new + existing user)
  - Session persistence (30-day expiry, 24-hour refresh)
  - Redirect-after-login (`?redirect=` param in dashboard route)
  - Logout flow
- **Status:** [ ]

---

## Phase 2: Stripe Subscription + Free/Paid Tiers

> Depends on Phase 1 -- checkout ties to authenticated users.
> **Model:** Free (10 AI requests/month) + Pro ($19/mo or $190/yr, unlimited AI)

### V2-004: Update Environment & Billing Config for Subscriptions
- **Priority:** Critical
- **Type:** Code Change
- **Description:** Convert from one-time payment to subscription model:
  - Replace `VITE_STRIPE_PRICE_CORE_ONE_TIME_ID` with `VITE_STRIPE_PRICE_MONTHLY_ID` and `VITE_STRIPE_PRICE_ANNUAL_ID`
  - Remove `VITE_STRIPE_PROMOTION_CODE_ID` (not needed for subscription MVP)
  - Update `STRIPE_CONFIG` in billing constants: rename to "DentaFlow Pro", add MONTHLY/ANNUAL prices
  - Update env validation in `src/env.ts`
- **Files:** `src/env.ts`, `src/constants/billing.ts`, `.env.local`, `.env.sample`
- **Status:** [ ]

### V2-005: Create AI Usage Tracking System
- **Priority:** Critical
- **Type:** Code Change
- **Description:** Track AI usage per user for free tier limits:
  - New DB table `ai_usage`: id, userId (FK), action (text), createdAt
  - New file `src/lib/billing/usage.ts` with:
    - `getMonthlyUsage(userId)` -- count AI calls in current month
    - `incrementUsage(userId, action)` -- insert usage row
    - `canUseAI(userId)` -- active subscription → unlimited; else count < 10
  - Run `pnpm db:generate` + `pnpm db:push`
- **Files:** `src/db/schema/ai-usage.ts` (new), `src/lib/billing/usage.ts` (new)
- **Status:** [ ]

### V2-006: Gate AI Endpoints Behind Usage Check
- **Priority:** Critical
- **Type:** Code Change
- **Description:** Add usage check + tracking to all AI server functions:
  - Before each AI call, check `canUseAI(context.user.id)`
  - If over limit, throw `AI_LIMIT_REACHED` error
  - On success, call `incrementUsage(context.user.id, actionName)`
  - Applies to: `generateFollowUp`, `explainTreatment`, `suggestPostCare`, `generateBlogPost`
- **Files:** `src/lib/dental/ai.ts`
- **Status:** [ ]

### V2-007: Rewrite Pricing Section (Free vs Pro)
- **Priority:** Critical
- **Type:** Code Change
- **Description:** Complete rewrite of pricing component:
  - Two-card layout: Free (left) vs Pro (right, highlighted)
  - Free: 10 AI requests/mo, patient management, blog -- "Get Started Free" → sign-up
  - Pro: Unlimited AI, all features, monthly ($19) / annual ($190) toggle with savings badge
  - Pro card uses `PurchaseButton` with `mode="subscription"`
  - Wire `<PricingSection />` into `src/routes/index.tsx`
- **Files:** `src/components/Landing/LandingPricing.tsx`, `src/routes/index.tsx`
- **Status:** [ ]

### V2-008: Add Usage Display in Dashboard
- **Priority:** High
- **Type:** Code Change
- **Description:** Show subscription status and AI usage on dashboard:
  - Free users: "3/10 AI requests used this month" with progress bar
  - Paid users: "Unlimited" badge with plan name
  - "Upgrade to Pro" CTA for free users
- **Files:** `src/routes/dashboard/index.tsx`
- **Status:** [ ]

### V2-009: Show Upgrade Prompt When Limit Hit
- **Priority:** High
- **Type:** Code Change
- **Description:** When AI call returns `AI_LIMIT_REACHED`:
  - Show friendly upgrade modal/banner
  - "You've used all 10 free AI requests this month. Upgrade to Pro for unlimited."
  - Link to pricing section or direct checkout
- **Files:** `src/routes/dashboard/ai-assistant/index.tsx`, `src/routes/dashboard/ai-blog/index.tsx`
- **Status:** [ ]

### V2-010: Stripe Dashboard Setup (User action)
- **Priority:** Critical
- **Type:** Configuration
- **Description:** In Stripe Dashboard (test mode):
  - Create product: "DentaFlow Pro"
  - Create recurring price: $19/month
  - Create recurring price: $190/year
  - Record product ID and both price IDs
  - Update `.env.local` with real `STRIPE_SECRET_KEY`, `VITE_STRIPE_PRODUCT_CORE_ID`, `VITE_STRIPE_PRICE_MONTHLY_ID`, `VITE_STRIPE_PRICE_ANNUAL_ID`
- **Status:** [ ]

### V2-011: Set Up Stripe Webhook (Local Dev)
- **Priority:** Critical
- **Type:** Configuration
- **Description:** Install Stripe CLI. Run:
  ```bash
  stripe listen --forward-to localhost:3000/api/stripe/webhook
  ```
  Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`.
- **Events:** `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
- **Status:** [ ]

### V2-012: Test Complete Subscription Flow
- **Priority:** Critical
- **Type:** Testing
- **Description:** End-to-end verification:
  - New user → free tier, use 10 AI requests
  - 11th request → blocked with upgrade prompt
  - Subscribe ($19/mo) with test card `4242 4242 4242 4242`
  - Webhook creates subscription in DB
  - AI requests now unlimited
  - Billing portal works (manage/cancel subscription)
  - Cancel → back to free limits
  - Landing page shows both plans with working checkout
- **Status:** [ ]

---

## Phase 3: Branding Polish

### V2-013: Update Web Manifest and Metadata
- **Priority:** Medium
- **Type:** Code Change
- **Description:** Update `public/site.webmanifest`:
  - Change `"name": "BetterStarter"` to `"DentaFlow"`
  - Change `"short_name": "BetterStarter"` to `"DentaFlow"`
  - Verify favicon PNGs exist (`icon-192x192.png`, `icon-512x512.png`)
- **Files:** `public/site.webmanifest`
- **Status:** [ ]

### V2-014: Update Terms of Service
- **Priority:** Medium
- **Type:** Code Change
- **Description:** The Terms page still has BetterStarter-era content:
  - Rewrite Section 2 ("Description of Service") to describe DentaFlow's actual dental practice management service
  - Update `lastUpdated` from `'November 8, 2025'` to current date
  - Update SEO description from `'Terms of Service for BetterStarter'` to `'Terms of Service for DentaFlow'`
- **Files:** `src/routes/legal/terms.tsx`
- **Status:** [ ]

### V2-015: Clean Up Residual BetterStarter References
- **Priority:** Medium
- **Type:** Code Change
- **Description:** Search entire codebase for remaining "BetterStarter" strings and update:
  - Legal pages, pricing component, any comments or constants
  - Remove irrelevant brand logos (cvs-health.svg, deloitte.svg, starbucks.svg etc.) from `public/brands/` if used in a "trusted by" section
  - Verify privacy page content is DentaFlow-specific
  - Update Plunk references to Resend
- **Files:** Multiple
- **Status:** [ ]

---

## Phase 4: Security Hardening

> Can run in parallel with Phase 3.

### V2-016: Add Zod Input Validation to AI Endpoints
- **Priority:** High
- **Type:** Code Change
- **Description:** All 5 AI server functions currently use unsafe `data as unknown as Type` casting with zero runtime validation. Add `.inputValidator(z.object({...}))` to each:
  - `generateFollowUp` - validate patientName (max 100), treatment (max 200), tone enum, channel enum
  - `explainTreatment` - validate procedure (max 200), patientAge, language enum
  - `suggestPostCare` - validate treatment (max 200), severity enum, allergyDetails (max 500)
  - `generateBlogPost` - validate topic (max 200), keywords array, audience enum, tone enum
  - `saveBlogPost` - validate title (max 200), content (max 50000), tags array
- **Pattern ref:** `src/lib/blog/server.ts` line 21 already uses `.inputValidator()`
- **Files:** `src/lib/dental/ai.ts`
- **Status:** [ ]

### V2-017: Add Zod Input Validation to Patient CRUD
- **Priority:** High
- **Type:** Code Change
- **Description:** Same treatment for patient server functions:
  - `listPatients` - validate optional search string (max 100)
  - `createPatient` - validate name (required, max 100), email (optional, valid format), phone (optional, max 20), notes (optional, max 1000)
  - `deletePatient` - validate patientId (UUID format)
- **Files:** `src/lib/dental/server.ts`
- **Status:** [ ]

### V2-018: Configure Sentry for Production
- **Priority:** Medium
- **Type:** Code Change
- **Description:** Sentry is initialized in `instrument-server.mjs` but needs proper config:
  - Verify DSN belongs to DentaFlow project (not template)
  - Add `environment: process.env.NODE_ENV || 'development'`
  - Add `release: process.env.COMMIT_SHA || 'unknown'`
  - Consider adding client-side Sentry (currently server-only)
- **Files:** `instrument-server.mjs`
- **Status:** [ ]

---

## Phase 5: Blog Serverless Fix & Account Settings

### V2-019: Fix Blog Save for Serverless Deployment
- **Priority:** Critical
- **Type:** Code Change
- **Description:** `saveBlogPost` in `src/lib/dental/ai.ts` uses `fs.writeFileSync` to write to `content/blog/` -- this **will fail on Netlify/Vercel** (read-only filesystem). Solution:
  1. Create new DB schema `src/db/schema/blog.ts` with `blog_post` table (id, slug, title, description, content, tags, authorId, publishedAt, draft, createdAt, updatedAt)
  2. Update `saveBlogPost` to insert into DB instead of writing files
  3. Update `getPublishedPosts` and `getBlogPost` in `src/lib/blog/func.server.ts` to merge results from content-collections (static posts) AND database (AI-generated posts), deduplicate by slug
  4. Run `pnpm db:generate` and `pnpm db:push`
- **Files:** `src/db/schema/blog.ts` (new), `src/lib/dental/ai.ts`, `src/lib/blog/func.server.ts`
- **Status:** [ ]

### V2-020: Add Account Index Route
- **Priority:** Medium
- **Type:** Code Change
- **Description:** Navigating to `/account` shows a blank page because there's no index route (only `$accountView` dynamic route). Create `src/routes/account/index.tsx` that redirects to `/account/settings`.
- **Files:** `src/routes/account/index.tsx` (new)
- **Status:** [ ]

### V2-021: Add Billing Status to Account Page
- **Priority:** Medium
- **Type:** Code Change
- **Description:** Show subscription/entitlement status on account page:
  - Pull data from `getBillingStatus` server function (`src/lib/billing/server.ts`)
  - Display current plan (Free / Pro), subscription status, renewal date
  - Add "Upgrade to Pro" or "Manage Billing" button
  - Show AI usage count for free users
- **Files:** Account route area
- **Status:** [ ]

---

## Phase 6: Production Deployment

> Depends on all previous phases being complete.

### V2-022: Configure Production Domain
- **Priority:** Critical
- **Type:** Configuration
- **Description:** Set up custom domain:
  - Configure DNS with Vercel
  - Update production `APP_BASE_URL` and `BETTER_AUTH_URL`
- **Status:** [ ]

### V2-023: Set Production Environment Variables
- **Priority:** Critical
- **Type:** Configuration
- **Description:** Configure ALL env vars in Vercel Dashboard:
  - `APP_BASE_URL`, `BETTER_AUTH_URL` = production domain
  - `DATABASE_URL` = production Neon connection string
  - `BETTER_AUTH_SECRET` = **generate new strong secret** for production
  - `RESEND_API_KEY` = from Phase 1
  - `TRANSACTIONAL_EMAIL` = verified domain email or `onboarding@resend.dev`
  - `GOOGLE_CLIENT_SECRET` / `VITE_GOOGLE_CLIENT_ID` = from Phase 1
  - `STRIPE_SECRET_KEY` = live mode key (or test for staging)
  - `STRIPE_WEBHOOK_SECRET` = from production webhook
  - `GEMINI_API_KEY` = existing key
  - All `VITE_STRIPE_*` = production Stripe IDs
- **Status:** [ ]

### V2-024: Update Google OAuth Redirect URIs for Production
- **Priority:** Critical
- **Type:** Configuration
- **Description:** In Google Cloud Console, add production redirect URI:
  - `https://yourdomain.com/api/auth/callback/google`
  - Keep localhost URI for local development
- **Status:** [ ]

### V2-025: Create Production Stripe Webhook
- **Priority:** Critical
- **Type:** Configuration
- **Description:** In Stripe Dashboard, create production webhook endpoint:
  - URL: `https://yourdomain.com/api/stripe/webhook`
  - Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
  - If switching to live mode: create new products/prices and update `VITE_STRIPE_*` env vars
- **Status:** [ ]

### V2-026: Run Production Database Migration
- **Priority:** Critical
- **Type:** Configuration
- **Description:** Run `pnpm db:push` against production Neon database. Verify all tables exist:
  - Auth: `user`, `session`, `account`, `verification`
  - Dental: `patient`
  - Billing: `billing_customer`, `subscription`, `entitlement`, `ai_usage`
  - Blog: `blog_post` (from V2-019)
- **Status:** [ ]

### V2-027: Build, Deploy, and Smoke Test
- **Priority:** Critical
- **Type:** Testing
- **Description:** Final production verification:
  1. Run `pnpm build` locally -- verify no errors
  2. Deploy to Vercel
  3. Smoke test all flows in production:
     - Sign up / sign in (email OTP + Google)
     - Add a patient, search, delete
     - Use AI features (verify free limit works)
     - Subscribe to Pro, verify unlimited AI
     - Generate and publish a blog post
     - Check account settings + billing status
  4. Verify Stripe webhooks deliver successfully
  5. Set up uptime monitoring
- **Status:** [ ]

---

## Summary

| Phase | Tickets | Focus | Depends On |
|-------|---------|-------|------------|
| 1 | V2-001 to V2-003 | Auth & Email (Resend + Google OAuth) | None | **DONE** |
| 2 | V2-004 to V2-012 | Stripe Subscriptions + Free/Paid Tiers + Usage Tracking | Phase 1 |
| 3 | V2-013 to V2-015 | Branding Polish | None |
| 4 | V2-016 to V2-018 | Security Hardening | None (parallel with Phase 3) |
| 5 | V2-019 to V2-021 | Blog Fix & Account | None (parallel with Phase 3-4) |
| 6 | V2-022 to V2-027 | Production Deploy | All previous phases |
