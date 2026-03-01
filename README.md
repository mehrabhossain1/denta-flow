<div align="center">
  <img src="./public/icon.svg" alt="BetterStarter Logo" width="96" height="96" />
  <h1>BetterStarter</h1>
  <p><strong>Start your SaaS the right way. Launch fast, scale confidently, built for the future.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/TanStack_Start-v1-EF4444?style=flat-square&logo=react" alt="TanStack Start" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Postgres-Drizzle_ORM-4169E1?style=flat-square&logo=postgresql" alt="Postgres + Drizzle" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS v4" />
  </p>
</div>

---

## What is BetterStarter?

BetterStarter is a full-stack SaaS boilerplate built on **TanStack Start** giving you everything you need to ship a production-ready product without the setup tax.

Authentication, billing, database, email, file uploads, a blog, and a polished landing page, all wired up and ready to go.

## Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (full-stack React, SSR) |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based, type-safe) |
| Data fetching | [TanStack Query](https://tanstack.com/query) |
| Database | Postgres via [Drizzle ORM](https://orm.drizzle.team) (hosted on Supabase) |
| Auth | [better-auth](https://better-auth.com) (email OTP, sessions) |
| Payments | [Stripe](https://stripe.com) (subscriptions + webhooks) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| Email | [Plunk](https://useplunk.com) |
| Blog | Content Collections (Markdown) |
| Linting | [Biome](https://biomejs.dev) |
| Deployment | Netlify (SSR) |

---

## Quick Start

```bash
pnpm i
pnpm dev
```

---

## First-Time Setup

### 1. Database

Create a Postgres database (e.g. on Supabase), then:

```bash
pnpm db:pull   # pull existing schema
pnpm db:push   # push schema to your DB
```

### 2. Email

Verify your sending domain in [Plunk](https://useplunk.com) and add the API key to `.env.local`.

### 3. Stripe

```bash
# Install Stripe CLI (macOS)
brew install stripe/stripe-cli/stripe

# Authenticate
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy the printed whsec_... secret
```

Add to `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
APP_BASE_URL=http://localhost:3000
```

Update `STRIPE_CONFIG` in `src/constants/billing.ts` with your Price IDs, then push the billing schema:

```bash
pnpm db:generate
pnpm db:push
```

---

## Useful Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm check:fix` | Lint and format with Biome |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Drizzle Studio |

---

## Roadmap

- [x] Onboarding flow
- [ ] Update TanStack Start, better-auth, better-auth-ui
- [ ] Auto-detect routes in sitemap.xml
- [ ] Landing page template
- [ ] PurchaseButton billing config helper
