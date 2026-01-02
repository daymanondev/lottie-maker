import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorStore } from '@/store'

describe('UI Slice', () => {
  beforeEach(() => {
    useEditorStore.setState({
      activeTool: 'select',
      panels: { layers: true, properties: true, timeline: true },
      isWelcomeModalOpen: true,
      isExporting: false,
    })
  })

  describe('setActiveTool', () => {
    it('sets the active tool', () => {
      useEditorStore.getState().setActiveTool('rect')
      expect(useEditorStore.getState().activeTool).toBe('rect')
    })
  })

  describe('togglePanel', () => {
    it('toggles panel visibility', () => {
      expect(useEditorStore.getState().panels.layers).toBe(true)
      useEditorStore.getState().togglePanel('layers')
      expect(useEditorStore.getState().panels.layers).toBe(false)
      useEditorStore.getState().togglePanel('layers')
      expect(useEditorStore.getState().panels.layers).toBe(true)
    })
  })

  describe('setPanelOpen', () => {
    it('sets panel to open', () => {
      useEditorStore.setState({ panels: { layers: false, properties: true, timeline: true } })
      useEditorStore.getState().setPanelOpen('layers', true)
      expect(useEditorStore.getState().panels.layers).toBe(true)
    })

    it('sets panel to closed', () => {
      useEditorStore.getState().setPanelOpen('properties', false)
      expect(useEditorStore.getState().panels.properties).toBe(false)
    })
  })

  describe('setWelcomeModalOpen', () => {
    it('sets welcome modal state', () => {
      useEditorStore.getState().setWelcomeModalOpen(false)
      expect(useEditorStore.getState().isWelcomeModalOpen).toBe(false)
    })
  })

  describe('setExporting', () => {
    it('sets exporting state', () => {
      useEditorStore.getState().setExporting(true)
      expect(useEditorStore.getState().isExporting).toBe(true)
    })
  })

  describe('resetUI', () => {
    it('resets UI to default state', () => {
      useEditorStore.setState({
        activeTool: 'ellipse',
        panels: { layers: false, properties: false, timeline: false },
        isWelcomeModalOpen: true,
        isExporting: true,
      })

      useEditorStore.getState().resetUI()

      const state = useEditorStore.getState()
      expect(state.activeTool).toBe('select')
      expect(state.panels).toEqual({ layers: true, properties: true, timeline: true })
      expect(state.isWelcomeModalOpen).toBe(false)
      expect(state.isExporting).toBe(false)
    })
  })
})
