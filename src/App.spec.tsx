import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

function setup() {
  const user = userEvent.setup()
  render(<App />)
  return { user }
}

function getInputByLabel(label: string) {
  return screen.getByText(label).closest('div')!.parentElement!.querySelector('input')!
}

function getBillInput() {
  return getInputByLabel('Bill')
}

function getTipInput() {
  return getInputByLabel('Tip')
}

function getComputedValue(label: string) {
  const labelEl = screen.getByText(label)
  const section = labelEl.closest('div')!.parentElement!
  return within(section).getByText(/[\d,]+\.\d{2}/)
}

describe('App – initial render', () => {
  it('renders heading', () => {
    setup()
    expect(screen.getByRole('heading', { name: 'Tip Calculator' })).toBeInTheDocument()
  })

  it('bill input has default value "0.00"', () => {
    setup()
    expect(getBillInput()).toHaveValue('0.00')
  })

  it('tip input has default value "0"', () => {
    setup()
    expect(getTipInput()).toHaveValue(0)
  })

  it('tip amount shows "0.00"', () => {
    setup()
    expect(getComputedValue('Tip amount').textContent).toBe('0.00')
  })

  it('total shows "0.00"', () => {
    setup()
    expect(getComputedValue('Total').textContent).toBe('0.00')
  })

  it('split section body is hidden', () => {
    setup()
    expect(screen.queryByText('Number of people')).not.toBeInTheDocument()
  })
})

describe('App – Bill input', () => {
  it('accepts valid bill value', async () => {
    const { user } = setup()
    const bill = getBillInput()
    await user.clear(bill)
    await user.type(bill, '100')
    expect(bill).toHaveValue('100')
  })

  it('rejects letters', async () => {
    const { user } = setup()
    const bill = getBillInput()
    await user.clear(bill)
    await user.type(bill, 'abc')
    expect(bill).toHaveValue('')
  })

  it('rejects more than 2 decimal places', async () => {
    const { user } = setup()
    const bill = getBillInput()
    await user.clear(bill)
    await user.type(bill, '1.999')
    expect(bill).toHaveValue('1.99')
  })

  it('rejects value above 100000', async () => {
    const { user } = setup()
    const bill = getBillInput()
    await user.clear(bill)
    await user.type(bill, '100001')
    expect(bill).not.toHaveValue('100001')
  })

  it('normalizes on blur', async () => {
    const { user } = setup()
    const bill = getBillInput()
    await user.clear(bill)
    await user.type(bill, '50')
    await user.tab()
    expect(bill).toHaveValue('50.00')
  })
})

describe('App – Tip input', () => {
  it('accepts valid tip percentage', async () => {
    const { user } = setup()
    const tip = getTipInput()
    await user.clear(tip)
    await user.type(tip, '15')
    expect(tip).toHaveValue(15)
  })

  it('rejects value above 100', async () => {
    const { user } = setup()
    const tip = getTipInput()
    await user.clear(tip)
    await user.type(tip, '101')
    expect(tip).not.toHaveValue(101)
  })

  it('normalizes empty tip to "0" on blur', async () => {
    const { user } = setup()
    const tip = getTipInput()
    await user.clear(tip)
    await user.tab()
    expect(tip).toHaveValue(0)
  })
})

describe('App – recalculation', () => {
  async function setValues(user: ReturnType<typeof userEvent.setup>, bill: string, tip: string) {
    const billInput = getBillInput()
    await user.clear(billInput)
    await user.type(billInput, bill)
    await user.tab()
    const tipInput = getTipInput()
    await user.clear(tipInput)
    await user.type(tipInput, tip)
    await user.tab()
  }

  it('bill 100 + tip 10% → tip amount 10.00, total 110.00', async () => {
    const { user } = setup()
    await setValues(user, '100', '10')
    expect(getComputedValue('Tip amount').textContent).toBe('10.00')
    expect(getComputedValue('Total').textContent).toBe('110.00')
  })

  it('bill 50 + tip 20% → tip amount 10.00, total 60.00', async () => {
    const { user } = setup()
    await setValues(user, '50', '20')
    expect(getComputedValue('Tip amount').textContent).toBe('10.00')
    expect(getComputedValue('Total').textContent).toBe('60.00')
  })

  it('bill 0 → tip amount and total are 0.00 regardless of tip', async () => {
    const { user } = setup()
    await setValues(user, '0', '25')
    expect(getComputedValue('Tip amount').textContent).toBe('0.00')
    expect(getComputedValue('Total').textContent).toBe('0.00')
  })

  it('tip 0 → tip amount 0.00, total equals bill', async () => {
    const { user } = setup()
    await setValues(user, '80', '0')
    expect(getComputedValue('Tip amount').textContent).toBe('0.00')
    expect(getComputedValue('Total').textContent).toBe('80.00')
  })
})

describe('App – split section toggle', () => {
  it('clicking toggle shows Number of people input', async () => {
    const { user } = setup()
    await user.click(screen.getByText('Are you splitting the bill?'))
    expect(getInputByLabel('Number of people')).toBeInTheDocument()
  })

  it('clicking toggle again hides the section', async () => {
    const { user } = setup()
    await user.click(screen.getByText('Are you splitting the bill?'))
    await user.click(screen.getByText('Are you splitting the bill?'))
    expect(screen.queryByText('Number of people')).not.toBeInTheDocument()
  })

  it('shows per-person fields when open', async () => {
    const { user } = setup()
    await user.click(screen.getByText('Are you splitting the bill?'))
    expect(screen.getByText('Tip per person')).toBeInTheDocument()
    expect(screen.getByText('Total per person')).toBeInTheDocument()
  })
})

