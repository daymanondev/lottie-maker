import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorStore } from '@/store'
import type { CanvasObject } from '@/types'

const createMockObject = (overrides: Partial<CanvasObject> = {}): CanvasObject => ({
  id: `obj_${Math.random().toString(36).slice(2)}`,
  name: 'Test Object',
  type: 'rect',
  visible: true,
  locked: false,
  left: 100,
  top: 100,
  width: 50,
  height: 50,
  scaleX: 1,
  scaleY: 1,
  angle: 0,
  opacity: 1,
  ...overrides,
})

describe('Canvas Slice', () => {
  beforeEach(() => {
    useEditorStore.setState({
      objects: [],
      selectedIds: [],
      zoom: 1,
      pan: { x: 0, y: 0 },
    })
  })

  describe('addObject', () => {
    it('adds an object to the canvas', () => {
      const obj = createMockObject({ id: 'obj-1' })
      useEditorStore.getState().addObject(obj)

      const { objects } = useEditorStore.getState()
      expect(objects).toHaveLength(1)
      expect(objects[0].id).toBe('obj-1')
    })

    it('adds multiple objects', () => {
      useEditorStore.getState().addObject(createMockObject({ id: 'obj-1' }))
      useEditorStore.getState().addObject(createMockObject({ id: 'obj-2' }))

      const { objects } = useEditorStore.getState()
      expect(objects).toHaveLength(2)
    })
  })

  describe('removeObject', () => {
    it('removes an object by id', () => {
      const obj = createMockObject({ id: 'obj-1' })
      useEditorStore.setState({ objects: [obj] })

      useEditorStore.getState().removeObject('obj-1')

      const { objects } = useEditorStore.getState()
      expect(objects).toHaveLength(0)
    })

    it('removes object from selection when deleted', () => {
      const obj = createMockObject({ id: 'obj-1' })
      useEditorStore.setState({ objects: [obj], selectedIds: ['obj-1'] })

      useEditorStore.getState().removeObject('obj-1')

      const { selectedIds } = useEditorStore.getState()
      expect(selectedIds).not.toContain('obj-1')
    })

    it('does nothing if object not found', () => {
      const obj = createMockObject({ id: 'obj-1' })
      useEditorStore.setState({ objects: [obj] })

      useEditorStore.getState().removeObject('nonexistent')

      const { objects } = useEditorStore.getState()
      expect(objects).toHaveLength(1)
    })
  })

  describe('updateObject', () => {
    it('updates object properties', () => {
      const obj = createMockObject({ id: 'obj-1', left: 100 })
      useEditorStore.setState({ objects: [obj] })

      useEditorStore.getState().updateObject('obj-1', { left: 200, top: 150 })

      const { objects } = useEditorStore.getState()
      expect(objects[0].left).toBe(200)
      expect(objects[0].top).toBe(150)
    })

    it('preserves other properties when updating', () => {
      const obj = createMockObject({ id: 'obj-1', name: 'Original' })
      useEditorStore.setState({ objects: [obj] })

      useEditorStore.getState().updateObject('obj-1', { left: 200 })

      const { objects } = useEditorStore.getState()
      expect(objects[0].name).toBe('Original')
    })
  })

  describe('setObjects', () => {
    it('replaces all objects', () => {
      useEditorStore.setState({ objects: [createMockObject({ id: 'old' })] })

      const newObjects = [
        createMockObject({ id: 'new-1' }),
        createMockObject({ id: 'new-2' }),
      ]
      useEditorStore.getState().setObjects(newObjects)

      const { objects } = useEditorStore.getState()
      expect(objects).toHaveLength(2)
      expect(objects[0].id).toBe('new-1')
    })
  })

  describe('clearObjects', () => {
    it('removes all objects and clears selection', () => {
      useEditorStore.setState({
        objects: [createMockObject({ id: 'obj-1' })],
        selectedIds: ['obj-1'],
      })

      useEditorStore.getState().clearObjects()

      const { objects, selectedIds } = useEditorStore.getState()
      expect(objects).toHaveLength(0)
      expect(selectedIds).toHaveLength(0)
    })
  })

  describe('selection', () => {
    it('selectObject selects a single object', () => {
      useEditorStore.getState().selectObject('obj-1')
      expect(useEditorStore.getState().selectedIds).toEqual(['obj-1'])
    })

    it('selectObjects selects multiple objects', () => {
      useEditorStore.getState().selectObjects(['obj-1', 'obj-2'])
      expect(useEditorStore.getState().selectedIds).toEqual(['obj-1', 'obj-2'])
    })

    it('addToSelection adds to existing selection', () => {
      useEditorStore.setState({ selectedIds: ['obj-1'] })
      useEditorStore.getState().addToSelection('obj-2')
      expect(useEditorStore.getState().selectedIds).toEqual(['obj-1', 'obj-2'])
    })

    it('addToSelection does not duplicate', () => {
      useEditorStore.setState({ selectedIds: ['obj-1'] })
      useEditorStore.getState().addToSelection('obj-1')
      expect(useEditorStore.getState().selectedIds).toEqual(['obj-1'])
    })

    it('removeFromSelection removes object from selection', () => {
      useEditorStore.setState({ selectedIds: ['obj-1', 'obj-2'] })
      useEditorStore.getState().removeFromSelection('obj-1')
      expect(useEditorStore.getState().selectedIds).toEqual(['obj-2'])
    })

    it('clearSelection clears all selections', () => {
      useEditorStore.setState({ selectedIds: ['obj-1', 'obj-2'] })
      useEditorStore.getState().clearSelection()
      expect(useEditorStore.getState().selectedIds).toHaveLength(0)
    })
  })

  describe('zoom', () => {
    it('setZoom updates zoom level', () => {
      useEditorStore.getState().setZoom(2)
      expect(useEditorStore.getState().zoom).toBe(2)
    })

    it('clamps zoom to minimum 0.1', () => {
      useEditorStore.getState().setZoom(0.01)
      expect(useEditorStore.getState().zoom).toBe(0.1)
    })

    it('clamps zoom to maximum 5', () => {
      useEditorStore.getState().setZoom(10)
      expect(useEditorStore.getState().zoom).toBe(5)
    })
  })

  describe('pan', () => {
    it('setPan updates pan position', () => {
      useEditorStore.getState().setPan({ x: 100, y: 50 })
      expect(useEditorStore.getState().pan).toEqual({ x: 100, y: 50 })
    })

    it('resetView resets zoom and pan', () => {
      useEditorStore.setState({ zoom: 2.5, pan: { x: 100, y: 50 } })
      useEditorStore.getState().resetView()

      const { zoom, pan } = useEditorStore.getState()
      expect(zoom).toBe(1)
      expect(pan).toEqual({ x: 0, y: 0 })
    })
  })
})
