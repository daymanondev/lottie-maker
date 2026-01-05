import type { CanvasObject } from '@/types/canvas'
import type { Keyframe } from '@/types/editor'

export interface TemplateObject extends Omit<CanvasObject, 'id'> {
  localId: string
  fill?: string
  stroke?: string
  strokeWidth?: number
  rx?: number
  ry?: number
  text?: string
  fontSize?: number
  fontFamily?: string
}

export interface TemplateKeyframe extends Omit<Keyframe, 'id' | 'objectId'> {
  localObjectId: string
}

export interface Template {
  id: string
  name: string
  description: string
  category: TemplateCategory
  thumbnail: string
  duration: number
  frameRate: number
  canvasSize: { width: number; height: number }
  objects: TemplateObject[]
  keyframes: TemplateKeyframe[]
}

export type TemplateCategory = 
  | 'loading'
  | 'icons'
  | 'transitions'
  | 'ui-elements'
  | 'illustrations'
