export type Tool = 'select' | 'rect' | 'ellipse' | 'path' | 'text' | 'pan'

export interface EditorPanel {
  layers: boolean
  properties: boolean
  timeline: boolean
  preview: boolean
}

export type KeyframeProperty =
  | 'position'
  | 'scale'
  | 'rotation'
  | 'opacity'
  | 'fill'
  | 'stroke'

export type KeyframeValue = number | number[] | string

export interface Keyframe {
  id: string
  objectId: string
  frame: number
  property: KeyframeProperty
  value: KeyframeValue
  easing: {
    type: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bezier'
    bezier?: { x1: number; y1: number; x2: number; y2: number }
  }
}

export interface TimelineState {
  currentFrame: number
  duration: number
  frameRate: number
  isPlaying: boolean
  keyframes: Keyframe[]
}

export interface HistoryEntry {
  id: string
  timestamp: number
  action: string
  snapshot: unknown
}
