import { createFileRoute } from '@tanstack/react-router'

const SENTRY_HOST = process.env.SENTRY_HOST
const SENTRY_PROJECT_IDS = process.env.SENTRY_PROJECT_ID?.split(',') || []

export const Route = createFileRoute('/api/tunnel')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Validate environment variables
        if (!SENTRY_HOST || SENTRY_PROJECT_IDS.length === 0) {
          return new Response('Sentry tunnel not configured', { status: 503 })
        }

        try {
          const envelope = await request.text()
          const pieces = envelope.split('\n')
          const header = JSON.parse(pieces[0])

          // Extract DSN from envelope header
          const dsn = header.dsn
          if (!dsn) {
            return new Response('Invalid envelope: missing DSN', {
              status: 400,
            })
          }

          // Parse DSN to validate project ID
          const dsnUrl = new URL(dsn)
          const projectId = dsnUrl.pathname.replace(/^\//, '')

          // Validate project ID
          if (!SENTRY_PROJECT_IDS.includes(projectId)) {
            return new Response('Invalid project ID', { status: 403 })
          }

          // Forward the envelope to Sentry
          const sentryUrl = `https://${SENTRY_HOST}/api/${projectId}/envelope/`
          const response = await fetch(sentryUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-sentry-envelope',
            },
            body: envelope,
          })

          return new Response(null, {
            status: response.status,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST',
              'Access-Control-Allow-Headers': 'Content-Type',
            },
          })
        } catch (error) {
          console.error('Error tunneling to Sentry:', error)
          return new Response('Internal Server Error', { status: 500 })
        }
      },

      // Handle OPTIONS for CORS preflight
      OPTIONS: () => {
        return new Response(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        })
      },
    },
  },
})
