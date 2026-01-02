export type Tool = 'select' | 'rect' | 'ellipse' | 'path' | 'text' | 'pan'

export interface EditorPanel {
  layers: boolean
  properties: boolean
  timeline: boolean
}

export interface Keyframe {
  id: string
  objectId: string
  frame: number
  property: 'position' | 'scale' | 'rotation' | 'opacity'
  value: number | number[]
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
