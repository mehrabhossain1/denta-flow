// vite.config.ts
import contentCollections from '@content-collections/vite'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    port: 3000,
  },
  ssr: {
    external: ['pg'],
    noExternal: ['drizzle-orm'],
  },
  optimizeDeps: {
    exclude: ['pg', 'drizzle-orm'],
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Externalize postgres and drizzle-orm from client bundle
        // These are server-only dependencies
        return id.includes('pg') || id.includes('drizzle-orm')
      },
      output: {
        manualChunks: (id) => {
          // Vendor chunk splitting for better caching
          if (id.includes('node_modules')) {
            // Lucide icons (tree-shaken but still significant)
            if (id.includes('lucide-react')) {
              return 'icons'
            }
          }
        },
      },
    },
  },
  plugins: [
    contentCollections(),
    tsConfigPaths(),
    tanstackStart(),
    nitro(),
    viteReact(),
    tailwindcss(),
  ],
})
