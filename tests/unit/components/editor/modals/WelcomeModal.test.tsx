import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WelcomeModal } from '@/components/editor/modals/WelcomeModal'

const mockSetWelcomeModalOpen = vi.fn()
const mockAddObject = vi.fn()

vi.mock('@/store', () => ({
  useEditorStore: vi.fn(() => ({
    isWelcomeModalOpen: true,
    setWelcomeModalOpen: mockSetWelcomeModalOpen,
    addObject: mockAddObject,
  })),
}))

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
  mockSetWelcomeModalOpen.mockClear()
  mockAddObject.mockClear()
})

describe('WelcomeModal', () => {
  const mockOnOpenTemplatePicker = vi.fn()

  beforeEach(() => {
    mockOnOpenTemplatePicker.mockClear()
  })

  it('renders all 4 option buttons with correct titles', () => {
    render(<WelcomeModal canvas={null} onOpenTemplatePicker={mockOnOpenTemplatePicker} />)

    expect(screen.getByText('Import SVG')).toBeTruthy()
    expect(screen.getByText('Start from Template')).toBeTruthy()
    expect(screen.getByText('Open Lottie')).toBeTruthy()
    expect(screen.getByText('Start from Scratch')).toBeTruthy()
  })

  it('shows "Coming Soon" badge on disabled Lottie option', () => {
    render(<WelcomeModal canvas={null} onOpenTemplatePicker={mockOnOpenTemplatePicker} />)

    expect(screen.getByText('Coming Soon')).toBeTruthy()
  })

  it('renders Skip button', () => {
    render(<WelcomeModal canvas={null} onOpenTemplatePicker={mockOnOpenTemplatePicker} />)

    expect(screen.getByText('Skip for now')).toBeTruthy()
  })

  it('calls setWelcomeModalOpen(false) when Skip is clicked', () => {
    render(<WelcomeModal canvas={null} onOpenTemplatePicker={mockOnOpenTemplatePicker} />)

    fireEvent.click(screen.getByText('Skip for now'))

    expect(mockSetWelcomeModalOpen).toHaveBeenCalledWith(false)
  })

  it('calls setWelcomeModalOpen(false) when Scratch option is clicked', () => {
    render(<WelcomeModal canvas={null} onOpenTemplatePicker={mockOnOpenTemplatePicker} />)

    fireEvent.click(screen.getByText('Start from Scratch'))

    expect(mockSetWelcomeModalOpen).toHaveBeenCalledWith(false)
  })

  it('calls onOpenTemplatePicker when Template option is clicked', () => {
    render(<WelcomeModal canvas={null} onOpenTemplatePicker={mockOnOpenTemplatePicker} />)

    fireEvent.click(screen.getByText('Start from Template'))

    expect(mockOnOpenTemplatePicker).toHaveBeenCalled()
    expect(mockSetWelcomeModalOpen).toHaveBeenCalledWith(false)
  })

  it('has hidden file inputs for SVG and Lottie', () => {
    render(<WelcomeModal canvas={null} onOpenTemplatePicker={mockOnOpenTemplatePicker} />)

    const svgInput = document.querySelector('input[accept=".svg,image/svg+xml"]')
    const lottieInput = document.querySelector('input[accept=".json,application/json"]')

    expect(svgInput).toBeTruthy()
    expect(lottieInput).toBeTruthy()
    expect(svgInput).toHaveClass('hidden')
    expect(lottieInput).toHaveClass('hidden')
  })
})
