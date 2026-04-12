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

## Phase 2: Stripe Payments

> Depends on Phase 1 -- checkout ties to authenticated users.

### V2-004: Create Stripe Products and Prices
- **Priority:** Critical
- **Type:** Configuration
- **Description:** In Stripe Dashboard (test mode):
  - Create product: "DentaFlow Pro"
  - Create a one-time price (or recurring if subscription model chosen)
  - Optionally create a promotion code
  - Record: product ID (`prod_*`), price ID (`price_*`), promo code ID (`promo_*`)
- **Decision needed:** One-time payment vs subscription (monthly/annual)?
- **Status:** [ ]

### V2-005: Configure Stripe Environment Variables
- **Priority:** Critical
- **Type:** Configuration
- **Description:** Replace all placeholder Stripe values in `.env.local`:
  - `STRIPE_SECRET_KEY` - real `sk_test_*` key
  - `STRIPE_WEBHOOK_SECRET` - from webhook endpoint setup (V2-007)
  - `VITE_STRIPE_PRODUCT_CORE_ID` - product ID from V2-004
  - `VITE_STRIPE_PRICE_CORE_ONE_TIME_ID` - price ID from V2-004
  - `VITE_STRIPE_PROMOTION_CODE_ID` - promo code ID (or remove if not using)
- **Files:** `.env.local`
- **Status:** [ ]

### V2-006: Update Billing Constants
- **Priority:** Medium
- **Type:** Code Change
- **Description:** Rename "BetterStarter Core" to "DentaFlow Pro" in billing constants.
- **Files:** `src/constants/billing.ts` (line 29)
- **Status:** [ ]

### V2-007: Set Up Stripe Webhook (Local Dev)
- **Priority:** Critical
- **Type:** Configuration
- **Description:** Install Stripe CLI. Run:
  ```bash
  stripe listen --forward-to localhost:3000/api/stripe/webhook
  ```
  Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`.
- **Ref:** Webhook handler at `src/routes/api/stripe/webhook.ts`
- **Events:** `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
- **Status:** [ ]

### V2-008: Test Complete Payment Flow
- **Priority:** Critical
- **Type:** Testing
- **Description:** End-to-end payment verification:
  - Checkout session creation (authenticated + guest)
  - Successful payment with test card `4242 4242 4242 4242`
  - Webhook receipt and entitlement/subscription creation in DB
  - Success page at `/purchase/success`
  - Billing portal session via `createBillingPortalSession`
  - Guest entitlement claiming (auto-triggered in dashboard route)
- **Status:** [ ]

---

## Phase 3: Landing Page & Branding Polish

### V2-009: Wire Pricing Section into Landing Page
- **Priority:** High
- **Type:** Code Change
- **Description:** The `PricingSection` component exists at `src/components/Landing/LandingPricing.tsx` but is NOT rendered on the landing page. Tasks:
  - Import and render `<PricingSection />` in `src/routes/index.tsx` between `<DentaFlowHowItWorks />` and `<DentaFlowCTA />`
  - Update pricing copy from BetterStarter features to DentaFlow features:
    - "AI Follow-up Messages"
    - "Treatment Explanations"
    - "Post-Care Instructions"
    - "SEO Blog Generator"
    - "Patient Management"
  - Update CTA text from "Get BetterStarter" to "Start with DentaFlow"
- **Files:** `src/routes/index.tsx`, `src/components/Landing/LandingPricing.tsx`
- **Status:** [ ]

### V2-010: Update Web Manifest and Metadata
- **Priority:** Medium
- **Type:** Code Change
- **Description:** Update `public/site.webmanifest`:
  - Change `"name": "BetterStarter"` to `"DentaFlow"`
  - Change `"short_name": "BetterStarter"` to `"DentaFlow"`
  - Verify favicon PNGs exist (`icon-192x192.png`, `icon-512x512.png`)
- **Files:** `public/site.webmanifest`
- **Status:** [ ]

