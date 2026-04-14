<div align="center">
  <img src="./public/icon.svg" alt="DentaFlow Logo" width="96" height="96" />
  <h1>DentaFlow</h1>
  <p><strong>AI-powered practice management for modern dental clinics.</strong></p>
  <p><em>Spend less time writing messages, more time treating patients.</em></p>
</div>

---

## The Problem

Running a dental clinic means doing two jobs at once: practicing dentistry **and** running a small business. Every week, dentists and their front-desk staff spend hours on tasks that have nothing to do with clinical skill:

- **Writing follow-up messages** — checking in on patients 2 days after a root canal, a week after an extraction, a month after a crown fitting. Each one personalized, professional, and warm.
- **Explaining treatments** in plain language — a nervous patient needs reassurance, a parent needs a child-friendly explanation, another wants the full clinical detail.
- **Writing post-care instructions** — treatment-specific, allergy-aware, clear about warning signs — printed or messaged to every patient after every procedure.
- **Producing SEO content** for the clinic website — the blog that sits empty because nobody has time to write it, even though it's how new patients find you on Google.

These tasks are repetitive. They're time-consuming. And they're the difference between a practice that just runs and one that grows.

## The Solution

DentaFlow is a SaaS dashboard that gives dentists four AI tools purpose-built for dental workflow — plus a lightweight patient management system to tie it all together.

### What's inside

**Patient Management**
Add, search, and organize patient records. Name, email, phone, notes — the essentials, fast. Every AI tool can pull from this list so messages are personalized automatically.

**AI Follow-up Messages**
Structured input — patient name, treatment, days since visit, tone (friendly / formal), channel (WhatsApp / SMS / email). One click, and you get a warm, professional, channel-appropriate message with a copy button ready to paste.

**AI Treatment Explanations**
Type a procedure (e.g. "root canal"), the patient's age, their specific concern (e.g. "scared of pain"), and choose simple or detailed language. You get a reassuring explanation, a "what to expect" list, and aftercare tips — ready to hand to the patient.

**AI Post-Care Instructions**
Treatment, severity, allergy awareness. Out comes care steps, a clear "avoid" list, and warning signs to watch for — general wellness guidance, never a prescription. The assistant knows its limits.

**AI SEO Blog Generator**
Topic, audience, keywords, tone, word count. DentaFlow writes a full SEO-optimized markdown post with proper headings, meta description, and tags. Publish it to your clinic blog in one click.

### All AI runs server-side

The Google Gemini API key never leaves the server. Patient data is never used to train AI models. Everything is assistive — the final review is always the dentist's.

## Why It Saves Time (and Grows the Practice)

| Task                              | Before DentaFlow        | With DentaFlow       | Weekly time saved |
| --------------------------------- | ----------------------- | -------------------- | ----------------- |
| Follow-up message per patient     | 3–5 min typing          | 15 sec structured    | ~2 hrs            |
| Treatment explanation handout     | 10 min + proofreading   | 20 sec + quick edit  | ~3 hrs            |
| Post-care instruction sheet       | 5 min per treatment     | 15 sec               | ~2 hrs            |
| SEO blog post (1,000 words)       | 2–4 hrs or outsourced   | 1 min + review       | ~3 hrs / week     |

**Rough total: 8–10 hours per week back in the dentist's pocket** — hours that would otherwise be spent staring at a blank document instead of seeing patients or going home on time.

On top of the time, there's the growth angle:

- **More follow-ups = more retention.** Patients who hear from their clinic come back.
- **Better explanations = less anxiety.** Nervous patients who understand their treatment show up for it.
- **Consistent blog output = organic traffic.** A clinic publishing 1–2 SEO posts a week starts showing up in Google search for "dentist in [city]".
- **Professional care instructions = fewer phone calls.** Patients don't call asking "can I eat yet?" when they have a clear sheet.

## Who It's For

- **Solo dental practitioners** who wear every hat and have no time for marketing or documentation
- **Small clinics (2–5 dentists)** whose front desk handles all patient communication
- **Dental practice managers** running multiple clinics who want consistent patient touchpoints at every location
- **Clinics that care about online presence** but haven't had the bandwidth to produce content

## How It Works

```
 Dentist opens dashboard
        │
        ├─► Picks a tool (Follow-up / Explain / Post-care / Blog)
        │
        ├─► Fills a structured form (patient, treatment, tone, etc.)
        │
        ▼
 DentaFlow server calls Google Gemini AI (key stays on server)
        │
        ▼
 Dentist reviews, edits if needed, copies or publishes
```

No prompt engineering. No ChatGPT tab-juggling. No API keys in browser dev tools. Just dental workflow, wrapped in a product.

## Pricing

- **Free** — 10 AI requests / month, full patient management, read all blog posts. For dentists who want to try it before committing.
- **Pro — $19 / month or $190 / year** (save 17%) — unlimited AI requests, all features, priority support. For clinics actually using it day-to-day.

Cancel anytime from account settings.

## Tech Stack

Built on a modern, production-ready foundation:

- **Framework:** TanStack Start (React 19, full-stack TypeScript)
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** Better Auth (email OTP + Google OAuth)
- **Payments:** Stripe subscriptions with webhook-synced billing state
- **AI:** Google Gemini 2.5 Flash (server-side only)
- **Email:** Resend
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Error tracking:** Sentry
- **Deployment:** Vercel-ready (serverless-compatible)

## Architecture Highlights

- **API-key safety** — all AI calls go through TanStack `createServerFn` handlers. The Gemini key lives only in server env, never touches the browser.
- **Zod-validated boundaries** — every server function validates its input with Zod before touching the DB or calling AI, preventing bad payloads from ever reaching a paid API.
- **Free-tier usage tracking** — AI usage is counted in a dedicated `ai_usage` table, checked on every AI request, and shown in real-time on the dashboard.
- **Serverless-safe blog storage** — AI-generated posts are persisted in PostgreSQL (not the filesystem), so they survive on any serverless host.
- **Guest checkout with account claim** — patients can pay first, create an account after; entitlements are automatically claimed by email on signup.

## Roadmap

**Shipped**
- Patient management (CRUD + search)
- All four AI tools (Follow-up, Explanation, Post-Care, Blog)
- Free / Pro subscription tiers with usage gating
- Stripe checkout + billing portal
- Zod-validated server functions
- Sentry error tracking

**Coming next (V3)**
- **Send blog posts directly to patient inboxes** — one-click email blast to every subscribed patient
- **AI follow-ups sent straight to email** — no more copy-paste; click "Send" and it lands in the patient's inbox
- **Patient email preferences + CAN-SPAM-compliant unsubscribe flow**
- **Email send history + rate-limit awareness**

## Getting Started (Development)

```bash
pnpm install
cp .env.sample .env.local  # fill in keys
pnpm db:push
pnpm dev
```

Required env vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, `GOOGLE_CLIENT_SECRET`, `VITE_GOOGLE_CLIENT_ID`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `GEMINI_API_KEY`, and Stripe product/price IDs.

## License

Proprietary. All rights reserved.
