// Turns raw Higgsfield downloads (assets-raw/, git-ignored) into optimized web assets in public/assets/.
// Usage: npm run assets
import sharp from 'sharp'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'

const RAW = 'assets-raw'
const OUT = 'public/assets'
await mkdir(OUT, { recursive: true })

/**
 * Keys out a flat, low-saturation background by flood-filling from the image border.
 * Pixels reachable from the edge that are grey-ish and not darker than `minLum` become transparent;
 * dark outline pixels bordering the removed area get partial alpha for a soft anti-aliased edge.
 */
async function keyOutBackground(input, { minLum = 38, maxSat = 26 } = {}) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const px = (i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]
  const isBg = (i) => {
    const [r, g, b] = px(i)
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    return max - min <= maxSat && lum >= minLum && lum <= 120
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
    const touchesBg =
      (x > 0 && removed[i - 1]) || (x < w - 1 && removed[i + 1]) || (y > 0 && removed[i - w]) || (y < h - 1 && removed[i + w])
    if (!touchesBg) continue
    const [r, g, b] = px(i)
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    // Edge pixels are a blend of outline (~20) and background (~70): recover coverage.
    if (lum > 24 && Math.max(r, g, b) - Math.min(r, g, b) <= maxSat) {
      const a = Math.max(0, Math.min(1, (75 - lum) / 55))
      data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = 18
      data[i * 4 + 3] = Math.round(a * 255)
    }
  }
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim({ threshold: 1 })
}

if (existsSync(`${RAW}/mascot-raw.png`)) {
  const keyed = await (await keyOutBackground(`${RAW}/mascot-raw.png`)).png().toBuffer()
  const pad = { top: 24, bottom: 24, left: 24, right: 24, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  await sharp(keyed).resize({ width: 640, height: 640, fit: 'contain', background: pad.background }).extend(pad).webp({ quality: 88, alphaQuality: 95 }).toFile(`${OUT}/goonomics-mascot.webp`)
  await sharp(keyed).resize({ width: 240, height: 240, fit: 'contain', background: pad.background }).webp({ quality: 88 }).toFile(`${OUT}/goonomics-mascot-sm.webp`)
  await sharp(keyed).resize({ width: 180, height: 180, fit: 'contain', background: { r: 12, g: 12, b: 15, alpha: 1 } }).flatten({ background: '#0C0C0F' }).png().toFile('public/apple-touch-icon.png')
  console.log('mascot ✓')
}

if (existsSync(`${RAW}/hero-raw.png`)) {
  for (const width of [960, 1600, 2048]) {
    await sharp(`${RAW}/hero-raw.png`).resize({ width }).webp({ quality: 72 }).toFile(`${OUT}/goonomics-hero-${width}.webp`)
  }
  console.log('hero ✓')
}

if (existsSync(`${RAW}/reactions-raw.png`)) {
  // 3 × 2 grid → six individual stickers, each keyed and trimmed.
  const meta = await sharp(`${RAW}/reactions-raw.png`).metadata()
  const names = ['suspicious', 'shocked', 'graduate', 'textbook', 'buried', 'stamp']
  const cw = Math.floor(meta.width / 3)
  const ch = Math.floor(meta.height / 2)
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = await sharp(`${RAW}/reactions-raw.png`).extract({ left: c * cw, top: r * ch, width: cw, height: ch }).png().toBuffer()
      const keyed = await (await keyOutBackground(cell)).png().toBuffer()
      const name = names[r * 3 + c]
      await sharp(keyed).resize({ width: 320, height: 320, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 86, alphaQuality: 95 }).toFile(`${OUT}/reaction-${name}.webp`)
    }
  }
  await sharp(`${RAW}/reactions-raw.png`).resize({ width: 1200 }).webp({ quality: 78 }).toFile(`${OUT}/goonomics-reactions.webp`)
  console.log('reactions ✓')
}
