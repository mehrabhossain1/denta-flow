import { provider } from '@/lib/billing/providers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/stripe/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signature = request.headers.get('stripe-signature') ?? ''
        const raw = await request.text()

        try {
          await provider.verifyAndHandleWebhook(raw, signature)
          return new Response('ok', { status: 200 })
        } catch (err) {
          console.error('[stripe webhook] error:', err)
          return new Response('invalid', { status: 400 })
        }
      },
    },
  },
})