### V2-011: Update Terms of Service
- **Priority:** Medium
- **Type:** Code Change
- **Description:** The Terms page still has BetterStarter-era content:
  - Rewrite Section 2 ("Description of Service") to describe DentaFlow's actual dental practice management service
  - Update `lastUpdated` from `'November 8, 2025'` to current date
  - Update SEO description from `'Terms of Service for BetterStarter'` to `'Terms of Service for DentaFlow'`
- **Files:** `src/routes/legal/terms.tsx`
- **Status:** [ ]

### V2-012: Clean Up Residual BetterStarter References
- **Priority:** Medium
- **Type:** Code Change
- **Description:** Search entire codebase for remaining "BetterStarter" strings and update:
  - Legal pages, pricing component, any comments or constants
  - Remove irrelevant brand logos (cvs-health.svg, deloitte.svg, starbucks.svg etc.) from `public/brands/` if used in a "trusted by" section
  - Verify privacy page content is DentaFlow-specific
- **Files:** Multiple
- **Status:** [ ]

---

## Phase 4: Security Hardening

> Can run in parallel with Phase 3.

### V2-013: Add Zod Input Validation to AI Endpoints
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

### V2-014: Add Zod Input Validation to Patient CRUD
- **Priority:** High
- **Type:** Code Change
- **Description:** Same treatment for patient server functions:
  - `listPatients` - validate optional search string (max 100)
  - `createPatient` - validate name (required, max 100), email (optional, valid format), phone (optional, max 20), notes (optional, max 1000)
  - `deletePatient` - validate patientId (UUID format)
- **Files:** `src/lib/dental/server.ts`
- **Status:** [ ]

### V2-015: Add Rate Limiting to AI Endpoints
- **Priority:** Medium
- **Type:** Code Change
- **Description:** AI endpoints have no rate limiting -- users can spam Gemini API calls. Implement:
  - In-memory rate limiter: `Map<userId, { count, windowStart }>`
  - Limit: ~50 AI calls per user per hour
  - Create reusable `rateLimitMiddleware` chainable after `authMiddleware`
  - Note: resets on serverless cold starts, acceptable for MVP
- **Files:** New middleware file + `src/lib/dental/ai.ts`
- **Status:** [ ]

### V2-016: Configure Sentry for Production
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

### V2-017: Fix Blog Save for Serverless Deployment
- **Priority:** Critical
- **Type:** Code Change
- **Description:** `saveBlogPost` in `src/lib/dental/ai.ts` uses `fs.writeFileSync` to write to `content/blog/` -- this **will fail on Netlify** (read-only filesystem). Solution:
  1. Create new DB schema `src/db/schema/blog.ts` with `blog_post` table (id, slug, title, description, content, tags, authorId, publishedAt, draft, createdAt, updatedAt)
  2. Update `saveBlogPost` to insert into DB instead of writing files
  3. Update `getPublishedPosts` and `getBlogPost` in `src/lib/blog/func.server.ts` to merge results from content-collections (static posts) AND database (AI-generated posts), deduplicate by slug
  4. Run `pnpm db:generate` and `pnpm db:push`
- **Files:** `src/db/schema/blog.ts` (new), `src/lib/dental/ai.ts`, `src/lib/blog/func.server.ts`
- **Status:** [ ]

### V2-018: Add Account Index Route
- **Priority:** Medium
- **Type:** Code Change
- **Description:** Navigating to `/account` shows a blank page because there's no index route (only `$accountView` dynamic route). Create `src/routes/account/index.tsx` that redirects to `/account/settings`.
- **Files:** `src/routes/account/index.tsx` (new)
- **Status:** [ ]

### V2-019: Add Billing Status to Account Page
- **Priority:** Medium
- **Type:** Code Change
- **Description:** Show subscription/entitlement status on account page:
  - Pull data from `getBillingStatus` server function (`src/lib/billing/server.ts`)
  - Display current plan, subscription status, expiry date
  - Add "Manage Billing" button linking to Stripe portal via `createBillingPortalSession`
- **Files:** Account route area
- **Status:** [ ]

