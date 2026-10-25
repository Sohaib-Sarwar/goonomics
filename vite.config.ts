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

/** Preloads the Latin fonts the first screen needs, using their hashed build names. */
function preloadFonts(): Plugin {
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: (html, ctx) => {
        const files = Object.keys(ctx.bundle ?? {}).filter((f) => /(big-shoulders-display|hanken-grotesk)-latin-wght-normal-.*\.woff2$/.test(f))
        const tags = files.map((f) => `<link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin>`).join('\n    ')
        return html.replace('</title>', `</title>\n    ${tags}`)
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), ogOrigin(), preloadFonts()],
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
