import { describe, it, expect } from 'vitest'
import {
  getEasingHandles,
  createDefaultEasing,
  createBezierEasing,
} from '@/lib/animation/easing'
import type { Keyframe } from '@/types'

describe('easing', () => {
  describe('getEasingHandles', () => {
    it('returns linear handles for linear easing', () => {
      const easing: Keyframe['easing'] = { type: 'linear' }
      const handles = getEasingHandles(easing)

      expect(handles).toEqual({
        o: { x: 0, y: 0 },
        i: { x: 1, y: 1 },
      })
    })

    it('returns ease-in handles', () => {
      const easing: Keyframe['easing'] = { type: 'ease-in' }
      const handles = getEasingHandles(easing)

      expect(handles).toEqual({
        o: { x: 0.42, y: 0 },
        i: { x: 1, y: 1 },
      })
    })

    it('returns ease-out handles', () => {
      const easing: Keyframe['easing'] = { type: 'ease-out' }
      const handles = getEasingHandles(easing)

      expect(handles).toEqual({
        o: { x: 0, y: 0 },
        i: { x: 0.58, y: 1 },
      })
    })

    it('returns ease-in-out handles', () => {
      const easing: Keyframe['easing'] = { type: 'ease-in-out' }
      const handles = getEasingHandles(easing)

      expect(handles).toEqual({
        o: { x: 0.42, y: 0 },
        i: { x: 0.58, y: 1 },
      })
    })

    it('returns custom bezier handles when provided', () => {
      const easing: Keyframe['easing'] = {
        type: 'bezier',
        bezier: { x1: 0.25, y1: 0.1, x2: 0.75, y2: 0.9 },
      }
      const handles = getEasingHandles(easing)

      expect(handles).toEqual({
        o: { x: 0.25, y: 0.1 },
        i: { x: 0.75, y: 0.9 },
      })
    })

    it('falls back to linear for unknown easing type', () => {
      const easing = { type: 'unknown' as Keyframe['easing']['type'] }
      const handles = getEasingHandles(easing)

      expect(handles).toEqual({
        o: { x: 0, y: 0 },
        i: { x: 1, y: 1 },
      })
    })

    it('falls back to linear when bezier type has no bezier data', () => {
      const easing: Keyframe['easing'] = { type: 'bezier' }
      const handles = getEasingHandles(easing)

      expect(handles).toEqual({
        o: { x: 0, y: 0 },
        i: { x: 1, y: 1 },
      })
    })

    it('maps bezier x1/y1 to out-tangent and x2/y2 to in-tangent', () => {
      const easing: Keyframe['easing'] = {
        type: 'bezier',
        bezier: { x1: 0.1, y1: 0.2, x2: 0.3, y2: 0.4 },
      }
      const handles = getEasingHandles(easing)

      expect(handles.o.x).toBe(0.1)
      expect(handles.o.y).toBe(0.2)
      expect(handles.i.x).toBe(0.3)
      expect(handles.i.y).toBe(0.4)
    })
  })

  describe('createDefaultEasing', () => {
    it('returns linear easing', () => {
      const easing = createDefaultEasing()

      expect(easing).toEqual({ type: 'linear' })
    })

    it('returned easing has no bezier property', () => {
      const easing = createDefaultEasing()

      expect(easing.bezier).toBeUndefined()
    })
  })

  describe('createBezierEasing', () => {
    it('creates bezier easing with provided control points', () => {
      const easing = createBezierEasing(0.25, 0.1, 0.25, 1)

      expect(easing).toEqual({
        type: 'bezier',
        bezier: { x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 },
      })
    })

    it('creates standard CSS ease equivalent', () => {
      const easing = createBezierEasing(0.25, 0.1, 0.25, 1)

      expect(easing.type).toBe('bezier')
      expect(easing.bezier).toEqual({ x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 })
    })

    it('handles zero values', () => {
      const easing = createBezierEasing(0, 0, 0, 0)

      expect(easing.bezier).toEqual({ x1: 0, y1: 0, x2: 0, y2: 0 })
    })

    it('handles one values', () => {
      const easing = createBezierEasing(1, 1, 1, 1)

      expect(easing.bezier).toEqual({ x1: 1, y1: 1, x2: 1, y2: 1 })
    })

    it('handles overshoot values (elastic curves)', () => {
      const easing = createBezierEasing(0.68, -0.55, 0.27, 1.55)

      expect(easing.bezier).toEqual({ x1: 0.68, y1: -0.55, x2: 0.27, y2: 1.55 })
    })
  })

  describe('easing handles integration', () => {
    it('created bezier easing produces correct handles', () => {
      const easing = createBezierEasing(0.4, 0, 0.6, 1)
      const handles = getEasingHandles(easing)

      expect(handles).toEqual({
        o: { x: 0.4, y: 0 },
        i: { x: 0.6, y: 1 },
      })
    })

    it('default easing produces linear handles', () => {
      const easing = createDefaultEasing()
      const handles = getEasingHandles(easing)

      expect(handles).toEqual({
        o: { x: 0, y: 0 },
        i: { x: 1, y: 1 },
      })
    })
  })
})
