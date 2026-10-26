import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { MICROCOPY } from './lib/copy/lines'
import { SITE_HOST, SITE_URL } from './lib/site'

type User = ReturnType<typeof userEvent.setup>

/** The stepper item marked aria-current="step". */
const currentStep = () => {
  const li = screen.getByRole('navigation', { name: 'Audit progress' }).querySelector('li[aria-current="step"]')
  if (!li) throw new Error('No current step')
  return li as HTMLElement
}

async function start(user: User) {
  render(<App />)
  await user.click(screen.getByRole('button', { name: 'I am 18 or older' }))
  await user.click(screen.getAllByRole('button', { name: 'Run my audit' })[0]!)
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

describe('GOONOMICS flow', () => {
  it('gates at 18+, then lands on the hook with a how it works explainer', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'I am 18 or older' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Your lore. Under investigation.' })).toBeInTheDocument()
    expect(screen.getAllByText('Drop the lore').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Cook your friends').length).toBeGreaterThan(0)
    await user.click(screen.getAllByRole('button', { name: 'Show me how it works' })[0]!)
    expect(screen.getByRole('dialog', { name: 'Three steps. Zero shame.' })).toBeInTheDocument()
  })

  it('keeps the calculator hidden when declined', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /somewhere wholesome/i }))
    expect(screen.queryByLabelText('Current age')).not.toBeInTheDocument()
  })

  it('comments live on what is typed and blocks invalid timelines', async () => {
    const user = userEvent.setup()
    await start(user)
    expect(currentStep()).toHaveTextContent('The lore')
    await setValue(user, 'Current age', '45')
    expect(screen.getAllByText(/unc|DLC|archive/i).length).toBeGreaterThan(0)
    await setValue(user, 'Where the lore began', '50')
    expect(screen.getAllByText('Time travel is not supported. Yet.').length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: 'Next: drop the receipts' }))
    expect(currentStep()).toHaveTextContent('The lore')
    expect(screen.getByLabelText('Where the lore began')).toHaveAttribute('aria-invalid', 'true')
  })

  it('rejects more than 17 a day with the over limit roast, and keeps answers when going back', async () => {
    const user = userEvent.setup()
    await start(user)
    await setValue(user, 'Current age', '30')
    await setValue(user, 'Where the lore began', '15')
    await user.click(screen.getByRole('button', { name: 'Next: drop the receipts' }))
    expect(currentStep()).toHaveTextContent('The receipts')

    await setValue(user, 'Average daily side quests', '25')
    expect(screen.getAllByText('HOW ARE YOU EVEN ALIVE? 💀 MAX IS 17. BRO, WE ARE CALCULATING, NOT SUMMONING THE FBI.').length).toBeGreaterThan(0)
    expect(screen.getByLabelText('Average daily side quests')).toHaveValue('25')
    await user.click(screen.getByRole('button', { name: 'Show me the damage' }))
    expect(screen.queryByRole('tablist', { name: 'Result panels' })).not.toBeInTheDocument()

    await setValue(user, 'Average daily side quests', '0.8')
    expect(screen.queryByText(/HOW ARE YOU EVEN ALIVE/)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Go back to my lore' }))
    expect(screen.getByLabelText('Current age')).toHaveValue('30')
    await user.click(screen.getByRole('button', { name: 'Next: drop the receipts' }))
    expect(screen.getByLabelText('Average daily side quests')).toHaveValue('0.8')
  })

  it('runs locally and reveals the right numbers, GOI, achievements and swimmer meme', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const user = userEvent.setup()
    await start(user)
    await runAudit(user, ['28', '18'], '1')

    // The results page drops the step progress bar; its own tabs take over.
    expect(screen.queryByRole('navigation', { name: 'Audit progress' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('3,652 sessions')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Down Bad Research Fellow' })).toBeInTheDocument()
    const goiButton = screen.getByRole('button', { name: /^GOI \d+, .*score manual$/ })
    const goi = Number(goiButton.getAttribute('aria-label')!.match(/^GOI (\d+)/)![1])
    expect(goi).toBeGreaterThanOrEqual(300)
    for (const name of ['Lore unlocked', 'Spreadsheet survivor', 'Touch grass optional']) expect(screen.getByText(name)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /rank badge (Aura Legend|Peak Gooner|Lore Lord|Aura Farmer)/ })).toBeInTheDocument()

    await user.click(goiButton)
    expect(screen.getByRole('dialog', { name: 'So how cooked are you?' })).toHaveTextContent('you are here')
    expect(screen.getByRole('dialog', { name: 'So how cooked are you?' })).toHaveTextContent('Ultimate Gooner')
    expect(screen.getByRole('dialog', { name: 'So how cooked are you?' })).toHaveTextContent('Discipline')
    await user.keyboard('{Escape}')

    await user.click(screen.getByRole('tab', { name: 'Swimmers' }))
    expect(screen.getByLabelText('420 billion')).toBeInTheDocument()
    expect(screen.getByText(/sperm cells are single cells, not babies/)).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Timeline' }))
    expect(screen.getByText('short books read')).toBeInTheDocument()
    expect(screen.getByText(/Scientist arc/)).toBeInTheDocument()

    expect(fetchSpy).not.toHaveBeenCalled()
    fetchSpy.mockRestore()
  })

  it('changes the roast with heat but never the numbers', async () => {
    const user = userEvent.setup()
    await start(user)
    await runAudit(user, ['33', '14'], '0.5')
    const sessions = screen.getByLabelText(/ sessions$/).getAttribute('aria-label')
    const goi = screen.getByRole('button', { name: /^GOI \d+/ }).getAttribute('aria-label')
    const roastOf = () => screen.getByText(/^“.*”$/).textContent
    const seen = new Set<string | null>([roastOf()])
    for (const heat of ['Lightly cooked', 'Burnt to a crisp', 'Medium rare']) {
      await user.click(screen.getByRole('radio', { name: heat }))
      seen.add(roastOf())
      expect(screen.getByLabelText(/ sessions$/)).toHaveAttribute('aria-label', sessions)
      expect(screen.getByRole('button', { name: /^GOI \d+/ })).toHaveAttribute('aria-label', goi)
    }
    expect(seen.size).toBeGreaterThan(1)
  })

  it('builds one master card from the exposed fields, with the QR and no visible domain', async () => {
    const user = userEvent.setup()
    await start(user)
    await runAudit(user, ['40', '20'], '0.3')
    await user.click(screen.getByRole('tab', { name: 'The card' }))

    const qrs = screen.getAllByAltText('QR code to get your own audit')
    for (const qr of qrs) expect(qr).toHaveAttribute('src', '/assets/goonomics-qr.png')
    expect(screen.queryByText(SITE_HOST)).not.toBeInTheDocument()
    expect(screen.getAllByText(MICROCOPY.cardScan).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Rank badge').length).toBeGreaterThan(0)

    // Default hides personal statistics; showing all adds them; the numbers stay the same.
    const sessionsToggle = screen.getByRole('button', { name: 'Lifetime sessions' })
    expect(sessionsToggle).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByText('2,191')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Show all the receipts' }))
    for (const b of within(screen.getByRole('group', { name: 'What are we exposing?' })).getAllByRole('button')) expect(b).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByText('2,191').length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: 'Recommended' }))
    expect(screen.queryByText('2,191')).not.toBeInTheDocument()

    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    await user.click(screen.getByRole('button', { name: 'Copy the roast' }))
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1))
    expect(writeText.mock.calls[0]![0]).toContain(SITE_URL)
    expect(writeText.mock.calls[0]![0]).not.toMatch(/\b40\b|\b20\b/)
    expect(await screen.findByText('Roast copied. Use responsibly.')).toBeInTheDocument()
  })

  it('settles who is more cooked locally', async () => {
    const user = userEvent.setup()
    await start(user)
    await runAudit(user, ['40', '20'], '0.3')
    await user.click(screen.getByRole('tab', { name: 'Versus' }))
    await setValue(user, 'Their GOI', '850')
    expect(screen.getByText(/Different league/)).toBeInTheDocument()
    await setValue(user, 'Their GOI', '200')
    expect(screen.getByText(/whole number from 300 to 850/)).toBeInTheDocument()
  })

  it('edits receipts with answers kept, and start over clears everything', async () => {
    const user = userEvent.setup()
    await start(user)
    await runAudit(user, ['25', '15'], '0.4')
    await user.click(screen.getByRole('button', { name: 'Edit my receipts' }))
    expect(currentStep()).toHaveTextContent('The receipts')
    expect(screen.getByLabelText('Average daily side quests')).toHaveValue('0.4')
    await user.click(screen.getByRole('button', { name: 'Show me the damage' }))
    await user.click(await screen.findByRole('button', { name: 'Skip the drama' }))
    await user.click(await screen.findByRole('button', { name: 'Start over' }))
    expect(screen.getByLabelText('Current age')).toHaveValue('')
  })

  it('opens and closes the methodology sheet', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'I am 18 or older' }))
    await user.click(screen.getByRole('button', { name: 'How we cooked the numbers' }))
    const dialog = screen.getByRole('dialog', { name: 'How we cooked the numbers' })
    expect(within(dialog).getByText('Did I actually waste those kids?')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'How we cooked the numbers' })).not.toBeInTheDocument()
  })

  it('offers an opt in plan in Tarn that brings nothing by default except the age range the person can untick', async () => {
    const user = userEvent.setup()
    await start(user)
    await runAudit(user, ['28', '18'], '1')
    await user.click(screen.getByRole('button', { name: /Build my plan/ }))
    const dialog = screen.getByRole('dialog', { name: 'Build my plan in Tarn' })
    expect(within(dialog).getByRole('checkbox', { name: 'Bring my age range' })).toBeChecked()
    expect(within(dialog).getByRole('checkbox', { name: 'Bring my GOI as a note' })).not.toBeChecked()
    expect(within(dialog).getByText(/never decides anything/)).toBeInTheDocument()
    expect(sessionStorage.getItem('tarn-handoff')).toBeNull()
  })
})
