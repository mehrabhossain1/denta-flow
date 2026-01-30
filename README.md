# Better-Starter

## Features to create
- [x] Fix: Plunk `from`
- [x] Fix: Tanstack Updates
- [ ] Actual Github repo + tested
- [ ] Feat: Auto invite to github
- [ ] Feat: Performance
- [x] Marketing: More section - husky, lint, format, caching, performance + sentry
- [x] Tech: Header with CTA + mobile view logo squished
- [x] Stripe Payment + Dashboard + webhooks
- [ ] Documentation
- [ ] Feat: Blog + Sitemap
- [ ] Feat: More components
- [ ] Landing: Social proof + CTA

# First time setup
1. DB create db, `pnpm db:pull` && `pnpm db:push`
2. Email Verify domain (plunk)

3. Stripe setup

# Install Stripe CLI if needed
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

Your webhook signing secret whsec_xxx

# 1. Add env vars to .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
APP_BASE_URL=http://localhost:3000

# 2. Update STRIPE_CONFIG in src/constants/billing.ts with your Price IDs

# 3. Push billing schema to DB
pnpm db:generate
pnpm db:push

# 4. Run dev
pnpm dev
