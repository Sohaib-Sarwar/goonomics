import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { SITE_URL } from './lib/site'

type User = ReturnType<typeof userEvent.setup>

/** The stepper item marked aria-current="step". */
const currentStep = () => {
  const nav = screen.getByRole('navigation', { name: 'Audit progress' })
  const li = nav.querySelector('li[aria-current="step"]')
  if (!li) throw new Error('No current step')
  return li as HTMLElement
}

async function start(user: User) {
  render(<App />)
  await user.click(screen.getByRole('button', { name: 'I am 18 or older' }))
}

async function setValue(user: User, label: string, value: string) {
  const input = screen.getByLabelText(label)
  await user.clear(input)
  await user.type(input, value)
}

async function runAudit(user: User, ages: [string, string], daily: string) {
  await setValue(user, 'Current age', ages[0])
  await setValue(user, 'Where the lore began', ages[1])
  await user.click(screen.getByRole('button', { name: 'Next: drop the receipts' }))
  await setValue(user, 'Average daily side quests', daily)
  await user.click(screen.getByRole('button', { name: 'Show me the damage' }))
  await user.click(await screen.findByRole('button', { name: 'Skip the drama' }))
  await screen.findByRole('tablist', { name: 'Result panels' })
}

describe('GOONOMICS 2.0 flow', () => {
  it('gates the site at 18+ and keeps the calculator hidden when declined', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /somewhere wholesome/i }))
    expect(screen.getByRole('heading', { name: /respect/i })).toBeInTheDocument()
    expect(screen.queryByLabelText('Current age')).not.toBeInTheDocument()
  })

  it('shows the stepper and blocks step 1 until the timeline is valid', async () => {
    const user = userEvent.setup()
    await start(user)
    expect(currentStep()).toHaveTextContent('The lore')
    await user.click(screen.getByRole('button', { name: 'Next: drop the receipts' }))
    expect(screen.getByLabelText('Current age')).toHaveAttribute('aria-invalid', 'true')
    expect(currentStep()).toHaveTextContent('The lore')

    await setValue(user, 'Current age', '17')
    await setValue(user, 'Where the lore began', '14')
    await user.click(screen.getByRole('button', { name: 'Next: drop the receipts' }))
    expect(screen.getByText('This audit is for adults (18+).')).toBeInTheDocument()
  })

  it('moves forward and back without losing input', async () => {
    const user = userEvent.setup()
    await start(user)
    await setValue(user, 'Current age', '30')
    await setValue(user, 'Where the lore began', '15')
    await user.click(screen.getByRole('button', { name: 'Next: drop the receipts' }))
    expect(currentStep()).toHaveTextContent('The receipts')
    await setValue(user, 'Average daily side quests', '0.8')

    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByLabelText('Current age')).toHaveValue('30')
    await user.click(screen.getByRole('button', { name: 'Next: drop the receipts' }))
    expect(screen.getByLabelText('Average daily side quests')).toHaveValue('0.8')
  })

  it('runs locally and reveals the correct numbers, GOI and achievements', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const user = userEvent.setup()
    await start(user)
    await runAudit(user, ['28', '18'], '1')

    expect(currentStep()).toHaveTextContent('Get cooked')
    // 10 years × 365.2425 × 1 per day
    expect(screen.getByLabelText('3,652 sessions')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Down Bad Research Fellow' })).toBeInTheDocument()
    const goi = Number(screen.getByLabelText(/^GOI \d+$/).getAttribute('aria-label')!.slice(4))
    expect(goi).toBeGreaterThanOrEqual(300)
    expect(goi).toBeLessThanOrEqual(850)
    for (const name of ['Lore unlocked', 'Spreadsheet survivor', 'Touch grass optional']) expect(screen.getByText(name)).toBeInTheDocument()
    expect(screen.queryByText('Final boss energy')).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'The swimmers' }))
    // Auto picks frequent values at one or more a day: 3,652 × 115 million ≈ 420 billion.
    expect(screen.getByLabelText('420 billion')).toBeInTheDocument()
    expect(screen.getByText('Kids wasted: biology says no.')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'The side quest' }))
    expect(screen.getByText('Your alternate timeline')).toBeInTheDocument()
    expect(screen.getByRole('meter', { name: /brainrot meter/i })).toBeInTheDocument()

    expect(fetchSpy).not.toHaveBeenCalled()
    fetchSpy.mockRestore()
  })

  it('changes the roast with heat but never the numbers', async () => {
    const user = userEvent.setup()
    await start(user)
    await runAudit(user, ['33', '14'], '0.5')
    const sessions = screen.getByLabelText(/ sessions$/).getAttribute('aria-label')
    const goi = screen.getByLabelText(/^GOI \d+$/).getAttribute('aria-label')
    const roastOf = () => screen.getByText(/^“.*”$/).textContent

    const seen = new Set<string | null>([roastOf()])
    for (const heat of ['Lightly cooked', 'Burnt to a crisp', 'Medium rare']) {
      await user.click(screen.getByRole('radio', { name: heat }))
      seen.add(roastOf())
      expect(screen.getByLabelText(/ sessions$/)).toHaveAttribute('aria-label', sessions)
      expect(screen.getByLabelText(/^GOI \d+$/)).toHaveAttribute('aria-label', goi)
    }
    expect(seen.size).toBeGreaterThan(1)

    await user.click(screen.getByRole('button', { name: 'New roast' }))
    expect(screen.getByLabelText(/ sessions$/)).toHaveAttribute('aria-label', sessions)
  })

  it('builds share cards with the QR, the domain and the real values, and shares privately', async () => {
    const user = userEvent.setup()
    await start(user)
    await runAudit(user, ['40', '20'], '0.3')
    await user.click(screen.getByRole('tab', { name: 'The allegations' }))

    const qr = screen.getByAltText('QR code to goonomics.vercel.app')
    expect(qr).toHaveAttribute('src', '/assets/goonomics-qr.png')
    // 20 years × 365.2425 × 0.3 = 2,191 sessions, shown on the card.
    expect(screen.getAllByText('2,191').length).toBeGreaterThan(0)
    expect(screen.getAllByText('goonomics.vercel.app').length).toBeGreaterThan(0)
    expect(screen.getByText(/Exports at 1080 × 1920/)).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Square mode' }))
    expect(screen.getByText(/Exports at 1080 × 1080/)).toBeInTheDocument()

    const wa = screen.getByRole('link', { name: 'Send on WhatsApp' })
    const text = decodeURIComponent(wa.getAttribute('href')!.replace('https://wa.me/?text=', ''))
    expect(text).toContain(SITE_URL)
    expect(text).not.toMatch(/\b40\b|\b20\b/)

    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    await user.click(screen.getByRole('button', { name: 'Copy caption' }))
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1))
    expect(writeText.mock.calls[0]![0]).toContain(SITE_URL)
    expect(await screen.findByText('Caption copied. Go post it.')).toBeInTheDocument()

    await setValue(user, 'Their GOI', '500')
    await user.click(screen.getByRole('button', { name: 'Compare' }))
    expect(screen.getByText(/vs them 500/)).toBeInTheDocument()
  })

  it('edits receipts with answers kept, and start over clears everything', async () => {
    const user = userEvent.setup()
    await start(user)
    await runAudit(user, ['25', '15'], '0.4')
    await user.click(screen.getAllByRole('button', { name: 'Edit my receipts' })[0]!)
    expect(currentStep()).toHaveTextContent('The receipts')
    expect(screen.getByLabelText('Average daily side quests')).toHaveValue('0.4')

    await user.click(screen.getByRole('button', { name: 'Show me the damage' }))
    await user.click(await screen.findByRole('button', { name: 'Skip the drama' }))
    await user.click((await screen.findAllByRole('button', { name: 'Start over' }))[0]!)
    expect(screen.getByLabelText('Current age')).toHaveValue('')
  })

  it('opens and closes the receipts dialog', async () => {
    const user = userEvent.setup()
    await start(user)
    await user.click(screen.getByRole('button', { name: 'How we cooked the numbers' }))
    const dialog = screen.getByRole('dialog', { name: 'How we cooked the numbers' })
    expect(within(dialog).getByText('Did I actually waste those kids?')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'How we cooked the numbers' })).not.toBeInTheDocument()
  })
})
