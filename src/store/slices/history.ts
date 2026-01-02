import type { StateCreator } from 'zustand'
import type { HistoryEntry } from '@/types'
import type { EditorStore } from '../types'

const MAX_HISTORY_SIZE = 50

export interface HistorySlice {
  past: HistoryEntry[]
  future: HistoryEntry[]

  pushHistory: (action: string, snapshot: unknown) => void
  undo: () => HistoryEntry | undefined
  redo: () => HistoryEntry | undefined
  canUndo: () => boolean
  canRedo: () => boolean
  clearHistory: () => void
}

export const createHistorySlice: StateCreator<EditorStore, [], [], HistorySlice> = (set, get) => ({
  past: [],
  future: [],

  pushHistory: (action, snapshot) =>
    set((state) => {
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        action,
        snapshot,
      }
      const newPast = [...state.past, entry].slice(-MAX_HISTORY_SIZE)
      return {
        past: newPast,
        future: [],
      }
    }),

  undo: () => {
    const { past, future } = get()
    if (past.length === 0) return undefined

    const previous = past[past.length - 1]
    set({
      past: past.slice(0, -1),
      future: [previous, ...future],
    })
    return previous
  },

  redo: () => {
    const { past, future } = get()
    if (future.length === 0) return undefined

    const next = future[0]
    set({
      past: [...past, next],
      future: future.slice(1),
    })
    return next
  },

  canUndo: () => get().past.length > 0,

  canRedo: () => get().future.length > 0,

  clearHistory: () => set({ past: [], future: [] }),
})
