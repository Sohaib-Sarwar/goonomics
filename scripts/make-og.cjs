// Builds public/og.jpg (1200×630) from the generated hero + mascot, with text set in the real
// brand fonts converted to vector paths. Run from the project root: npm run og
const path = require('path')
const opentype = require('opentype.js')
const sharp = require(path.resolve('node_modules/sharp'))

const here = path.resolve('.')
const display = opentype.loadSync(path.join(here, 'node_modules/@fontsource/big-shoulders-display/files/big-shoulders-display-latin-900-normal.woff'))
const mono = opentype.loadSync(path.resolve('node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff'))

const W = 1200
const H = 630
const pathFor = (font, text, x, y, size, fill) => `<path d="${font.getPath(text, x, y, size).toPathData(2)}" fill="${fill}"/>`
const width = (font, text, size) => font.getAdvanceWidth(text, size)

;(async () => {
  const hero = await sharp('public/assets/goonomics-hero-2048.webp').resize(W, H, { fit: 'cover', position: 'right' }).modulate({ brightness: 0.75 }).toBuffer()
  const mascot = await sharp('public/assets/goonomics-mascot.webp').resize(330, 330).png().toBuffer()

  // Wordmark: G + lime OO + NOMICS, exactly as on the site.
  const size = 132
  let x = 72
  const y = 250
  const parts = [
    ['G', '#F5F5F5'],
    ['OO', '#C5FF5C'],
    ['NOMICS', '#F5F5F5'],
  ]
  let word = ''
  for (const [t, c] of parts) {
    word += pathFor(display, t, x, y, size, c)
    x += width(display, t, size)
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="fade" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#0C0C0F" stop-opacity="1"/>
        <stop offset="0.5" stop-color="#0C0C0F" stop-opacity="0.85"/>
        <stop offset="1" stop-color="#0C0C0F" stop-opacity="0.15"/>
      </linearGradient>
      <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M32 0H0V32" fill="none" stroke="#FFFFFF" stroke-opacity="0.04"/>
      </pattern>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#fade)"/>
    <rect width="${W}" height="${H}" fill="url(#grid)"/>
    <rect x="72" y="0" width="200" height="12" fill="#CDBF94" opacity="0.85"/>
    <circle cx="80" cy="104" r="6" fill="#C5FF5C"/>
    ${pathFor(mono, 'Case file GN-0001, investigation open', 96, 112, 24, '#9898A5')}
    ${word}
    ${pathFor(mono, 'THE GOON AUDIT', 76, 300, 26, '#9898A5')}
    ${pathFor(display, 'YOUR LORE. YOUR LOSSES.', 72, 420, 64, '#F5F5F5')}
    ${pathFor(display, 'THE SPREADSHEET IS COOKED.', 72, 486, 64, '#F5F5F5')}
    <rect x="72" y="540" width="64" height="34" fill="none" stroke="#FF6B6B" stroke-width="2.5" rx="17"/>
    ${pathFor(mono, '18+', 85, 564, 20, '#FF6B6B')}
    ${pathFor(mono, 'Entertainment estimates. Real sources. Fake prestige.', 156, 564, 20, '#9898A5')}
  </svg>`

  await sharp(hero)
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      { input: mascot, top: 230, left: 830 },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile('public/og.jpg')
  console.log('og.jpg written')
})()
