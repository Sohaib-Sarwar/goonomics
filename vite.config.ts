/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Social scrapers want absolute og:image URLs. On Vercel the production hostname is exposed at
 * build time; locally (or elsewhere) we fall back to a relative path.
 */
function ogOrigin(): Plugin {
  const host = process.env.SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
  return {
    name: 'og-origin',
    transformIndexHtml: (html) => html.replaceAll('%OG_ORIGIN%', host.replace(/\/$/, '')),
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), ogOrigin()],
  build: {
    target: 'es2022',
    cssMinify: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
