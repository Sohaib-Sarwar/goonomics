import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

async function passAgeGate(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'I am 18 or older' }))
}

const submitButton = () => screen.getAllByRole('button', { name: 'Run my goon audit' }).find((b) => b.getAttribute('type') === 'submit')!

async function fillSimple(user: ReturnType<typeof userEvent.setup>, values: Record<string, string>) {
  for (const [label, value] of Object.entries(values)) {
    const input = screen.getByLabelText(label)
    await user.clear(input)
    await user.type(input, value)
  }
}

describe('GOONOMICS user flow', () => {
  it('gates the site behind an 18+ confirmation and remembers it for the tab', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('dialog')).toHaveTextContent('Adults only')
    expect(screen.queryByRole('heading', { name: /intake form/i })).not.toBeInTheDocument()
    await passAgeGate(user)
    expect(screen.getByRole('heading', { name: /intake form/i })).toBeInTheDocument()
    expect(sessionStorage.getItem('goonomics:age-ok')).toBe('1')
  })

  it('lets under-18 visitors decline without exposing the calculator', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /somewhere wholesome/i }))
    expect(screen.getByRole('heading', { name: /respect/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /intake form/i })).not.toBeInTheDocument()
  })

  it('shows inline errors instead of running with missing input', async () => {
    const user = userEvent.setup()
    render(<App />)
    await passAgeGate(user)
    await user.click(submitButton())
    expect(await screen.findByText(/3 things need fixing/)).toBeInTheDocument()
    expect(screen.getByLabelText('Current age')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.queryByText(/audit in progress/i)).not.toBeInTheDocument()
  })

  it('runs the audit locally, shows the loading sequence, and reveals a deterministic report', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const user = userEvent.setup()
    render(<App />)
    await passAgeGate(user)
    await fillSimple(user, { 'Current age': '28', 'Starting age': '18', 'Regular frequency': '1' })
    await user.click(submitButton())

    expect(await screen.findByText(/audit in progress/i)).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Skip the drama' }))

    // 10 years × 365.2425 days × 1 per day
    const ledger = await screen.findByRole('region', { name: /lifetime session ledger/i })
    expect(within(ledger).getByText('3,652')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'The Down-Bad Research Fellow' })).toBeInTheDocument()
    expect(screen.getByText('Potential kids wasted: biology says no.')).toBeInTheDocument()
    // Auto picks frequent-session values at one or more per day: 3,652 × 115M ≈ 420 billion.
    expect(within(screen.getByRole('region', { name: /little swimmer ledger/i })).getByText('420 billion')).toBeInTheDocument()

    // Nothing was sent anywhere during the whole flow.
    expect(fetchSpy).not.toHaveBeenCalled()
    fetchSpy.mockRestore()
  })

  it('keeps numbers fixed when rerolling the roast, and copies a summary without ages', async () => {
    const user = userEvent.setup()
    render(<App />)
    await passAgeGate(user)
    await fillSimple(user, { 'Current age': '33', 'Starting age': '14', 'Regular frequency': '0.5' })
    await user.click(submitButton())
    await user.click(await screen.findByRole('button', { name: 'Skip the drama' }))

    const ledger = await screen.findByRole('region', { name: /lifetime session ledger/i })
    const before = within(ledger).getByText(/^\d[\d,]*$/).textContent
    for (let i = 0; i < 3; i++) await user.click(screen.getByRole('button', { name: 'New roast' }))
    expect(within(ledger).getByText(/^\d[\d,]*$/).textContent).toBe(before)

    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    await user.click(screen.getByRole('button', { name: 'Copy results' }))
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1))
    const text = writeText.mock.calls[0]![0] as string
    expect(text).toContain('GOONOMICS')
    expect(text).toContain(before!)
    expect(text).not.toMatch(/\b33\b|\b14\b/)
    expect(await screen.findByText('Results copied to your clipboard.')).toBeInTheDocument()
  })

  it('returns to the form with answers kept on edit, and cleared on a new audit', async () => {
    const user = userEvent.setup()
    render(<App />)
    await passAgeGate(user)
    await fillSimple(user, { 'Current age': '40', 'Starting age': '20', 'Regular frequency': '0.3' })
    await user.click(submitButton())
    await user.click(await screen.findByRole('button', { name: 'Skip the drama' }))

    await user.click(await screen.findByRole('button', { name: /edit my answers/i }))
    expect(screen.getByLabelText('Current age')).toHaveValue('40')

    await user.click(submitButton())
    await user.click(await screen.findByRole('button', { name: 'Skip the drama' }))
    await user.click(await screen.findByRole('button', { name: /run a new audit/i }))
    expect(screen.getByLabelText('Current age')).toHaveValue('')
  })

  it('models eras and rejects overlaps', async () => {
    const user = userEvent.setup()
    render(<App />)
    await passAgeGate(user)
    await fillSimple(user, { 'Current age': '30', 'Starting age': '14' })
    await user.click(screen.getByRole('radio', { name: 'Split into eras' }))
    const froms = screen.getAllByLabelText('From age')
    expect(froms).toHaveLength(4)

    // Make the second era start inside the first one.
    await user.clear(froms[1]!)
    await user.type(froms[1]!, '16')
    for (const input of screen.getAllByLabelText('Regular / day')) await user.type(input, '1')
    await user.click(submitButton())
    expect(await screen.findByText(/Overlaps with/)).toBeInTheDocument()

    await user.clear(froms[1]!)
    await user.type(froms[1]!, '18')
    await user.click(submitButton())
    await user.click(await screen.findByRole('button', { name: 'Skip the drama' }))
    const ledger = await screen.findByRole('region', { name: /lifetime session ledger/i })
    // 16 years × 365.2425 × 1
    expect(within(ledger).getByText('5,844')).toBeInTheDocument()
    expect(within(ledger).getByRole('table')).toHaveTextContent('University arc')
  })
})
