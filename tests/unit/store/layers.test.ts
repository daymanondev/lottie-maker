import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorStore } from '@/store'

describe('Layers Slice', () => {
  beforeEach(() => {
    useEditorStore.setState({
      layerOrder: [],
    })
  })

  describe('setLayerOrder', () => {
    it('sets the layer order', () => {
      useEditorStore.getState().setLayerOrder(['layer-1', 'layer-2', 'layer-3'])
      expect(useEditorStore.getState().layerOrder).toEqual(['layer-1', 'layer-2', 'layer-3'])
    })
  })

  describe('moveLayer', () => {
    it('moves a layer to a new index', () => {
      useEditorStore.setState({ layerOrder: ['a', 'b', 'c', 'd'] })
      useEditorStore.getState().moveLayer('c', 0)
      expect(useEditorStore.getState().layerOrder).toEqual(['c', 'a', 'b', 'd'])
    })

    it('does nothing if layer not found', () => {
      useEditorStore.setState({ layerOrder: ['a', 'b', 'c'] })
      useEditorStore.getState().moveLayer('x', 0)
      expect(useEditorStore.getState().layerOrder).toEqual(['a', 'b', 'c'])
    })
  })

  describe('moveLayerUp', () => {
    it('moves layer up (earlier in order)', () => {
      useEditorStore.setState({ layerOrder: ['a', 'b', 'c'] })
      useEditorStore.getState().moveLayerUp('b')
      expect(useEditorStore.getState().layerOrder).toEqual(['b', 'a', 'c'])
    })

    it('does nothing if already at top', () => {
      useEditorStore.setState({ layerOrder: ['a', 'b', 'c'] })
      useEditorStore.getState().moveLayerUp('a')
      expect(useEditorStore.getState().layerOrder).toEqual(['a', 'b', 'c'])
    })
  })

  describe('moveLayerDown', () => {
    it('moves layer down (later in order)', () => {
      useEditorStore.setState({ layerOrder: ['a', 'b', 'c'] })
      useEditorStore.getState().moveLayerDown('b')
      expect(useEditorStore.getState().layerOrder).toEqual(['a', 'c', 'b'])
    })

    it('does nothing if already at bottom', () => {
      useEditorStore.setState({ layerOrder: ['a', 'b', 'c'] })
      useEditorStore.getState().moveLayerDown('c')
      expect(useEditorStore.getState().layerOrder).toEqual(['a', 'b', 'c'])
    })
  })

  describe('bringToFront', () => {
    it('moves layer to front (first position)', () => {
      useEditorStore.setState({ layerOrder: ['a', 'b', 'c'] })
      useEditorStore.getState().bringToFront('c')
      expect(useEditorStore.getState().layerOrder).toEqual(['c', 'a', 'b'])
    })
  })

  describe('sendToBack', () => {
    it('moves layer to back (last position)', () => {
      useEditorStore.setState({ layerOrder: ['a', 'b', 'c'] })
      useEditorStore.getState().sendToBack('a')
      expect(useEditorStore.getState().layerOrder).toEqual(['b', 'c', 'a'])
    })
  })
})
