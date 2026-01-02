import { Canvas as FabricCanvas, FabricObject, Rect, Circle, Ellipse, Path, IText, Group } from 'fabric'
import type { CanvasConfig, FabricEventCallbacks, FabricObjectType, SyncedObject } from './types'

const DEFAULT_CANVAS_CONFIG: CanvasConfig = {
  width: 800,
  height: 600,
  backgroundColor: '#ffffff',
  selection: true,
  preserveObjectStacking: true,
}

const objectRegistry = new Map<string, SyncedObject>()
const idToFabricMap = new WeakMap<FabricObject, string>()

export function initializeFabricCanvas(
  canvasElement: HTMLCanvasElement,
  config: Partial<CanvasConfig> = {},
  callbacks: FabricEventCallbacks = {}
): FabricCanvas {
  const canvas = new FabricCanvas(canvasElement, {
    ...DEFAULT_CANVAS_CONFIG,
    ...config,
  })

  setupCanvasEventHandlers(canvas, callbacks)

  callbacks.onCanvasReady?.(canvas)

  return canvas
}

export function setupCanvasEventHandlers(
  canvas: FabricCanvas,
  callbacks: FabricEventCallbacks
): void {
  canvas.on('object:added', (e) => {
    if (!e.target) return
    const id = getObjectId(e.target)
    if (id) {
      callbacks.onObjectAdded?.(id, e.target)
    }
  })

  canvas.on('object:removed', (e) => {
    if (!e.target) return
    const id = getObjectId(e.target)
    if (id) {
      callbacks.onObjectRemoved?.(id)
    }
  })

  canvas.on('object:modified', (e) => {
    if (!e.target) return
    const id = getObjectId(e.target)
    if (id) {
      callbacks.onObjectModified?.(id, e.target)
    }
  })

  canvas.on('selection:created', (e) => {
    const ids = getSelectedObjectIds(e.selected)
    callbacks.onSelectionCreated?.(ids)
  })

  canvas.on('selection:updated', (e) => {
    const ids = getSelectedObjectIds(e.selected)
    callbacks.onSelectionUpdated?.(ids)
  })

  canvas.on('selection:cleared', () => {
    callbacks.onSelectionCleared?.()
  })
}

export function generateObjectId(): string {
  return `obj_${crypto.randomUUID()}`
}

export function getObjectId(obj: FabricObject): string | undefined {
  return idToFabricMap.get(obj)
}

export function setObjectId(obj: FabricObject, id: string): void {
  idToFabricMap.set(obj, id)
}

function getSelectedObjectIds(selected: FabricObject[] | undefined): string[] {
  if (!selected) return []
  return selected
    .map((obj) => getObjectId(obj))
    .filter((id): id is string => id !== undefined)
}

export function registerObject(
  obj: FabricObject,
  id: string,
  type: FabricObjectType
): SyncedObject {
  setObjectId(obj, id)
  const synced: SyncedObject = { id, fabricObject: obj, type }
  objectRegistry.set(id, synced)
  return synced
}

export function unregisterObject(id: string): void {
  const synced = objectRegistry.get(id)
  if (synced) {
    objectRegistry.delete(id)
  }
}

export function getRegisteredObject(id: string): SyncedObject | undefined {
  return objectRegistry.get(id)
}

export function getAllRegisteredObjects(): SyncedObject[] {
  return Array.from(objectRegistry.values())
}

export function clearRegistry(): void {
  objectRegistry.clear()
}

export function detectObjectType(obj: FabricObject): FabricObjectType {
  if (obj instanceof Rect) return 'rect'
  if (obj instanceof Circle || obj instanceof Ellipse) return 'ellipse'
  if (obj instanceof Path) return 'path'
  if (obj instanceof IText) return 'text'
  if (obj instanceof Group) return 'group'
  return 'rect'
}

export function disposeCanvas(canvas: FabricCanvas): void {
  clearRegistry()
  canvas.dispose()
}

export function syncObjectToStore(obj: FabricObject): {
  id: string
  left: number
  top: number
  width: number
  height: number
  scaleX: number
  scaleY: number
  angle: number
  opacity: number
} {
  const id = getObjectId(obj) || ''
  return {
    id,
    left: obj.left ?? 0,
    top: obj.top ?? 0,
    width: obj.width ?? 0,
    height: obj.height ?? 0,
    scaleX: obj.scaleX ?? 1,
    scaleY: obj.scaleY ?? 1,
    angle: obj.angle ?? 0,
    opacity: obj.opacity ?? 1,
  }
}

export function applyStoreToObject(
  obj: FabricObject,
  props: Partial<{
    left: number
    top: number
    scaleX: number
    scaleY: number
    angle: number
    opacity: number
  }>
): void {
  obj.set(props)
  obj.setCoords()
}

export function batchUpdate(
  canvas: FabricCanvas,
  updates: Array<{ obj: FabricObject; props: Record<string, unknown> }>
): void {
  updates.forEach(({ obj, props }) => {
    obj.set(props)
    obj.setCoords()
  })
  canvas.requestRenderAll()
}
