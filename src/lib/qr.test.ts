// @vitest-environment node
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import jsQR from 'jsqr'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { QR_SRC, SITE_URL } from './site'

describe('QR placeholder', () => {
  const file = join(process.cwd(), 'public', QR_SRC)

  it('lives at the documented path', () => {
    expect(QR_SRC).toBe('/assets/goonomics-qr.png')
    expect(existsSync(file)).toBe(true)
  })

  it('scans to the production URL', async () => {
    const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    const decoded = jsQR(new Uint8ClampedArray(data), info.width, info.height)
    expect(decoded?.data).toBe(SITE_URL)
    expect(SITE_URL).toBe('https://goonomics.vercel.app')
  })

  it('still scans when shrunk to the size used on the square card', async () => {
    const { data, info } = await sharp(file).resize(210, 210, { kernel: 'nearest' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    expect(jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data).toBe(SITE_URL)
  })
})
