import type { Keyframe } from '@/types'
import { createBezierEasing, createDefaultEasing } from './easing'

export type PresetName =
  | 'fade-in'
  | 'fade-out'
  | 'scale-up'
  | 'scale-down'
  | 'rotate-cw'
  | 'rotate-ccw'
  | 'bounce-in'
  | 'bounce-out'
  | 'slide-in-left'
  | 'slide-in-right'

export interface PresetOptions {
  startFrame?: number
  duration?: number
  objectId: string
}

export interface PresetDefinition {
  name: PresetName
  label: string
  description: string
  category: 'fade' | 'scale' | 'rotate' | 'bounce' | 'slide'
  generate: (options: PresetOptions) => Omit<Keyframe, 'id'>[]
}

function generateId(): string {
  return `kf-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const BOUNCE_EASING = createBezierEasing(0.68, -0.55, 0.27, 1.55)
const EASE_OUT = createBezierEasing(0, 0, 0.58, 1)
const EASE_IN = createBezierEasing(0.42, 0, 1, 1)
const EASE_IN_OUT = createBezierEasing(0.42, 0, 0.58, 1)

export const ANIMATION_PRESETS: Record<PresetName, PresetDefinition> = {
  'fade-in': {
    name: 'fade-in',
    label: 'Fade In',
    description: 'Fade from transparent to opaque',
    category: 'fade',
    generate: ({ objectId, startFrame = 0, duration = 30 }) => [
      {
        objectId,
        frame: startFrame,
        property: 'opacity',
        value: 0,
        easing: EASE_OUT,
      },
      {
        objectId,
        frame: startFrame + duration,
        property: 'opacity',
        value: 100,
        easing: createDefaultEasing(),
      },
    ],
  },

  'fade-out': {
    name: 'fade-out',
    label: 'Fade Out',
    description: 'Fade from opaque to transparent',
    category: 'fade',
    generate: ({ objectId, startFrame = 0, duration = 30 }) => [
      {
        objectId,
        frame: startFrame,
        property: 'opacity',
        value: 100,
        easing: EASE_IN,
      },
      {
        objectId,
        frame: startFrame + duration,
        property: 'opacity',
        value: 0,
        easing: createDefaultEasing(),
      },
    ],
  },

  'scale-up': {
    name: 'scale-up',
    label: 'Scale Up',
    description: 'Scale from small to full size',
    category: 'scale',
    generate: ({ objectId, startFrame = 0, duration = 30 }) => [
      {
        objectId,
        frame: startFrame,
        property: 'scale',
        value: [0, 0],
        easing: EASE_OUT,
      },
      {
        objectId,
        frame: startFrame + duration,
        property: 'scale',
        value: [100, 100],
        easing: createDefaultEasing(),
      },
    ],
  },

  'scale-down': {
    name: 'scale-down',
    label: 'Scale Down',
    description: 'Scale from full size to small',
    category: 'scale',
    generate: ({ objectId, startFrame = 0, duration = 30 }) => [
      {
        objectId,
        frame: startFrame,
        property: 'scale',
        value: [100, 100],
        easing: EASE_IN,
      },
      {
        objectId,
        frame: startFrame + duration,
        property: 'scale',
        value: [0, 0],
        easing: createDefaultEasing(),
      },
    ],
  },

  'rotate-cw': {
    name: 'rotate-cw',
    label: 'Rotate Clockwise',
    description: 'Rotate 360° clockwise',
    category: 'rotate',
    generate: ({ objectId, startFrame = 0, duration = 30 }) => [
      {
        objectId,
        frame: startFrame,
        property: 'rotation',
        value: 0,
        easing: EASE_IN_OUT,
      },
      {
        objectId,
        frame: startFrame + duration,
        property: 'rotation',
        value: 360,
        easing: createDefaultEasing(),
      },
    ],
  },

  'rotate-ccw': {
    name: 'rotate-ccw',
    label: 'Rotate Counter-Clockwise',
    description: 'Rotate 360° counter-clockwise',
    category: 'rotate',
    generate: ({ objectId, startFrame = 0, duration = 30 }) => [
      {
        objectId,
        frame: startFrame,
        property: 'rotation',
        value: 0,
        easing: EASE_IN_OUT,
      },
      {
        objectId,
        frame: startFrame + duration,
        property: 'rotation',
        value: -360,
        easing: createDefaultEasing(),
      },
    ],
  },

  'bounce-in': {
    name: 'bounce-in',
    label: 'Bounce In',
    description: 'Scale up with elastic bounce',
    category: 'bounce',
    generate: ({ objectId, startFrame = 0, duration = 30 }) => [
      {
        objectId,
        frame: startFrame,
        property: 'scale',
        value: [0, 0],
        easing: BOUNCE_EASING,
      },
      {
        objectId,
        frame: startFrame + duration,
        property: 'scale',
        value: [100, 100],
        easing: createDefaultEasing(),
      },
    ],
  },

  'bounce-out': {
    name: 'bounce-out',
    label: 'Bounce Out',
    description: 'Scale down with elastic bounce',
    category: 'bounce',
    generate: ({ objectId, startFrame = 0, duration = 30 }) => [
      {
        objectId,
        frame: startFrame,
        property: 'scale',
        value: [100, 100],
        easing: BOUNCE_EASING,
      },
      {
        objectId,
        frame: startFrame + duration,
        property: 'scale',
        value: [0, 0],
        easing: createDefaultEasing(),
      },
    ],
  },

  'slide-in-left': {
    name: 'slide-in-left',
    label: 'Slide In Left',
    description: 'Slide in from left edge',
    category: 'slide',
    generate: ({ objectId, startFrame = 0, duration = 30 }) => [
      {
        objectId,
        frame: startFrame,
        property: 'position',
        value: [-200, 256],
        easing: EASE_OUT,
      },
      {
        objectId,
        frame: startFrame + duration,
        property: 'position',
        value: [256, 256],
        easing: createDefaultEasing(),
      },
    ],
  },

  'slide-in-right': {
    name: 'slide-in-right',
    label: 'Slide In Right',
    description: 'Slide in from right edge',
    category: 'slide',
    generate: ({ objectId, startFrame = 0, duration = 30 }) => [
      {
        objectId,
        frame: startFrame,
        property: 'position',
        value: [712, 256],
        easing: EASE_OUT,
      },
      {
        objectId,
        frame: startFrame + duration,
        property: 'position',
        value: [256, 256],
        easing: createDefaultEasing(),
      },
    ],
  },
}

export function getPresetNames(): PresetName[] {
  return Object.keys(ANIMATION_PRESETS) as PresetName[]
}

export function getPresetsByCategory(category: PresetDefinition['category']): PresetDefinition[] {
  return Object.values(ANIMATION_PRESETS).filter((preset) => preset.category === category)
}

export function getPreset(name: PresetName): PresetDefinition | undefined {
  return ANIMATION_PRESETS[name]
}

export function applyPreset(name: PresetName, options: PresetOptions): Keyframe[] {
  const preset = ANIMATION_PRESETS[name]
  if (!preset) {
    throw new Error(`Unknown preset: ${name}`)
  }

  const keyframeData = preset.generate(options)
  return keyframeData.map((kf) => ({
    ...kf,
    id: generateId(),
  }))
}

export function getAllCategories(): PresetDefinition['category'][] {
  return ['fade', 'scale', 'rotate', 'bounce', 'slide']
}
