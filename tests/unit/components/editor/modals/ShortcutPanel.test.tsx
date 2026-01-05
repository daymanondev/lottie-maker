import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ShortcutPanel } from '@/components/editor/modals/ShortcutPanel'

describe('ShortcutPanel', () => {
  const mockOnOpenChange = vi.fn()

  beforeEach(() => {
    mockOnOpenChange.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders dialog when open=true', () => {
    render(<ShortcutPanel open={true} onOpenChange={mockOnOpenChange} />)

    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(screen.getByText('Keyboard Shortcuts')).toBeTruthy()
  })

  it('does not render dialog content when open=false', () => {
    render(<ShortcutPanel open={false} onOpenChange={mockOnOpenChange} />)

    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('displays all 5 shortcut group titles', () => {
    render(<ShortcutPanel open={true} onOpenChange={mockOnOpenChange} />)

    expect(screen.getByText('General')).toBeTruthy()
    expect(screen.getByText('Tools')).toBeTruthy()
    expect(screen.getByText('Objects')).toBeTruthy()
    expect(screen.getByText('Timeline')).toBeTruthy()
    expect(screen.getByText('Canvas')).toBeTruthy()
  })

  it('renders keyboard shortcuts with kbd elements', () => {
    render(<ShortcutPanel open={true} onOpenChange={mockOnOpenChange} />)

    const kbdElements = document.querySelectorAll('kbd')
    expect(kbdElements.length).toBeGreaterThan(0)

    expect(screen.getByText('Undo')).toBeTruthy()
    expect(screen.getByText('Redo')).toBeTruthy()
    expect(screen.getByText('Selection tool')).toBeTruthy()
    expect(screen.getByText('Play / Pause')).toBeTruthy()
    expect(screen.getByText('Zoom in')).toBeTruthy()
  })

  it('calls onOpenChange when dialog is closed', () => {
    render(<ShortcutPanel open={true} onOpenChange={mockOnOpenChange} />)

    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('displays help text about ? key at bottom', () => {
    render(<ShortcutPanel open={true} onOpenChange={mockOnOpenChange} />)

    expect(screen.getByText(/anytime to/)).toBeTruthy()
    expect(screen.getByText(/show this panel/)).toBeTruthy()
  })

  it('opens panel when ? key is pressed globally', () => {
    render(<ShortcutPanel open={false} onOpenChange={mockOnOpenChange} />)

    fireEvent.keyDown(window, { key: '?' })

    expect(mockOnOpenChange).toHaveBeenCalledWith(true)
  })

  it('does not trigger ? key when already open', () => {
    render(<ShortcutPanel open={true} onOpenChange={mockOnOpenChange} />)

    fireEvent.keyDown(window, { key: '?' })

    expect(mockOnOpenChange).not.toHaveBeenCalledWith(true)
  })

  describe('platform-specific modifier keys', () => {
    it('displays Mac modifier keys on Mac platform', () => {
      vi.spyOn(navigator, 'platform', 'get').mockReturnValue('MacIntel')

      render(<ShortcutPanel open={true} onOpenChange={mockOnOpenChange} />)

      const kbdElements = document.querySelectorAll('kbd')
      const kbdTexts = Array.from(kbdElements).map((el) => el.textContent)

      expect(kbdTexts.some((text) => text === '⌘')).toBe(true)
    })

    it('displays Windows modifier keys on Windows platform', () => {
      vi.spyOn(navigator, 'platform', 'get').mockReturnValue('Win32')

      render(<ShortcutPanel open={true} onOpenChange={mockOnOpenChange} />)

      const kbdElements = document.querySelectorAll('kbd')
      const kbdTexts = Array.from(kbdElements).map((el) => el.textContent)

      expect(kbdTexts.some((text) => text === 'Ctrl')).toBe(true)
    })
  })
})
