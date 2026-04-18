import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SplitSection } from './split-section'

describe('SplitSection', () => {
  it('renders toggle button text', () => {
    render(<SplitSection label="Are you splitting the bill?" open={false} onToggle={vi.fn()}><span>child</span></SplitSection>)
    expect(screen.getByText('Are you splitting the bill?')).toBeInTheDocument()
  })

  it('shows ∨ chevron when closed', () => {
    render(<SplitSection label="Are you splitting the bill?" open={false} onToggle={vi.fn()}><span>child</span></SplitSection>)
    expect(screen.getByText('∨')).toBeInTheDocument()
  })

  it('hides children when closed', () => {
    render(<SplitSection label="Are you splitting the bill?" open={false} onToggle={vi.fn()}><span>secret child</span></SplitSection>)
    expect(screen.queryByText('secret child')).not.toBeInTheDocument()
  })

  it('shows ∧ chevron when open', () => {
    render(<SplitSection label="Are you splitting the bill?" open={true} onToggle={vi.fn()}><span>child</span></SplitSection>)
    expect(screen.getByText('∧')).toBeInTheDocument()
  })

  it('renders children when open', () => {
    render(<SplitSection label="Are you splitting the bill?" open={true} onToggle={vi.fn()}><span>visible child</span></SplitSection>)
    expect(screen.getByText('visible child')).toBeInTheDocument()
  })

  it('calls onToggle when button is clicked', async () => {
    const onToggle = vi.fn()
    render(<SplitSection label="Are you splitting the bill?" open={false} onToggle={onToggle}><span>child</span></SplitSection>)
    await userEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
