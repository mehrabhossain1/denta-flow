# BetterStarter.dev — Beta Feedback from a Founder's Perspective

**Reviewer:** Mehrab Hossain
**Date:** April 14, 2026
**Approach:** You asked me to evaluate this as someone trying to start a startup — does it deliver on its promise, and does it make starting easy? Rather than skim and react, I spent two weeks shipping an actual production MVP on top of BetterStarter to answer that from lived experience.

**The proof:** [github.com/mehrabhossain1/denta-flow](https://github.com/mehrabhossain1/denta-flow) — DentaFlow, an AI-powered dental practice management SaaS built entirely on BetterStarter. Patient CRUD, four AI tools, Stripe subscriptions with usage-based gating, Resend email, Sentry, zod-validated server functions. Six phases of real product work.

Everything below is grounded in that build.

---

## Executive Summary

**Does it deliver what it promises?** Yes, on the fundamentals. The core value — auth, billing, blog, UI — is real, well-integrated, and saved me weeks. The Stripe integration alone justifies the price. The main gap is between what the marketing claims and what actually ships: provider counts, component counts, and a few feature labels that don't quite match the repo.

**Does it make starting easy?** Mostly. Once running, the architecture is clean and intuitive — I was writing dental workflow logic from day one instead of fighting auth or webhook wiring. But the first-run is rougher than the marketing suggests: 13 required env vars with zero defaults, and you bounce between four external service dashboards before you can see the landing page. Realistic time from clone to running app: 60–120 minutes, not "minutes."

**Verdict: 7.5/10 today, improvable to 9/10 with under a week of polish.** This is a polish problem, not a foundation problem. The bones are good.

---

## The First 30 Minutes — What a Buyer Actually Experiences

I went through the exact flow a paying customer would:

**Minute 0–2: Great first impression.**
`git clone`, `pnpm i` — clean install. Project structure is intuitive.

**Minute 2–5: First wall.**
Ran `pnpm dev` as the Quick Start suggests. Hit a wall of Zod validation errors — 13 missing environment variables. The README's Quick Start (`pnpm i` → `pnpm dev`) doesn't mention that `.env.local` needs to exist first. For a founder who just paid $99, this is a jarring first experience.

**Minute 5–15: Configuration scavenger hunt.**
The sample file is well-commented (credit where it's due — it links to providers and includes generation hints). But all 13 vars are required with no defaults. You can't even see the landing page without Stripe product IDs configured.

**Minute 15–40: External service setup.**
- **Database** (Supabase / Neon): 10 min.
- **Plunk** (email): domain verification required, not instant. 5–15 min.
- **Google OAuth**: GCP project + consent screen + credentials. 10–15 min.
- **Stripe**: most involved — account, products, price IDs, CLI for webhooks. Stripe CLI instructions in README are macOS-only (`brew install`). 10–20 min.

**Minute 40–45: It's alive.**
Landing page loads and it looks *excellent*. The UI makes an immediate impression — this feels like a real product, not a template. Dark mode, responsive layout, loading skeletons — a founder's prototype looks professional immediately.

**Realistic total: 60–120 minutes** depending on whether you already have Stripe / Google / email accounts.

**The single highest-ROI fix:** a `pnpm setup` script that checks for `.env.local`, validates each var, and gives actionable error messages — "Missing STRIPE_SECRET_KEY — get yours at https://dashboard.stripe.com/apikeys". ~30 minutes of work for a dramatically better buyer journey.

---

## What I Learned by Actually Shipping a Product on Top

Building DentaFlow surfaced things a quick review wouldn't catch. The good and the less good:

**What worked beautifully:**
- **Guest checkout → authenticated account claim.** I used this pattern verbatim for DentaFlow. A patient can pay without an account and claim the subscription after signup. Rare in starter kits at any price point.
- **Stripe webhook architecture.** Adding a new product and extending subscription handling took maybe 20 minutes. The `BILLING_PROVIDERS` abstraction is clean.
- **The sidebar + AppShell layout.** I built three new dashboard routes and they just fit. No layout wrestling.
- **`@t3-oss/env-core` + Zod env validation.** Catches misconfig at startup with clear errors. I added three new env vars during DentaFlow dev (Gemini, Sentry DSN, new Stripe IDs) and the pattern scaled without friction.
- **Content Collections for the blog.** I extended it with a DB-backed table for AI-generated posts and the merge was clean.

**Where I hit friction extending it:**
- **`saveBlogPost` wrote to the filesystem** (`fs.writeFileSync` to `content/blog/`). This breaks on Vercel / Netlify (read-only FS). I had to add a `blog_post` DB table and merge DB posts with static ones. Worth making the default serverless-safe.
- **Auth redirects were client-side `useEffect`**, which meant protected pages briefly flashed before redirecting. I moved to `beforeLoad` hooks in some places — feels like this should be the default pattern in the template.
- **No built-in AI usage tracking.** Not strictly BetterStarter's job, but if AI is going to be a big use case for buyers (it will be), a pattern for per-user rate limiting / usage counting would be a killer addition.
- **`data as unknown as Type` casting in server functions.** `AGENTS.md` explicitly forbids type casting, but the template itself does this ~15 times. I replaced these with `.inputValidator(z.object(...))` in DentaFlow and the safety improvement was real. Would love to see this be the template default.
- **OTP `console.log` in `src/lib/auth/index.ts:39`.** Fires in all environments. OTP codes end up in production logs. I removed it in my fork — should be dev-only or gone entirely.

---

## Website Claims vs. Reality

The product is strong — but a few claims create a gap savvy buyers will notice:

| Claim | Reality | Suggested Copy |
|---|---|---|
| "34+ login providers" | 1 social provider (Google) + Email OTP configured. better-auth supports 34+, but buyers get 1 working out of the box. | "Google OAuth + Email OTP built-in, extensible to 34+ providers via better-auth" |
| "60+ Shadcn components" | 43 components in `src/components/ui/`. A solid set. | "40+ shadcn/ui components" |
| "Admin panel" | Dashboard + account pages work. The landing description mentions "user management table, feature flag controls, role-based access" — these go beyond what ships. | Align the description with what the dashboard actually does today |
| "oxlint, oxfmt" | Codebase uses Biome. Website references the wrong tools. | "Biome for linting and formatting" |
| "Email templates and automation" | Single plaintext OTP email. No HTML templates, no drip sequences. | "Transactional email via Plunk / Resend" |
| "Invoice management" | No invoice UI. Stripe handles invoices through the billing portal. | "Stripe billing portal" |
| Stripe integration | Fully implemented — checkout, webhooks, subscriptions, one-time, guest checkout with entitlement claiming, billing portal. | **Accurate. This is the strongest feature.** |
| Blog with RSS | Markdown blog, content collections, TOC, syntax highlighting, RSS. | **Accurate.** |
| Documentation site | 19 live pages at `/docs/get-started/quickstart`. `/docs` root URL has a redirect issue. | Accurate — just fix the root URL redirect. |
| SEO / AEO | Meta tags, OG, Twitter Cards properly implemented in `src/lib/seo.ts`. | **Accurate.** |
| Drizzle ORM | PostgreSQL, proper schema, migrations. | **Accurate.** |

**Why this matters:** At $99 lifetime, BetterStarter is the most affordable paid option in this space — a strong position. But when a technical buyer finds discrepancies at $99, they don't think "good deal," they think "cheap for a reason." Your actual product is good enough to sell on real numbers. Competitors like ShipFast and Supastarter have been publicly scrutinized for overclaiming; tightening the copy protects you from that same conversation.

---

## What Genuinely Impressed Me

Not participation trophies — the things that saved me real time while building DentaFlow:

1. **Stripe integration is best-in-class for this price point.** Guest checkout with entitlement claiming is genuinely rare. A user can buy without an account, then sign up later and their purchase follows them. Subscription management, webhook handling, billing portal — this covers real billing scenarios. Lead with this.

2. **Auth covers the full user lifecycle.** Email OTP, Google OAuth, passkeys, session management, complete account settings UI at `/account`. A buyer gets sign-up through account management, not just a login page.

3. **The UI is production-ready on day one.** 43 shadcn/ui components, dark/light mode, responsive sidebar with AppShell, loading skeletons, nav progress indicator. A founder's prototype looks professional immediately.

4. **Blog with RSS is a smart inclusion.** Most starter kits skip content marketing. Having markdown blog + content collections + TOC + syntax highlighting + RSS means a founder can start SEO from launch day. I extended this for AI-generated posts in DentaFlow and it was clean.

5. **Type-safe env vars catch misconfig early.** `@t3-oss/env-core` with Zod means broken config fails at startup with clear errors, not at 2 AM in production.

6. **`AGENTS.md` signals craft.** The internal coding guidelines (type safety, loader patterns, UI style guide) show this was built with intention. Buyers who dig into the codebase will notice this.

---

## Issues — Grouped by Business Impact

### Group A: "The founder's first paying customer hits a wall"

The moment of revenue — the most important moment for any SaaS:

**Silent billing failures.** When checkout or billing portal creation fails, the user sees *nothing*. The error is caught and `console.error`'d, no toast, no message, no retry.

- `src/components/_common/PurchaseButton.tsx:49-50` — catches error, logs it, user is stuck
- `src/components/_common/ManageBillingButton.tsx` — same pattern

A founder's first paying customer clicks "Buy" and nothing happens. Worst possible buyer experience.

**Fix:** Sonner is already in the project. `toast.error('Something went wrong. Please try again.')` in the catch blocks. ~5 lines each.

**No server-side route protection.** Dashboard and account pages redirect unauthenticated users via client-side `useEffect` — users briefly see protected content before the redirect fires, and server functions like `getBillingStatus()` can technically be called without auth.

**Fix:** TanStack Router's `beforeLoad` hooks run server-side. ~10 lines per route, eliminates the problem.

---

### Group B: "A security-conscious buyer walks away"

Any buyer doing a code review (and technical buyers will) would flag these:

**`VITE_GOOGLE_CLIENT_SECRET` in client-side types.** `src/vite-env.d.ts:8` declares the Google client secret with the `VITE_` prefix, which tells Vite to bundle it into client-side JS. The secret is correctly server-only in `src/env.ts`, but this type declaration is a trap for anyone following the pattern. **Fix:** delete the line.

**OTP codes logged in production.** `src/lib/auth/index.ts:39` has `console.log({ email, otp, type })` in all environments. OTP codes end up in server logs, error tracking, and CDN edge logs. **Fix:** remove or wrap in `if (import.meta.env.DEV)`.

**Cascade deletes destroy billing history.** All billing FKs in `src/db/schema/billing.ts` use `onDelete: 'cascade'`. If a user deletes their account, all subscription / entitlement / customer data is permanently deleted — refund disputes become unprocessable and audits impossible. **Fix:** `onDelete: 'set null'` on billing tables, or soft deletes.

---

### Group C: "Scaling friction at thousands of users"

- **No database indexes** on `subscription.userId`, `entitlement.userId`, `entitlement.guestEmail` in `src/db/schema/billing.ts`. These are queried on every dashboard load. ~3 lines in the schema file.
- **No rate limiting** on OTP generation (6-digit = 1M possibilities), auth endpoints, or API routes. Brute-force risk.
- **No webhook idempotency.** `src/lib/billing/providers/stripe.ts` doesn't track Stripe event IDs. Stripe retries webhooks; without dedup, retries could create duplicate entitlements.
- **No CORS / CSP headers** in Nitro. The blog uses `dangerouslySetInnerHTML` for markdown rendering without a sanitization library.

---

### Group D: "Developer experience paper cuts"

- **SPA navigation broken in sidebar.** `src/components/AppSidebar.tsx` uses `<a href>` instead of `<Link>`. Every sidebar click triggers a full page reload.
- **Unsafe type casts everywhere.** ~15 `as unknown as` casts in `src/lib/billing/server.ts`, `src/lib/blog/server.ts`, `PurchaseButton.tsx`. Server functions already have Zod validators — data should be typed. Ironically, `AGENTS.md` explicitly forbids type casting.
- **Duplicated auth logic.** Dashboard and account routes have identical auth-check `useEffect` blocks. There's even a TODO acknowledging this at `src/routes/account/$accountView.tsx:26`.
- **Email has no retry logic.** `src/lib/email.ts` makes a single attempt. If it fails, the error is logged silently and the user is stuck on the OTP screen with no feedback.

---

## Five Highest-ROI Fixes

All achievable in a single day:

| # | Fix | Effort | Impact |
|---|---|---|---|
| 1 | Ship a `pnpm setup` script that validates `.env.local` with actionable error messages | 30 min | Transforms first-run from frustrating to smooth |
| 2 | Align website copy with reality — provider count, component count, "oxlint/oxfmt" → "Biome" | 30 min | Prevents buyer distrust and refund requests |
| 3 | Add `toast.error()` to PurchaseButton and ManageBillingButton catch blocks | 15 min | Prevents the worst buyer experience: payments failing silently |
| 4 | Delete the OTP `console.log` (`auth/index.ts:39`) and `VITE_GOOGLE_CLIENT_SECRET` type (`vite-env.d.ts:8`) | 2 min | Removes the two findings that make a security-conscious buyer close the repo |
| 5 | Fix `/docs` root URL redirect so the footer link works | 5 min | Doc pages are great — the entry point just needs to resolve |

---

## Strategic Product Advice

**1. Your real competitor isn't "building from scratch."**
Your FAQ smartly positions against Lovable / Replit as the serious choice. But the actual competition is ShipFast ($199), Supastarter ($299), and free Next.js SaaS templates on GitHub. At $99 lifetime, you're the most affordable paid option — a powerful position *if* the product delivers cleanly. Marketing overclaims are the main risk to that positioning.

**2. The Stripe integration is your moat — lead with it.**
Guest checkout with entitlement claiming is genuinely rare. "The only TanStack starter that handles guest-to-authenticated billing migration" is more compelling than "34+ providers" (which buyers can verify in 30 seconds).

**3. Setup experience IS the product.**
For a starter kit, the first 30 minutes is the buying experience. Every minute a buyer spends debugging env vars is a minute they're not building their SaaS — and not telling their friends about BetterStarter. A `pnpm setup` validation script would be the highest-ROI feature you could ship.

**4. Consider a "first 5 minutes" Loom video.**
A quick screen recording — clone → setup → running app — would set expectations, reduce support burden, and serve as marketing content. It also sidesteps the "minutes not months" claim by showing what "minutes" actually looks like.

**5. Lean into the "About" positioning.**
"10+ years helping companies like CVS, United Airlines, Salesforce build software that lasts" is the exact credibility that justifies buying a starter kit instead of vibe-coding one. The product should reflect that same standard — which means the marketing should be as precise as the engineering.

**6. Bonus: AI is the next table-stakes.**
Every SaaS in 2026 has an AI story. A small, opinionated pattern in the template for (a) server-side API key management, (b) per-user usage tracking / rate limits, and (c) upgrade-gating when limits are hit would be a killer differentiator. I had to build this from scratch for DentaFlow; others will too. (Happy to share my implementation if useful.)

---

## Final Thoughts

BetterStarter has a strong foundation and a clear value proposition. The auth + billing + blog + UI combination is genuinely time-saving, the architecture is sound, and the TanStack Start + Drizzle + better-auth stack is a solid bet for the future. Having now shipped a real product on top of it, I can say with confidence: **this starter earns its price.** DentaFlow wouldn't exist in two weeks without it.

The gap between the marketing and the repo is the main thing standing between this and a product I'd recommend without hesitation. The fixes are small — most under 30 minutes each. The architecture doesn't need rethinking. This needs a polish pass, not a rebuild.

Happy to re-review after changes, walk through any of these points in detail, or jump on a call. Genuinely rooting for BetterStarter to succeed.

— Mehrab
[DentaFlow repo](https://github.com/mehrabhossain1/denta-flow) · built on BetterStarter
