// Cuts the Higgsfield reaction sheet (assets-source/higgsfield/reactions-original.webp, a 3 × 2 grid)
// into individual transparent stickers in public/assets. Usage: npm run stickers
import sharp from 'sharp'

const SRC = 'assets-source/higgsfield/reactions-original.webp'
const OUT = 'public/assets'
// Grid cell → sticker name. The sixth cell came back empty and is skipped.
const CELLS = [
  ['cry', 0, 0],
  ['inspect', 1, 0],
  ['stare', 2, 0],
  ['cheer', 0, 1],
  ['paper', 1, 1],
]

/** Removes the flat grey backdrop by flood filling from the cell border. White die cut edges stay. */
async function keyCell(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const isBg = (i) => {
    const r = data[i * 4]
    const g = data[i * 4 + 1]
    const b = data[i * 4 + 2]
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    return Math.max(r, g, b) - Math.min(r, g, b) <= 22 && lum >= 60 && lum <= 150
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
  for (let i = 0; i < w * h; i++) if (removed[i]) data[i * 4 + 3] = 0
  // Drop smaller foreground islands touching the cell edge: slivers of neighbouring stickers.
  // The largest island is always the sticker itself and is kept.
  const seen = new Uint8Array(w * h)
  const islands = []
  for (let start = 0; start < w * h; start++) {
    if (removed[start] || seen[start]) continue
    const island = []
    let touchesEdge = false
    const q = [start]
    seen[start] = 1
    while (q.length) {
      const i = q.pop()
      island.push(i)
      const x = i % w
      const y = (i / w) | 0
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) touchesEdge = true
      for (const n of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]) {
        if (n >= 0 && !removed[n] && !seen[n]) {
          seen[n] = 1
          q.push(n)
        }
      }
    }
    islands.push({ island, touchesEdge })
  }
  const largest = islands.reduce((a, b) => (b.island.length > a.island.length ? b : a), islands[0])
  for (const it of islands) if (it.touchesEdge && it !== largest) for (const i of it.island) data[i * 4 + 3] = 0
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim({ threshold: 1 }).png().toBuffer()
}

const meta = await sharp(SRC).metadata()
const cw = Math.floor(meta.width / 3)
const ch = Math.floor(meta.height / 2)
for (const [name, cx, cy] of CELLS) {
  // Widen each cell a little: stickers can poke past the nominal grid line.
  const pad = 48
  const left = Math.max(0, cx * cw - pad)
  const top = Math.max(0, cy * ch - pad)
  const right = Math.min(meta.width, (cx + 1) * cw + pad)
  const bottom = Math.min(meta.height, (cy + 1) * ch + pad)
  const cell = await sharp(SRC).extract({ left, top, width: right - left, height: bottom - top }).png().toBuffer()
  const keyed = await keyCell(cell)
  await sharp(keyed)
    .resize({ width: 512, height: 512, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 86, alphaQuality: 95 })
    .toFile(`${OUT}/sticker-${name}.webp`)
  console.log(`sticker-${name} ✓`)
}
