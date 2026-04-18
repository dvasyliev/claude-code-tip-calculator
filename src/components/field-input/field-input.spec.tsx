import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FieldInput } from './field-input'

describe('FieldInput', () => {
  it('renders label text', () => {
    render(<FieldInput label="Bill" value="0.00" onChange={vi.fn()} onBlur={vi.fn()} />)
    expect(screen.getByText('Bill')).toBeInTheDocument()
  })

  it('renders an input element', () => {
    render(<FieldInput label="Bill" value="0.00" onChange={vi.fn()} onBlur={vi.fn()} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('input reflects value prop', () => {
    render(<FieldInput label="Bill" value="42.00" onChange={vi.fn()} onBlur={vi.fn()} />)
    expect(screen.getByRole('textbox')).toHaveValue('42.00')
  })

  it('uses text type by default', () => {
    render(<FieldInput label="Bill" value="" onChange={vi.fn()} onBlur={vi.fn()} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
  })

  it('applies inputMode attribute', () => {
    render(<FieldInput label="Bill" value="" inputMode="decimal" onChange={vi.fn()} onBlur={vi.fn()} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('inputmode', 'decimal')
  })

  it('applies min and max attributes', () => {
    render(<FieldInput label="Tip" value="" type="number" min="0" max="100" onChange={vi.fn()} onBlur={vi.fn()} />)
    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '100')
  })

  it('calls onChange when user types', async () => {
    const onChange = vi.fn()
    render(<FieldInput label="Bill" value="" onChange={onChange} onBlur={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox'), '5')
    expect(onChange).toHaveBeenCalled()
  })

  it('calls onBlur when input loses focus', async () => {
    const onBlur = vi.fn()
    render(<FieldInput label="Bill" value="" onChange={vi.fn()} onBlur={onBlur} />)
    await userEvent.click(screen.getByRole('textbox'))
    await userEvent.tab()
    expect(onBlur).toHaveBeenCalled()
  })
})
