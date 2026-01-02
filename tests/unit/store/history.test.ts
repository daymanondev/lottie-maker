import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorStore } from '@/store'

describe('History Slice', () => {
  beforeEach(() => {
    useEditorStore.setState({
      past: [],
      future: [],
    })
  })

  describe('pushHistory', () => {
    it('adds an entry to past', () => {
      useEditorStore.getState().pushHistory('Add rect', { objects: [] })

      const { past } = useEditorStore.getState()
      expect(past).toHaveLength(1)
      expect(past[0].action).toBe('Add rect')
    })

    it('clears future when pushing new history', () => {
      useEditorStore.setState({
        future: [{ id: 'f1', timestamp: Date.now(), action: 'Future', snapshot: {} }],
      })

      useEditorStore.getState().pushHistory('New action', {})

      expect(useEditorStore.getState().future).toHaveLength(0)
    })

    it('limits history to 50 entries', () => {
      for (let i = 0; i < 60; i++) {
        useEditorStore.getState().pushHistory(`Action ${i}`, { index: i })
      }

      expect(useEditorStore.getState().past).toHaveLength(50)
    })
  })

  describe('undo', () => {
    it('moves last entry from past to future', () => {
      useEditorStore.getState().pushHistory('Action 1', { v: 1 })
      useEditorStore.getState().pushHistory('Action 2', { v: 2 })

      const entry = useEditorStore.getState().undo()

      expect(entry?.action).toBe('Action 2')
      expect(useEditorStore.getState().past).toHaveLength(1)
      expect(useEditorStore.getState().future).toHaveLength(1)
    })

    it('returns undefined if past is empty', () => {
      const entry = useEditorStore.getState().undo()
      expect(entry).toBeUndefined()
    })
  })

  describe('redo', () => {
    it('moves first entry from future to past', () => {
      useEditorStore.getState().pushHistory('Action 1', { v: 1 })
      useEditorStore.getState().undo()

      const entry = useEditorStore.getState().redo()

      expect(entry?.action).toBe('Action 1')
      expect(useEditorStore.getState().past).toHaveLength(1)
      expect(useEditorStore.getState().future).toHaveLength(0)
    })

    it('returns undefined if future is empty', () => {
      const entry = useEditorStore.getState().redo()
      expect(entry).toBeUndefined()
    })
  })

  describe('canUndo / canRedo', () => {
    it('canUndo returns true when past has entries', () => {
      useEditorStore.getState().pushHistory('Action', {})
      expect(useEditorStore.getState().canUndo()).toBe(true)
    })

    it('canUndo returns false when past is empty', () => {
      expect(useEditorStore.getState().canUndo()).toBe(false)
    })

    it('canRedo returns true when future has entries', () => {
      useEditorStore.getState().pushHistory('Action', {})
      useEditorStore.getState().undo()
      expect(useEditorStore.getState().canRedo()).toBe(true)
    })

    it('canRedo returns false when future is empty', () => {
      expect(useEditorStore.getState().canRedo()).toBe(false)
    })
  })

  describe('clearHistory', () => {
    it('clears past and future', () => {
      useEditorStore.getState().pushHistory('Action 1', {})
      useEditorStore.getState().pushHistory('Action 2', {})
      useEditorStore.getState().undo()

      useEditorStore.getState().clearHistory()

      expect(useEditorStore.getState().past).toHaveLength(0)
      expect(useEditorStore.getState().future).toHaveLength(0)
    })
  })
})
