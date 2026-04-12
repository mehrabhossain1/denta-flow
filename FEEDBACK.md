# BetterStarter.dev — Beta Feedback from a Buyer's Perspective

**Reviewer:** Mehrab Hossain
**Date:** April 6, 2026
**Approach:** I evaluated this as a founder picking a starter kit for a new SaaS project — not as a code reviewer. Everything below is framed around what a buyer experiences, what builds trust, and what breaks it.

---

## Executive Summary

**Does it deliver what it promises?** The core value — auth, billing, blog, UI — is real and well-integrated. The Stripe integration alone justifies the price. However, the website overstates some numbers (provider count, component count) and lists features that don't fully match what ships. The actual product is strong enough to sell on its real merits.

**Does it make starting easy?** Partially. The architecture is clean and intuitive once running. But the first-run experience needs work — 13 required env vars with zero defaults, and the setup flow requires bouncing between 4 external service dashboards. Realistic time from clone to running app: 60–120 minutes, not "minutes."

**Setup experience: 6/10 today, improvable to 9/10 in under a week.** This is a polish problem, not a foundation problem.

---

## The First 30 Minutes — What a Buyer Actually Experiences

I went through the exact flow a paying customer would. Here's what happened:

**Minute 0–2: Great first impression.**
`git clone`, `pnpm i` — clean install, no issues. Project structure is intuitive. So far, so good.

**Minute 2–5: First wall.**
Ran `pnpm dev` as the Quick Start suggests. Hit a wall of Zod validation errors — 13 missing environment variables. The README's Quick Start section (`pnpm i` → `pnpm dev`) doesn't mention that `.env.local` needs to exist first. For a founder who just paid $99, this is a jarring first experience.

