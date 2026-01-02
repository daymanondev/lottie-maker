import type { StateCreator } from 'zustand'
import type { EditorStore } from '../types'

export interface LayersSlice {
  layerOrder: string[]

  setLayerOrder: (order: string[]) => void
  moveLayer: (id: string, newIndex: number) => void
  moveLayerUp: (id: string) => void
  moveLayerDown: (id: string) => void
  bringToFront: (id: string) => void
  sendToBack: (id: string) => void
}

export const createLayersSlice: StateCreator<EditorStore, [], [], LayersSlice> = (set, get) => ({
  layerOrder: [],

  setLayerOrder: (order) => set({ layerOrder: order }),

  moveLayer: (id, newIndex) =>
    set((state) => {
      const order = [...state.layerOrder]
      const currentIndex = order.indexOf(id)
      if (currentIndex === -1) return state

      order.splice(currentIndex, 1)
      order.splice(newIndex, 0, id)
      return { layerOrder: order }
    }),

  moveLayerUp: (id) => {
    const { layerOrder, moveLayer } = get()
    const currentIndex = layerOrder.indexOf(id)
    if (currentIndex > 0) {
      moveLayer(id, currentIndex - 1)
    }
  },

  moveLayerDown: (id) => {
    const { layerOrder, moveLayer } = get()
    const currentIndex = layerOrder.indexOf(id)
    if (currentIndex < layerOrder.length - 1) {
      moveLayer(id, currentIndex + 1)
    }
  },

  bringToFront: (id) =>
    set((state) => {
      const order = state.layerOrder.filter((layerId) => layerId !== id)
      return { layerOrder: [id, ...order] }
    }),

  sendToBack: (id) =>
    set((state) => {
      const order = state.layerOrder.filter((layerId) => layerId !== id)
      return { layerOrder: [...order, id] }
    }),
})
