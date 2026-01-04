import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EasingEditor } from '@/components/editor/EasingEditor'
import type { Keyframe } from '@/types'

const mockGetContext = vi.fn(() => ({
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  bezierCurveTo: vi.fn(),
  arc: vi.fn(),
  rect: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  setLineDash: vi.fn(),
}))

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = mockGetContext as unknown as typeof HTMLCanvasElement.prototype.getContext
})

describe('EasingEditor', () => {
  const defaultEasing: Keyframe['easing'] = { type: 'linear' }
  const mockOnChange = vi.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders canvas element', () => {
    render(<EasingEditor easing={defaultEasing} onChange={mockOnChange} />)

    const canvas = document.querySelector('canvas')
    expect(canvas).toBeTruthy()
  })

  it('renders preset buttons', () => {
    render(<EasingEditor easing={defaultEasing} onChange={mockOnChange} />)

    expect(screen.getByText('Linear')).toBeTruthy()
    expect(screen.getByText('Ease In')).toBeTruthy()
    expect(screen.getByText('Ease Out')).toBeTruthy()
    expect(screen.getByText('Ease In-Out')).toBeTruthy()
  })

  it('displays current easing type', () => {
    render(<EasingEditor easing={defaultEasing} onChange={mockOnChange} />)

    expect(screen.getByText('linear')).toBeTruthy()
  })

  it('displays bezier values when easing is bezier', () => {
    const bezierEasing: Keyframe['easing'] = {
      type: 'bezier',
      bezier: { x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 },
    }
    render(<EasingEditor easing={bezierEasing} onChange={mockOnChange} />)

    expect(screen.getByText(/cubic-bezier/)).toBeTruthy()
    expect(screen.getByText(/0.25/)).toBeTruthy()
  })

  it('calls onChange when preset button is clicked', () => {
    render(<EasingEditor easing={defaultEasing} onChange={mockOnChange} />)

    fireEvent.click(screen.getByText('Ease In'))

    expect(mockOnChange).toHaveBeenCalledWith({ type: 'ease-in' })
  })

  it('applies correct size to canvas', () => {
    render(<EasingEditor easing={defaultEasing} onChange={mockOnChange} size={300} />)

    const canvas = document.querySelector('canvas')
    expect(canvas?.width).toBe(300)
    expect(canvas?.height).toBe(300)
  })

  it('applies custom className', () => {
    const { container } = render(
      <EasingEditor easing={defaultEasing} onChange={mockOnChange} className="custom-class" />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('highlights active preset button', () => {
    render(<EasingEditor easing={{ type: 'ease-in' }} onChange={mockOnChange} />)

    const easeInButton = screen.getByText('Ease In')
    expect(easeInButton.className).toContain('bg-primary')
  })

  it('does not highlight preset when using custom bezier', () => {
    const bezierEasing: Keyframe['easing'] = {
      type: 'bezier',
      bezier: { x1: 0.5, y1: 0.5, x2: 0.5, y2: 0.5 },
    }
    render(<EasingEditor easing={bezierEasing} onChange={mockOnChange} />)

    const linearButton = screen.getByText('Linear')
    expect(linearButton.className).not.toContain('bg-primary')
  })

  it('initializes control points from bezier easing', () => {
    const bezierEasing: Keyframe['easing'] = {
      type: 'bezier',
      bezier: { x1: 0.1, y1: 0.2, x2: 0.8, y2: 0.9 },
    }
    render(<EasingEditor easing={bezierEasing} onChange={mockOnChange} />)

    expect(screen.getByText(/0.10/)).toBeTruthy()
  })
})