**Minute 5–15: Configuration scavenger hunt.**
Copied `.env.sample` to `.env.local`. The sample file is well-commented (credit where it's due — it links to service providers and includes generation hints). But all 13 vars are required with no defaults. You can't even see the landing page without Stripe product IDs configured (`VITE_STRIPE_PRODUCT_CORE_ID`, `VITE_STRIPE_PRICE_CORE_ONE_TIME_ID`).

**Minute 15–40: External service setup.**
- **Database** (Supabase/Neon): Straightforward, 10 min.
- **Plunk** (email): Requires domain verification — not instant. 5–15 min depending on DNS.
- **Google OAuth**: Requires GCP project, consent screen, credentials. The docs site covers this in the guides section, but it's a multi-step process. 10–15 min.
- **Stripe**: Most involved — need account, products, price IDs, CLI for webhooks. Stripe CLI instructions in README are macOS-only (`brew install`). 10–20 min.

**Minute 40–45: It's alive.**
Once env vars are in, `pnpm dev` works. The landing page loads and it looks *excellent*. The UI makes an immediate impression — this feels like a real product, not a template. Dark mode works, responsive layout is solid, loading skeletons are a nice touch.

**Minute 45+: Exploring.**
Dashboard, account management, blog — all functional. The docs site is live with solid coverage (quickstart, auth, Stripe, Drizzle, blog guides). One note: the `/docs` root URL has a redirect issue, but individual doc pages like `/docs/get-started/quickstart` work fine.

**The realistic total: 60–120 minutes** depending on whether you already have Stripe/Google/Plunk accounts.

**Suggested fix:** A `pnpm setup` script that checks for `.env.local`, validates each var, and gives actionable error messages ("Missing STRIPE_SECRET_KEY — get yours at https://dashboard.stripe.com/apikeys"). This single addition would transform the first-run experience. 30 minutes of development for a dramatically better buyer journey.

---

## Website Claims vs. Reality

I compared what [betterstarter.dev](https://betterstarter.dev) advertises against what's in the codebase. Your product is strong — but a few claims create a gap that savvy buyers will notice:

| Claim | Reality | Suggested Copy |
|---|---|---|
| **"34+ login providers"** | 1 social provider (Google) + Email OTP configured. better-auth supports 34+, but the buyer gets 1 working out of the box. | "Google OAuth + Email OTP built-in, extensible to 34+ providers via better-auth" |
| **"60+ Shadcn components"** | 43 components in `src/components/ui/`. A solid set. | "40+ shadcn/ui components" |
| **"Admin panel"** | Dashboard + account management pages exist and work (purchases, billing, profile, security, sessions). The landing page description mentions "user management table, feature flag controls, role-based access" which go beyond what's currently shipped. | Align the feature description with what the dashboard actually does today |
| **"oxlint, oxfmt"** | Codebase uses Biome (`biome.json`, listed in `package.json`). Website references the wrong tools. | "Biome for linting and formatting" |
| **"Email templates and automation"** | Single plaintext OTP email in `src/lib/email.ts`. No HTML templates, no drip sequences, no automation. | "Transactional email via Plunk" |
| **"Invoice management"** | No invoice UI in the codebase. Stripe handles invoices natively through the billing portal. | "Stripe billing portal" |
| **Stripe integration** | Fully implemented — checkout, webhooks, subscriptions, one-time purchases, guest checkout with entitlement claiming, billing portal. | Accurate. This is the strongest feature. |
| **Blog with RSS** | Markdown blog with content collections, TOC, syntax highlighting, RSS feed. | Accurate. |
| **Documentation site** | Live at `/docs/get-started/quickstart` with 19 pages. Solid coverage of setup, features, and guides. The `/docs` root URL has a redirect issue. | Accurate — just fix the root URL redirect. |
| **SEO/AEO** | Properly implemented — meta tags, Open Graph, Twitter Cards in `src/lib/seo.ts`. | Accurate. |
| **Drizzle ORM** | Yes — PostgreSQL, proper schema, migrations. | Accurate. |

**Why this matters:** The indie hacker / SaaS builder community values authenticity. Competitors like ShipFast and Supastarter have been scrutinized publicly for overclaiming. At $99 lifetime, BetterStarter is the most affordable paid option in this space — that's a strong position. But when a technical buyer finds discrepancies at $99, they don't think "good deal," they think "cheap for a reason." Your actual product is good enough to sell on real numbers.

---

## What Genuinely Impressed Me

These aren't participation trophies — these are the things that would genuinely save me weeks:

**1. Stripe integration is best-in-class for this price point.**
Guest checkout with entitlement claiming is something most starter kits don't handle. A user can buy without an account, then sign up later and their purchase follows them. Subscription management, webhook handling, billing portal — this covers real billing scenarios. This is the strongest differentiator and should lead your marketing.

**2. Auth covers the full user lifecycle.**
Email OTP, Google OAuth, passkeys, session management, and a complete account settings UI at `/account`. A buyer gets sign-up through account management, not just a login page.

**3. The UI is production-ready on day one.**
43 shadcn/ui components, dark/light mode, responsive sidebar layout with AppShell, loading skeletons, navigation progress indicator. A founder's prototype looks professional immediately.

**4. Blog with RSS is a smart inclusion.**
Most starter kits skip content marketing. Having markdown blog with content collections, table of contents, syntax highlighting, and RSS feed means a founder can start SEO and content marketing from launch day.

**5. Type-safe env vars catch misconfig early.**
Using `@t3-oss/env-core` with Zod validation means broken configuration fails at startup with clear errors, not at 2 AM in production with cryptic ones. Smart architectural choice.

**6. AGENTS.md signals craft.**
The internal coding guidelines document (type safety rules, loader patterns, UI style guide) shows this is built with intention. Buyers who dig into the codebase will notice this.

---

## Issues — Grouped by Business Impact

### Group A: "A buyer's first paying customer hits a wall"

These affect the moment of revenue — the most important moment for any SaaS:

**Silent billing failures.** When checkout or billing portal creation fails, the user sees *nothing*. The error is caught and `console.error`'d, but no toast, no message, no retry option.

- `src/components/_common/PurchaseButton.tsx:49-50` — catches error, logs it, user is stuck
- `src/components/_common/ManageBillingButton.tsx` — same pattern

A founder's first paying customer clicks "Buy" and nothing happens. This is the worst possible buyer experience.

**Fix:** Sonner (toast library) is already in the project. Add `toast.error('Something went wrong. Please try again.')` in the catch blocks. ~5 lines each.

**No server-side route protection.** Dashboard and account pages redirect unauthenticated users via client-side `useEffect`:

```typescript
// src/routes/dashboard/route.tsx:76-84
useEffect(() => {
  if (!session && !isPending) {
    router.navigate({ to: '/auth/$authView', ... })
  }
}, [session, isPending, router])
```

This means users briefly see protected content before the redirect fires, and server functions like `getBillingStatus()` can technically be called without auth.

**Fix:** TanStack Router's `beforeLoad` hooks run server-side. ~10 lines per route, eliminates the problem entirely.

---

### Group B: "A security-conscious buyer walks away"

Any buyer who does a code review (and technical buyers will) would flag these:

**`VITE_GOOGLE_CLIENT_SECRET` in client-side types.** `src/vite-env.d.ts:8` declares the Google client secret with the `VITE_` prefix, which tells Vite to bundle it into client-side JavaScript. The secret is correctly server-only in `src/env.ts`, but this type declaration is a trap for anyone following the pattern.

**Fix:** Delete the line. 2 seconds.

**OTP codes logged in production.** `src/lib/auth/index.ts:39` has `console.log({ email, otp, type })` that runs in all environments — not just dev. OTP codes end up in server logs, error tracking services, and CDN edge logs. There's already a dev-only log in `src/lib/email.ts:31` that handles this correctly.

**Fix:** Remove the console.log or wrap in `if (import.meta.env.DEV)`. One line.

**Cascade deletes destroy billing history.** All billing foreign keys in `src/db/schema/billing.ts` use `onDelete: 'cascade'`. If a user deletes their account, all subscription records, entitlement records, and billing customer data are permanently deleted. This makes refund disputes unprocessable and revenue audits impossible.

**Fix:** Change to `onDelete: 'set null'` on billing tables. Or implement soft deletes.

---

### Group C: "Scaling friction at thousands of users"

**No database indexes** on `subscription.userId`, `entitlement.userId`, and `entitlement.guestEmail` in `src/db/schema/billing.ts`. These are queried on every dashboard load and during guest entitlement claiming. **Fix:** 3 lines in the schema file.

**No rate limiting** on OTP generation (6-digit code = 1M possibilities), auth endpoints, or API routes. A brute-force attack could compromise accounts.

**No webhook idempotency.** `src/lib/billing/providers/stripe.ts` doesn't track Stripe event IDs. Stripe retries webhooks. Without deduplication, retries could create duplicate entitlements.

**No CORS/CSP headers** configured in Nitro. The blog uses `dangerouslySetInnerHTML` for markdown rendering without a sanitization library.

---

### Group D: "Developer experience paper cuts"

**SPA navigation broken in sidebar.** `src/components/AppSidebar.tsx` uses plain `<a href>` tags instead of TanStack Router's `<Link>`. Every sidebar click triggers a full page reload.

**Unsafe type casts everywhere.** Multiple `as unknown as` casts in `src/lib/billing/server.ts`, `src/lib/blog/server.ts`, and `src/components/_common/PurchaseButton.tsx`. The server functions already have Zod validators, so data should be properly typed. Ironically, `AGENTS.md` explicitly forbids type casting — the codebase doesn't follow its own guidelines.

**Duplicated auth logic.** Dashboard and account routes have identical auth-check `useEffect` blocks. There's even a TODO comment acknowledging this at `src/routes/account/$accountView.tsx:26`.

**Email has no retry logic.** `src/lib/email.ts` makes a single attempt to send OTP emails. If it fails, the error is logged silently and the user is stuck on the OTP screen with no feedback.

---

## Five Highest-ROI Fixes

These can all be done in a single day and dramatically improve the product:

| # | Fix | Effort | Impact |
|---|---|---|---|
| 1 | Ship a validated `.env.example` with all 13 vars, placeholder values, and comments explaining where to get each one | 30 min | Transforms the first-run experience from frustrating to smooth |
| 2 | Align website copy with reality — update provider count, component count, fix "oxlint/oxfmt" to "Biome" | 30 min | Prevents buyer distrust and potential refund requests |
| 3 | Add `toast.error()` to PurchaseButton and ManageBillingButton catch blocks | 15 min | Prevents the worst buyer experience: a customer's payment silently failing |
| 4 | Delete the OTP `console.log` (auth/index.ts:39) and `VITE_GOOGLE_CLIENT_SECRET` type (vite-env.d.ts:8) | 2 min | Removes the two findings that would make a security-conscious buyer close the repo |
| 5 | Fix `/docs` root URL redirect so the footer link works | 5 min | Doc pages are great — the entry point just needs to resolve correctly |

---

## Strategic Product Advice

**1. Your real competitor isn't "building from scratch."**
Your FAQ smartly positions against Lovable/Replit, framing BetterStarter as the serious choice. But your actual market competition is ShipFast ($199), Supastarter ($299), and free Next.js SaaS templates on GitHub. At $99 lifetime, you're the most affordable paid option. That's a powerful position — *if* the product delivers cleanly. Right now, the marketing overclaims are the main risk to that positioning.

**2. The Stripe integration is your moat — lead with it.**
Guest checkout with entitlement claiming is genuinely rare in starter kits. "The only TanStack starter that handles guest-to-authenticated billing migration" is a real differentiator. That's more compelling than "34+ providers" (which buyers can verify in 30 seconds).

**3. Setup experience IS the product.**
For a starter kit, the first 30 minutes is the entire buying experience. Every minute a buyer spends debugging env vars is a minute they're not building their SaaS and not telling their friends about BetterStarter. A `pnpm setup` validation script would be the highest-ROI feature you could ship.

**4. Consider a "first 5 minutes" Loom video.**
A quick screen recording showing clone → setup → running app would set expectations correctly, reduce support burden, and serve as marketing content simultaneously. It also sidesteps the "minutes not months" claim by showing what "minutes" actually looks like.

**5. Your "About" positioning is strong — lean into it.**
"10+ years helping companies like CVS, United Airlines, Salesforce build software that lasts" is the exact credibility that justifies buying a starter kit instead of vibe-coding one. The product should reflect that same standard — which means the marketing should be as precise as the engineering.

---

## Final Thoughts

BetterStarter has a strong foundation and a clear value proposition. The auth + billing + blog + UI combination is genuinely time-saving, the architecture is sound, and the TanStack Start + Drizzle + better-auth stack is a solid bet for the future.

The gap between the marketing and the repo is the main thing standing between this and a product I'd recommend without hesitation. The fixes are small — most are under 30 minutes each. The architecture doesn't need rethinking. This needs a polish pass, not a rebuild.

I'm happy to re-review after changes, discuss any of these points in detail, or jump on a call. Genuinely rooting for this product to succeed.

— Mehrab
