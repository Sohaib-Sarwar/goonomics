// Turns the Higgsfield rank badge renders into transparent web emblems.
// 1. Archives any new raw download (assets-raw/badge-<id>.png) losslessly into assets-source/higgsfield.
// 2. Keys out the flat grey backdrop and writes public/assets/badge-<id>.webp (256 px).
// Usage: npm run badges
import fs from 'node:fs'
import sharp from 'sharp'

const IDS = ['grass', 'rookie', 'farmer', 'lord', 'legend', 'peak', 'ultimate']
const SRC = 'assets-source/higgsfield'

/** Flood fills the low saturation backdrop from the border, then drops leftover edge islands. */
async function key(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  // Sample the backdrop from the four corners and key by colour distance from it, so grey metals
  // (the silver star) are not mistaken for background.
  const corners = [0, w - 1, (h - 1) * w, h * w - 1].map((i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]])
  const bg = [0, 1, 2].map((c) => corners.map((p) => p[c]).sort((a, b) => a - b)[1])
  const isBg = (i) => Math.hypot(data[i * 4] - bg[0], data[i * 4 + 1] - bg[1], data[i * 4 + 2] - bg[2]) < 26
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
  // Soften the cut: pixels next to the removed area fade by how close they are to the backdrop.
  for (let i = 0; i < w * h; i++) {
    if (removed[i]) {
      data[i * 4 + 3] = 0
      continue
    }
    const x = i % w
    const y = (i / w) | 0
    const edge = (x > 0 && removed[i - 1]) || (x < w - 1 && removed[i + 1]) || (y > 0 && removed[i - w]) || (y < h - 1 && removed[i + w])
    if (edge) data[i * 4 + 3] = 170
  }
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim({ threshold: 1 }).png().toBuffer()
}

fs.mkdirSync(SRC, { recursive: true })
for (const id of IDS) {
  const raw = `assets-raw/badge-${id}.png`
  const archived = `${SRC}/badge-${id}-original.webp`
  if (fs.existsSync(raw) && !fs.existsSync(archived)) await sharp(raw).webp({ lossless: true, effort: 6 }).toFile(archived)
  if (!fs.existsSync(archived)) {
    console.log(`badge-${id}: no source, skipped`)
    continue
  }
  const keyed = await key(archived)
  await sharp(keyed)
    .resize({ width: 256, height: 256, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 88, alphaQuality: 95 })
    .toFile(`public/assets/badge-${id}.webp`)
  console.log(`badge-${id} ✓`)
}
