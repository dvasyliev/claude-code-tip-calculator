import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Field } from './field'

describe('Field', () => {
  it('renders label text', () => {
    render(<Field label="Bill"><span>child</span></Field>)
    expect(screen.getByText('Bill')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<Field label="Bill"><span>child content</span></Field>)
    expect(screen.getByText('child content')).toBeInTheDocument()
  })

  it('applies rowClassName when provided', () => {
    render(<Field label="Bill" rowClassName="my-class"><span>child</span></Field>)
    const row = screen.getByText('child').parentElement!
    expect(row.className).toContain('my-class')
  })

  it('does not apply extra class when rowClassName omitted', () => {
    render(<Field label="Bill"><span>child</span></Field>)
    const row = screen.getByText('child').parentElement!
    expect(row.className).not.toContain('my-class')
  })
})
