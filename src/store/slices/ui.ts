import type { StateCreator } from 'zustand'
import type { Tool, EditorPanel } from '@/types'
import type { EditorStore } from '../types'

export interface UISlice {
  activeTool: Tool
  panels: EditorPanel
  isWelcomeModalOpen: boolean
  isExporting: boolean

  setActiveTool: (tool: Tool) => void
  togglePanel: (panel: keyof EditorPanel) => void
  setPanelOpen: (panel: keyof EditorPanel, open: boolean) => void
  setWelcomeModalOpen: (open: boolean) => void
  setExporting: (exporting: boolean) => void
  resetUI: () => void
}

const defaultPanels: EditorPanel = {
  layers: true,
  properties: true,
  timeline: true,
}

export const createUISlice: StateCreator<EditorStore, [], [], UISlice> = (set) => ({
  activeTool: 'select',
  panels: { ...defaultPanels },
  isWelcomeModalOpen: true,
  isExporting: false,

  setActiveTool: (tool) => set({ activeTool: tool }),

  togglePanel: (panel) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [panel]: !state.panels[panel],
      },
    })),

  setPanelOpen: (panel, open) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [panel]: open,
      },
    })),

  setWelcomeModalOpen: (open) => set({ isWelcomeModalOpen: open }),

  setExporting: (exporting) => set({ isExporting: exporting }),

  resetUI: () =>
    set({
      activeTool: 'select',
      panels: { ...defaultPanels },
      isWelcomeModalOpen: false,
      isExporting: false,
    }),
})
