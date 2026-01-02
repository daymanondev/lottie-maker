import type { CanvasSlice } from './slices/canvas'
import type { LayersSlice } from './slices/layers'
import type { TimelineSlice } from './slices/timeline'
import type { HistorySlice } from './slices/history'
import type { UISlice } from './slices/ui'

export type EditorStore = CanvasSlice & LayersSlice & TimelineSlice & HistorySlice & UISlice
