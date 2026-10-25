// Builds the optimized web assets in public/assets from the archived Higgsfield originals in
// assets-source/higgsfield (committed, pixel-identical lossless WebP copies of the downloads).
// Nothing here talks to Higgsfield or any CDN. Usage: npm run assets
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const SRC = 'assets-source/higgsfield'
const OUT = 'public/assets'
await mkdir(OUT, { recursive: true })

/**
 * Keys out a flat, low saturation background by flood filling from the image border.
 * Grey pixels reachable from the edge become transparent; dark outline pixels bordering the
 * removed area get partial alpha for a soft edge.
 */
async function keyOutBackground(input, { minLum = 38, maxSat = 26 } = {}) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const px = (i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]
  const isBg = (i) => {
    const [r, g, b] = px(i)
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    return Math.max(r, g, b) - Math.min(r, g, b) <= maxSat && lum >= minLum && lum <= 120
  }
  const removed = new Uint8Array(w * h)
  const stack = []
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x)
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1)
  while (stack.length) {
    const i = stack.pop()
    if (removed[i] || !isBg(i)) continue
    removed[i] = 1
    const x = i % w
    const y = (i / w) | 0
    if (x > 0) stack.push(i - 1)
    if (x < w - 1) stack.push(i + 1)
    if (y > 0) stack.push(i - w)
    if (y < h - 1) stack.push(i + w)
  }
  for (let i = 0; i < w * h; i++) {
    if (removed[i]) {
      data[i * 4 + 3] = 0
      continue
    }
    const x = i % w
    const y = (i / w) | 0
    const touchesBg = (x > 0 && removed[i - 1]) || (x < w - 1 && removed[i + 1]) || (y > 0 && removed[i - w]) || (y < h - 1 && removed[i + w])
    if (!touchesBg) continue
    const [r, g, b] = px(i)
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    if (lum > 24 && Math.max(r, g, b) - Math.min(r, g, b) <= maxSat) {
      data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = 18
      data[i * 4 + 3] = Math.round(Math.max(0, Math.min(1, (75 - lum) / 55)) * 255)
    }
  }
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim({ threshold: 1 })
}

const clear = { r: 0, g: 0, b: 0, alpha: 0 }
const keyed = await (await keyOutBackground(`${SRC}/mascot-original.webp`)).png().toBuffer()
await sharp(keyed).resize({ width: 640, height: 640, fit: 'contain', background: clear }).extend({ top: 24, bottom: 24, left: 24, right: 24, background: clear }).webp({ quality: 88, alphaQuality: 95 }).toFile(`${OUT}/goonomics-mascot.webp`)
await sharp(keyed).resize({ width: 240, height: 240, fit: 'contain', background: clear }).webp({ quality: 88 }).toFile(`${OUT}/goonomics-mascot-sm.webp`)
await sharp(keyed).resize({ width: 180, height: 180, fit: 'contain', background: clear }).flatten({ background: '#0C0C0F' }).png().toFile('public/apple-touch-icon.png')
console.log('mascot ✓')

for (const width of [960, 1600, 2048]) {
  await sharp(`${SRC}/hero-original.webp`).resize({ width }).webp({ quality: 72 }).toFile(`${OUT}/goonomics-hero-${width}.webp`)
}
console.log('hero ✓')
