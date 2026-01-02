import type { StateCreator } from 'zustand'
import type { CanvasObject } from '@/types'
import type { EditorStore } from '../types'

export interface CanvasSlice {
  objects: CanvasObject[]
  selectedIds: string[]
  zoom: number
  pan: { x: number; y: number }

  addObject: (object: CanvasObject) => void
  removeObject: (id: string) => void
  updateObject: (id: string, updates: Partial<CanvasObject>) => void
  setObjects: (objects: CanvasObject[]) => void
  clearObjects: () => void

  selectObject: (id: string) => void
  selectObjects: (ids: string[]) => void
  addToSelection: (id: string) => void
  removeFromSelection: (id: string) => void
  clearSelection: () => void

  setZoom: (zoom: number) => void
  setPan: (pan: { x: number; y: number }) => void
  resetView: () => void
}

export const createCanvasSlice: StateCreator<EditorStore, [], [], CanvasSlice> = (set) => ({
  objects: [],
  selectedIds: [],
  zoom: 1,
  pan: { x: 0, y: 0 },

  addObject: (object) =>
    set((state) => ({
      objects: [...state.objects, object],
    })),

  removeObject: (id) =>
    set((state) => ({
      objects: state.objects.filter((obj) => obj.id !== id),
      selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id),
    })),

  updateObject: (id, updates) =>
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, ...updates } : obj
      ),
    })),

  setObjects: (objects) => set({ objects }),

  clearObjects: () => set({ objects: [], selectedIds: [] }),

  selectObject: (id) => set({ selectedIds: [id] }),

  selectObjects: (ids) => set({ selectedIds: ids }),

  addToSelection: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds
        : [...state.selectedIds, id],
    })),

  removeFromSelection: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id),
    })),

  clearSelection: () => set({ selectedIds: [] }),

  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),

  setPan: (pan) => set({ pan }),

  resetView: () => set({ zoom: 1, pan: { x: 0, y: 0 } }),
})
