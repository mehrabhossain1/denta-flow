import { ourFileRouter } from '@/lib/upload/server'
import { createFileRoute } from '@tanstack/react-router'
import { createRouteHandler } from 'uploadthing/server'

// createRouteHandler returns a single request handler function
const routeHandler = createRouteHandler({
  router: ourFileRouter,
  config: {
    callbackUrl: `${process.env.APP_BASE_URL}/api/uploadthing`,
  },
})

export const Route = createFileRoute('/api/uploadthing/$')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        console.log('UploadThing GET:', request.url)
        try {
          const response = await routeHandler(request)
          console.log(
            'UploadThing GET response:',
            response.status,
            response.statusText,
          )
          return response
        } catch (error) {
          console.error('UploadThing GET error:', error)
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
      POST: async ({ request }) => {
        console.log('UploadThing POST:', request.url)
        try {
          // Clone the request to read the body for debugging
          const clonedRequest = request.clone()
          const body = await clonedRequest.text()
          console.log('UploadThing POST body:', body)

          const response = await routeHandler(request)
          console.log(
            'UploadThing POST response:',
            response.status,
            response.statusText,
          )
          console.log(
            'UploadThing POST response headers:',
            Object.fromEntries(response.headers),
          )

          // Clone response to read body WITHOUT consuming the original
          const clonedResponse = response.clone()
          const responseBody = await clonedResponse.text()
          console.log('UploadThing POST response body:', responseBody)

          // Return the original response (not consumed)
          return response
        } catch (error) {
          console.error('UploadThing POST error:', error)
          console.error('Error stack:', error.stack)
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },
  },
})