describe('App – Number of people', () => {
  beforeEach(async () => {
    // Each test renders fresh via setup(), but we need to open the split section
  })

  async function openSplit(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByText('Are you splitting the bill?'))
  }

  function getPeopleInput() {
    return getInputByLabel('Number of people')
  }

  it('default value is 2', async () => {
    const { user } = setup()
    await openSplit(user)
    expect(getPeopleInput()).toHaveValue(2)
  })

  it('"1" is blocked (isValidPeopleInput allows, normalizePeople fixes on blur)', async () => {
    const { user } = setup()
    await openSplit(user)
    const people = getPeopleInput()
    await user.clear(people)
    await user.type(people, '1')
    await user.tab()
    expect(people).toHaveValue(2)
  })

  it('"51" is blocked by isValidPeopleInput', async () => {
    const { user } = setup()
    await openSplit(user)
    const people = getPeopleInput()
    await user.clear(people)
    await user.type(people, '51')
    expect(people).not.toHaveValue(51)
  })

  it('empty value normalizes to 2 on blur', async () => {
    const { user } = setup()
    await openSplit(user)
    const people = getPeopleInput()
    await user.clear(people)
    await user.tab()
    expect(people).toHaveValue(2)
  })
})

describe('App – per-person calculations', () => {
  async function setupWithValues(bill: string, tip: string, people: string) {
    const user = userEvent.setup()
    render(<App />)

    const billInput = getBillInput()
    await user.clear(billInput)
    await user.type(billInput, bill)
    await user.tab()

    const tipInput = getTipInput()
    await user.clear(tipInput)
    await user.type(tipInput, tip)
    await user.tab()

    await user.click(screen.getByText('Are you splitting the bill?'))

    const peopleInput = getInputByLabel('Number of people')
    await user.clear(peopleInput)
    await user.type(peopleInput, people)
    await user.tab()

    return { user }
  }

  it('bill 100, tip 10%, 2 people → tip/person 5.00, total/person 55.00', async () => {
    await setupWithValues('100', '10', '2')
    expect(getComputedValue('Tip per person').textContent).toBe('5.00')
    expect(getComputedValue('Total per person').textContent).toBe('55.00')
  })

  it('bill 100, tip 10%, 4 people → tip/person 2.50, total/person 27.50', async () => {
    await setupWithValues('100', '10', '4')
    expect(getComputedValue('Tip per person').textContent).toBe('2.50')
    expect(getComputedValue('Total per person').textContent).toBe('27.50')
  })

  it('bill 75, tip 15%, 3 people → tip/person 3.75, total/person 28.75', async () => {
    await setupWithValues('75', '15', '3')
    expect(getComputedValue('Tip per person').textContent).toBe('3.75')
    expect(getComputedValue('Total per person').textContent).toBe('28.75')
  })
})

describe('App – Reset button', () => {
  it('resets all values and closes split section', async () => {
    const { user } = setup()

    const bill = getBillInput()
    await user.clear(bill)
    await user.type(bill, '100')
    await user.tab()

    const tip = getTipInput()
    await user.clear(tip)
    await user.type(tip, '20')
    await user.tab()

    await user.click(screen.getByText('Are you splitting the bill?'))

    await user.click(screen.getByRole('button', { name: /reset/i }))

    expect(bill).toHaveValue('0.00')
    expect(tip).toHaveValue(0)
    expect(getComputedValue('Tip amount').textContent).toBe('0.00')
    expect(getComputedValue('Total').textContent).toBe('0.00')
    expect(screen.queryByText('Number of people')).not.toBeInTheDocument()
  })
})

describe('App – accessibility', () => {
  it('bill input has accessible label', () => {
    setup()
    expect(screen.getByLabelText('Bill')).toBeInTheDocument()
  })

  it('tip input has accessible label', () => {
    setup()
    expect(screen.getByLabelText('Tip')).toBeInTheDocument()
  })

  it('reset button is accessible by role and name', () => {
    setup()
    expect(screen.getByRole('button', { name: /reset/i })).toBeEnabled()
  })

  it('split toggle button is accessible by role', () => {
    setup()
    expect(screen.getByRole('button', { name: /are you splitting the bill/i })).toBeInTheDocument()
  })
})

describe('App – invalid value handling', () => {
  it('cleared bill normalizes to 0.00 and computed shows 0.00', async () => {
    const { user } = setup()
    const bill = getBillInput()
    await user.clear(bill)
    await user.tab()
    expect(bill).toHaveValue('0.00')
    expect(getComputedValue('Tip amount').textContent).toBe('0.00')
    expect(getComputedValue('Total').textContent).toBe('0.00')
  })

  it('cleared tip normalizes to 0 and tip amount shows 0.00', async () => {
    const { user } = setup()

    const bill = getBillInput()
    await user.clear(bill)
    await user.type(bill, '100')
    await user.tab()

    const tip = getTipInput()
    await user.clear(tip)
    await user.tab()

    expect(tip).toHaveValue(0)
    expect(getComputedValue('Tip amount').textContent).toBe('0.00')
  })
})
