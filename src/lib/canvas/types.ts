import type { Canvas as FabricCanvas, FabricObject, Rect, Circle, Ellipse, Path, IText, Group } from 'fabric'

export type FabricObjectType = 'rect' | 'ellipse' | 'path' | 'text' | 'group'

export interface CanvasConfig {
  width: number
  height: number
  backgroundColor: string
  selection: boolean
  preserveObjectStacking: boolean
}

export interface SyncedObject {
  id: string
  fabricObject: FabricObject
  type: FabricObjectType
}

export interface CanvasSyncState {
  objects: Map<string, SyncedObject>
  selectedIds: Set<string>
}

export interface FabricEventCallbacks {
  onObjectAdded?: (id: string, object: FabricObject) => void
  onObjectRemoved?: (id: string) => void
  onObjectModified?: (id: string, object: FabricObject) => void
  onSelectionCreated?: (ids: string[]) => void
  onSelectionUpdated?: (ids: string[]) => void
  onSelectionCleared?: () => void
  onCanvasReady?: (canvas: FabricCanvas) => void
}

export type { FabricCanvas, FabricObject, Rect, Circle, Ellipse, Path, IText, Group }
