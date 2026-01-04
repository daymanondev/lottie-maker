import type { Keyframe } from '@/types'

export interface LottieBezierHandles {
  i: { x: number; y: number }
  o: { x: number; y: number }
}

const EASING_PRESETS: Record<string, LottieBezierHandles> = {
  linear: {
    o: { x: 0, y: 0 },
    i: { x: 1, y: 1 },
  },
  'ease-in': {
    o: { x: 0.42, y: 0 },
    i: { x: 1, y: 1 },
  },
  'ease-out': {
    o: { x: 0, y: 0 },
    i: { x: 0.58, y: 1 },
  },
  'ease-in-out': {
    o: { x: 0.42, y: 0 },
    i: { x: 0.58, y: 1 },
  },
}

export function getEasingHandles(easing: Keyframe['easing']): LottieBezierHandles {
  if (easing.type === 'bezier' && easing.bezier) {
    return {
      o: { x: easing.bezier.x1, y: easing.bezier.y1 },
      i: { x: easing.bezier.x2, y: easing.bezier.y2 },
    }
  }

  return EASING_PRESETS[easing.type] ?? EASING_PRESETS.linear
}

export function createDefaultEasing(): Keyframe['easing'] {
  return { type: 'linear' }
}

export function createBezierEasing(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): Keyframe['easing'] {
  return {
    type: 'bezier',
    bezier: { x1, y1, x2, y2 },
  }
}
