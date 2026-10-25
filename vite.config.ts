/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Social scrapers want absolute og:image URLs. Defaults to the production domain; set SITE_URL
 * at build time to point previews at a custom domain instead.
 */
function ogOrigin(): Plugin {
  const host = process.env.SITE_URL ?? 'https://goonomics.vercel.app'
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
    // Hashed bundles live apart from public/assets so those plain files (like the QR) are not cached forever.
    assetsDir: '_app',
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
