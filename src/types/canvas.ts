export interface CanvasObject {
  id: string
  name: string
  type: 'rect' | 'ellipse' | 'path' | 'text' | 'group'
  visible: boolean
  locked: boolean
  left?: number
  top?: number
  width?: number
  height?: number
  scaleX?: number
  scaleY?: number
  angle?: number
  opacity?: number
}

export interface CanvasState {
  objects: CanvasObject[]
  selectedIds: string[]
  zoom: number
  pan: { x: number; y: number }
}
