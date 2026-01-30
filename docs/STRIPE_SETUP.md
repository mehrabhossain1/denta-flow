# Stripe Payment Integration

This guide walks you through setting up Stripe payments for subscriptions and one-time purchases.

## Prerequisites

- A [Stripe account](https://dashboard.stripe.com/register)
- Stripe CLI installed for local webhook testing

## Environment Variables

Add the following to your `.env.local`:

```bash
# Stripe secret key (starts with sk_test_ or sk_live_)
STRIPE_SECRET_KEY=sk_test_...

# Stripe webhook signing secret (starts with whsec_)
STRIPE_WEBHOOK_SECRET=whsec_...

# Your app's base URL (no trailing slash)
APP_BASE_URL=http://localhost:5173
```

## Configuration

### 1. Create Products and Prices in Stripe

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Create a product (e.g., "Better-Starter")
3. Add prices:
   - One-time price for lifetime access
   - Recurring price for subscriptions (optional)
4. Copy the Price IDs (start with `price_`)

### 2. Update Constants

Edit `src/constants/billing.ts` and replace placeholder IDs:

```ts
export const STRIPE_CONFIG = {
  PRODUCTS: {
    CORE: 'prod_YOUR_PRODUCT_ID',
  },
  PRICES: {
    ONE_TIME: 'price_YOUR_ONE_TIME_PRICE_ID',
    SUB_MONTHLY: 'price_YOUR_SUBSCRIPTION_PRICE_ID',
  },
} as const
```

### 3. Push Database Schema

Generate and apply the billing tables:

```bash
pnpm db:generate
pnpm db:push
```

This creates:
- `billing_customer`: Maps users to Stripe customers
- `subscription`: Tracks active subscriptions
- `entitlement`: Tracks one-time purchase grants

## Local Development

### Start the Dev Server

```bash
pnpm dev
```

### Forward Webhooks with Stripe CLI

In a separate terminal:

```bash
# Install Stripe CLI if needed
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:5173/api/stripe/webhook
```

Copy the webhook signing secret (`whsec_...`) from the CLI output and add it to your `.env.local`.

### Test a Purchase

1. Navigate to the pricing section (no login required)
2. Click "Get Better-Starter"
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete the checkout
5. You'll be redirected to `/purchase/success`
6. Sign in with the email you used at checkout
7. Visit `/dashboard` to see your entitlement

## Guest Checkout Flow

The billing system supports purchases without requiring login:

### How It Works

1. **Checkout**: Guest clicks purchase, Stripe collects email during checkout
2. **Webhook**: On payment success, entitlement is stored with `userId = 'guest:{email}'`
3. **Success Page**: User is prompted to sign in with the same email
4. **Entitlement Claim**: When user visits dashboard, `claimGuestEntitlements()` transfers the entitlement from the guest placeholder to their real user ID

### Technical Details

- Guest entitlements use the format `guest:email@example.com` as the userId
- The `claimGuestEntitlements` server function finds and transfers these
- This runs automatically on:
  - `/purchase/success` page (if user is logged in)
  - `/dashboard` page load

### Edge Cases

- **User exists**: If the email already has an account, they just sign in
- **New user**: If no account exists, they sign up with that email
- **Email mismatch**: If user signs in with different email, they won't see the entitlement (it's linked to the checkout email)

## Production Deployment

### 1. Get Live Keys

1. Switch to live mode in [Stripe Dashboard](https://dashboard.stripe.com)
2. Copy your live secret key (`sk_live_...`)
3. Create products/prices in live mode

### 2. Configure Webhook Endpoint

1. Go to [Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the signing secret and add to production env

### 3. Update Environment Variables

In Netlify (or your host):

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
APP_BASE_URL=https://yourdomain.com
```

## Architecture Overview

```
src/
├── constants/
│   └── billing.ts              # Product/price IDs, config
├── db/schema/
│   └── billing.ts              # Drizzle tables
├── lib/
│   ├── billing/
│   │   ├── types.ts            # Provider interface
│   │   └── providers/
│   │       ├── index.ts        # Provider registry
│   │       └── stripe.ts       # Stripe implementation
│   └── server/
│       └── billing.ts          # Server functions
├── routes/
│   ├── api/stripe/
│   │   └── webhook.ts          # Webhook handler
│   └── dashboard/
│       └── route.tsx           # User dashboard
└── components/_common/
    ├── PurchaseButton.tsx      # Checkout trigger
    ├── ManageBillingButton.tsx # Portal trigger
    └── LandingPricing.tsx      # Pricing section
```

## Adding Another Provider

The billing system is designed to support multiple providers:

1. Create `src/lib/billing/providers/lemonsqueezy.ts` implementing `BillingProvider`
2. Add to `BILLING_PROVIDERS` in `src/constants/billing.ts`
3. Register in `src/lib/billing/providers/index.ts`
4. Add webhook route at `src/routes/api/lemonsqueezy/webhook.ts`

## Troubleshooting

### Webhook Signature Verification Failed

- Ensure `STRIPE_WEBHOOK_SECRET` matches the CLI or dashboard signing secret
- Check that the raw request body is passed (not parsed JSON)

### Customer Not Found

- Verify the user is logged in before checkout
- Check `billing_customer` table for mapping

### Subscription Status Not Updating

- Confirm webhook events are being received (check Stripe Dashboard → Webhooks)
- Look for errors in server logs

## Useful Commands

```bash
# Trigger a test webhook event
stripe trigger checkout.session.completed

# View recent webhook events
stripe events list --limit 10

# Resend a failed webhook
stripe events resend evt_...
```

## Resources

- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Stripe Billing Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [Stripe CLI Reference](https://stripe.com/docs/stripe-cli)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
