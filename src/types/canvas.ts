export interface CanvasObject {
  id: string
  name: string
  type: 'rect' | 'ellipse' | 'path' | 'text' | 'group'
  visible: boolean
  locked: boolean
}

export interface CanvasState {
  objects: CanvasObject[]
  selectedIds: string[]
  zoom: number
  pan: { x: number; y: number }
}
