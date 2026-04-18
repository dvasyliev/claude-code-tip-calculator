import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ComputedField } from './computed-field'

describe('ComputedField', () => {
  it('renders label text', () => {
    render(<ComputedField label="Tip amount" value="10.00" />)
    expect(screen.getByText('Tip amount')).toBeInTheDocument()
  })

  it('renders value text', () => {
    render(<ComputedField label="Tip amount" value="10.00" />)
    expect(screen.getByText('10.00')).toBeInTheDocument()
  })

  it('displays value in a non-input element', () => {
    render(<ComputedField label="Tip amount" value="10.00" />)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
  })
})
