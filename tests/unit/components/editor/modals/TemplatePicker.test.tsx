import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TemplatePicker } from '@/components/editor/modals/TemplatePicker'
import { templates, templateCategories } from '@/lib/templates'

const mockAddObject = vi.fn()
const mockAddKeyframe = vi.fn()
const mockSetDuration = vi.fn()
const mockSetFrameRate = vi.fn()
const mockClearObjects = vi.fn()
const mockClearKeyframes = vi.fn()

vi.mock('@/store', () => ({
  useEditorStore: vi.fn(() => ({
    addObject: mockAddObject,
    addKeyframe: mockAddKeyframe,
    setDuration: mockSetDuration,
    setFrameRate: mockSetFrameRate,
    clearObjects: mockClearObjects,
    clearKeyframes: mockClearKeyframes,
  })),
}))

vi.mock('@/lib/canvas', () => ({
  registerObject: vi.fn(),
  generateObjectId: vi.fn(() => 'mock-id'),
}))

vi.mock('fabric', () => ({
  Rect: class MockRect {
    constructor(opts: Record<string, unknown>) {
      Object.assign(this, { ...opts, type: 'rect' })
    }
  },
  Ellipse: class MockEllipse {
    constructor(opts: Record<string, unknown>) {
      Object.assign(this, { ...opts, type: 'ellipse' })
    }
  },
  FabricText: class MockFabricText {
    constructor(text: string, opts: Record<string, unknown>) {
      Object.assign(this, { ...opts, text, type: 'text' })
    }
  },
}))

describe('TemplatePicker', () => {
  const mockOnOpenChange = vi.fn()
  const mockCanvas = {
    clear: vi.fn(),
    set: vi.fn(),
    add: vi.fn(),
    requestRenderAll: vi.fn(),
  } as unknown as Parameters<typeof TemplatePicker>[0]['canvas']

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dialog with title', () => {
    render(<TemplatePicker open={true} onOpenChange={mockOnOpenChange} canvas={mockCanvas} />)

    expect(screen.getByText('Start from Template')).toBeTruthy()
    expect(screen.getByText('Choose a template to quickly get started with your animation')).toBeTruthy()
  })

  it('shows "All Templates" button and all 5 category buttons', () => {
    render(<TemplatePicker open={true} onOpenChange={mockOnOpenChange} canvas={mockCanvas} />)

    expect(screen.getByText('All Templates')).toBeTruthy()

    templateCategories.forEach((cat) => {
      expect(screen.getByText(cat.name)).toBeTruthy()
    })
  })

  it('displays all 5 template cards', () => {
    render(<TemplatePicker open={true} onOpenChange={mockOnOpenChange} canvas={mockCanvas} />)

    templates.forEach((template) => {
      expect(screen.getByText(template.name)).toBeTruthy()
    })
  })

  it('shows template details (name, description, duration, layer count)', () => {
    render(<TemplatePicker open={true} onOpenChange={mockOnOpenChange} canvas={mockCanvas} />)

    const loadingSpinner = templates.find((t) => t.id === 'loading-spinner')!
    expect(screen.getByText(loadingSpinner.name)).toBeTruthy()
    expect(screen.getByText(loadingSpinner.description)).toBeTruthy()
    expect(screen.getAllByText('2s').length).toBeGreaterThan(0)
    expect(screen.getAllByText('1 layer').length).toBeGreaterThan(0)
  })

  it('Cancel button calls onOpenChange(false)', () => {
    render(<TemplatePicker open={true} onOpenChange={mockOnOpenChange} canvas={mockCanvas} />)

    fireEvent.click(screen.getByText('Cancel'))

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('Use Template button is disabled when no template selected', () => {
    render(<TemplatePicker open={true} onOpenChange={mockOnOpenChange} canvas={mockCanvas} />)

    const useButton = screen.getByText('Use Template')
    expect(useButton).toHaveProperty('disabled', true)
  })

  it('clicking a template selects it (visual feedback)', () => {
    render(<TemplatePicker open={true} onOpenChange={mockOnOpenChange} canvas={mockCanvas} />)

    const templateCard = screen.getByText('Loading Spinner').closest('button')!
    fireEvent.click(templateCard)

    expect(templateCard.className).toContain('border-[#3b82f6]')
  })

  it('filters templates when category is selected', () => {
    render(<TemplatePicker open={true} onOpenChange={mockOnOpenChange} canvas={mockCanvas} />)

    fireEvent.click(screen.getByText('Loading'))

    expect(screen.getByText('Loading Spinner')).toBeTruthy()
    expect(screen.queryByText('Pulse Dot')).toBeNull()
    expect(screen.queryByText('Fade In Up')).toBeNull()
  })

  it('Use Template button applies template when selected', () => {
    render(<TemplatePicker open={true} onOpenChange={mockOnOpenChange} canvas={mockCanvas} />)

    const templateCard = screen.getByText('Loading Spinner').closest('button')!
    fireEvent.click(templateCard)

    const useButton = screen.getByText('Use Template')
    expect(useButton).not.toHaveProperty('disabled', true)

    fireEvent.click(useButton)

    expect(mockClearObjects).toHaveBeenCalled()
    expect(mockClearKeyframes).toHaveBeenCalled()
    expect(mockSetDuration).toHaveBeenCalledWith(60)
    expect(mockSetFrameRate).toHaveBeenCalledWith(30)
    expect(mockAddObject).toHaveBeenCalled()
    expect(mockAddKeyframe).toHaveBeenCalled()
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })
})
