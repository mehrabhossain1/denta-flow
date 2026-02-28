import { defineNitroConfig } from 'nitro/config'

export default defineNitroConfig({
  compatibilityDate: "2025-07-15",
  experimental: {
    openAPI: true,
  },
  prerender: {
    // Disable prerendering - incompatible with current Nitro nightly + TanStack Start setup
    routes: [],
    crawlLinks: false,
  },
})
