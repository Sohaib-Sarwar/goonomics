// Writes the placeholder QR to public/assets/goonomics-qr.png, encoding the production URL.
// To use your own QR art instead, overwrite that PNG with the same filename. No code change needed.
// Usage: npm run qr
import QRCode from 'qrcode'

const URL = 'https://goonomics.vercel.app'
const OUT = 'public/assets/goonomics-qr.png'

await QRCode.toFile(OUT, URL, {
  errorCorrectionLevel: 'M',
  margin: 4, // quiet zone, in modules
  width: 1024,
  color: { dark: '#0C0C0F', light: '#FFFFFF' },
})
console.log(`QR for ${URL} written to ${OUT}`)