---

## Phase 6: Production Deployment

> Depends on all previous phases being complete.

### V2-020: Configure Production Domain
- **Priority:** Critical
- **Type:** Configuration
- **Description:** Set up `dentaflow.app` domain:
  - Configure DNS with Netlify
  - Update production `APP_BASE_URL` to `https://dentaflow.app`
  - Update production `BETTER_AUTH_URL` to `https://dentaflow.app`
- **Ref:** Domain already referenced in `src/appConfig.ts` line 18
- **Status:** [ ]

### V2-021: Set Production Environment Variables on Netlify
- **Priority:** Critical
- **Type:** Configuration
- **Description:** Configure ALL env vars from `src/env.ts` in Netlify Dashboard:
  - `APP_BASE_URL` = `https://dentaflow.app`
  - `DATABASE_URL` = production Neon connection string
  - `BETTER_AUTH_URL` = `https://dentaflow.app`
  - `BETTER_AUTH_SECRET` = **generate new strong secret** for production
  - `PLUNK_SECRET_API_KEY` = from V2-001
  - `TRANSACTIONAL_EMAIL` = `noreply@dentaflow.app`
  - `GOOGLE_CLIENT_SECRET` / `VITE_GOOGLE_CLIENT_ID` = from V2-002
  - `STRIPE_SECRET_KEY` = live mode key (or test for staging)
  - `STRIPE_WEBHOOK_SECRET` = from production webhook (V2-023)
  - `GEMINI_API_KEY` = existing key
  - All `VITE_STRIPE_*` = production Stripe IDs
- **Status:** [ ]

### V2-022: Update Google OAuth Redirect URIs for Production
- **Priority:** Critical
- **Type:** Configuration
- **Description:** In Google Cloud Console, add production redirect URI:
  - `https://dentaflow.app/api/auth/callback/google`
  - Keep localhost URI for local development
- **Status:** [ ]

### V2-023: Create Production Stripe Webhook
- **Priority:** Critical
- **Type:** Configuration
- **Description:** In Stripe Dashboard, create production webhook endpoint:
  - URL: `https://dentaflow.app/api/stripe/webhook`
  - Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
  - If switching to live mode: create new products/prices and update `VITE_STRIPE_*` env vars
- **Status:** [ ]

### V2-024: Run Production Database Migration
- **Priority:** Critical
- **Type:** Configuration
- **Description:** Run `pnpm db:push` against production Neon database. Verify all tables exist:
  - Auth: `user`, `session`, `account`, `verification`
  - Dental: `patient`
  - Billing: `billing_customer`, `subscription`, `entitlement`
  - Blog: `blog_post` (from V2-017)
- **Status:** [ ]

### V2-025: Build, Deploy, and Smoke Test
- **Priority:** Critical
- **Type:** Testing
- **Description:** Final production verification:
  1. Run `pnpm build` locally -- verify no errors
  2. Deploy to Netlify (git push or manual deploy)
  3. Smoke test all flows in production:
     - Sign up / sign in (email OTP + Google)
     - Add a patient, search, delete
     - Use all 3 AI assistant tabs
     - Generate and publish a blog post
     - Complete a test purchase
     - Check account settings + billing status
  4. Verify Sentry receives events
  5. Verify Stripe webhooks deliver successfully
  6. Set up uptime monitoring
- **Status:** [ ]

---

## Summary

| Phase | Tickets | Focus | Depends On |
|-------|---------|-------|------------|
| 1 | V2-001 to V2-003 | Auth & Email | None |
| 2 | V2-004 to V2-008 | Stripe Payments | Phase 1 |
| 3 | V2-009 to V2-012 | Landing & Branding | Phase 2 (pricing needs Stripe IDs) |
| 4 | V2-013 to V2-016 | Security Hardening | None (parallel with Phase 3) |
| 5 | V2-017 to V2-019 | Blog Fix & Account | None (parallel with Phase 3-4) |
| 6 | V2-020 to V2-025 | Production Deploy | All previous phases |
