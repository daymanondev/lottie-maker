import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  createCanvasSlice,
  createLayersSlice,
  createTimelineSlice,
  createHistorySlice,
  createUISlice,
} from './slices'
import type { EditorStore } from './types'

export const useEditorStore = create<EditorStore>()(
  devtools(
    (...a) => ({
      ...createCanvasSlice(...a),
      ...createLayersSlice(...a),
      ...createTimelineSlice(...a),
      ...createHistorySlice(...a),
      ...createUISlice(...a),
    }),
    { name: 'lottie-editor' }
  )
)

export type { EditorStore } from './types'
export * from './slices'
