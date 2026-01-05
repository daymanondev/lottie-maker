'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Keyboard } from 'lucide-react'

interface ShortcutPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ShortcutGroup {
  title: string
  shortcuts: Array<{
    keys: string[]
    description: string
  }>
}

function useIsMac() {
  const [isMac, setIsMac] = useState(true)

  useEffect(() => {
    const checkPlatform = () => {
      setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
    }
    checkPlatform()
  }, [])

  return isMac
}

export function ShortcutPanel({ open, onOpenChange }: ShortcutPanelProps) {
  const isMac = useIsMac()

  const modKey = isMac ? '⌘' : 'Ctrl'
  const optKey = isMac ? '⌥' : 'Alt'

  const shortcutGroups: ShortcutGroup[] = useMemo(
    () => [
      {
        title: 'General',
        shortcuts: [
          { keys: [modKey, 'Z'], description: 'Undo' },
          { keys: [modKey, 'Shift', 'Z'], description: 'Redo' },
          { keys: [modKey, 'A'], description: 'Select all' },
          { keys: ['Escape'], description: 'Deselect / Cancel' },
          { keys: ['?'], description: 'Show shortcuts' },
        ],
      },
      {
        title: 'Tools',
        shortcuts: [
          { keys: ['V'], description: 'Selection tool' },
          { keys: ['R'], description: 'Rectangle tool' },
          { keys: ['O'], description: 'Ellipse tool' },
          { keys: ['T'], description: 'Text tool' },
        ],
      },
      {
        title: 'Objects',
        shortcuts: [
          { keys: ['Delete'], description: 'Delete selected' },
          { keys: ['Backspace'], description: 'Delete selected' },
          { keys: [modKey, 'D'], description: 'Duplicate' },
          { keys: ['↑', '↓', '←', '→'], description: 'Move by 1px' },
          { keys: ['Shift', '↑', '↓', '←', '→'], description: 'Move by 10px' },
        ],
      },
      {
        title: 'Timeline',
        shortcuts: [
          { keys: ['Space'], description: 'Play / Pause' },
          { keys: ['K'], description: 'Add keyframe' },
          { keys: [modKey, 'C'], description: 'Copy keyframes' },
          { keys: [modKey, 'V'], description: 'Paste keyframes' },
        ],
      },
      {
        title: 'Canvas',
        shortcuts: [
          { keys: [modKey, '+'], description: 'Zoom in' },
          { keys: [modKey, '-'], description: 'Zoom out' },
          { keys: [modKey, '0'], description: 'Fit to screen' },
          { keys: [optKey, 'Scroll'], description: 'Pan canvas' },
        ],
      },
    ],
    [modKey, optKey]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === '?' && !open) {
        e.preventDefault()
        onOpenChange(true)
      }
    },
    [open, onOpenChange]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden bg-[#141414] border-[#262626]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#fafafa]">
            <Keyboard className="h-5 w-5 text-[#3b82f6]" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(85vh-120px)] pr-2 -mr-2">
          <div className="grid gap-6">
            {shortcutGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-medium text-[#a1a1aa] mb-3">{group.title}</h3>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#1a1a1a]"
                    >
                      <span className="text-sm text-[#d4d4d8]">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <span key={keyIndex} className="flex items-center gap-1">
                            <kbd
                              className="
                                min-w-[24px] h-6 px-1.5 flex items-center justify-center
                                text-xs font-medium text-[#a1a1aa]
                                bg-[#262626] border border-[#3f3f46] rounded
                              "
                            >
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-[#52525b] text-xs">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#262626] text-center">
          <p className="text-xs text-[#52525b]">
            Press <kbd className="px-1 py-0.5 bg-[#262626] rounded text-[#a1a1aa]">?</kbd> anytime to
            show this panel
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
