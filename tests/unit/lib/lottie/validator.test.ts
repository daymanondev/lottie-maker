import { describe, it, expect } from 'vitest'
import {
  validateLottieJson,
  validateAnimationBounds,
  validateLottie,
  formatValidationErrors,
} from '@/lib/lottie/validator'
import type { LottieAnimation, LottieLayer, LottieTransform } from '@/types'

function createValidTransform(): LottieTransform {
  return {
    p: { a: 0, k: [256, 256, 0] },
    s: { a: 0, k: [100, 100, 100] },
    r: { a: 0, k: 0 },
    o: { a: 0, k: 100 },
    a: { a: 0, k: [0, 0, 0] },
  }
}

function createValidLayer(overrides: Partial<LottieLayer> = {}): LottieLayer {
  return {
    ty: 4,
    nm: 'Shape Layer',
    ind: 1,
    ip: 0,
    op: 60,
    ks: createValidTransform(),
    ...overrides,
  }
}

function createValidAnimation(): LottieAnimation {
  return {
    v: '5.5.7',
    fr: 30,
    ip: 0,
    op: 60,
    w: 512,
    h: 512,
    nm: 'Test Animation',
    layers: [],
  }
}

describe('validator', () => {
  describe('validateLottieJson', () => {
    it('validates a minimal valid animation', () => {
      const animation = createValidAnimation()
      const result = validateLottieJson(animation)
      
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('validates animation with layers', () => {
      const animation = createValidAnimation()
      animation.layers = [createValidLayer()]
      
      const result = validateLottieJson(animation)
      expect(result.valid).toBe(true)
    })

    it('rejects animation missing required fields', () => {
      const animation = {
        v: '5.5.7',
        fr: 30,
      } as unknown as LottieAnimation
      
      const result = validateLottieJson(animation)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('rejects animation with invalid types', () => {
      const animation = {
        ...createValidAnimation(),
        fr: 'thirty' as unknown as number,
      }
      
      const result = validateLottieJson(animation)
      expect(result.valid).toBe(false)
    })
  })

  describe('validateAnimationBounds', () => {
    it('passes for valid bounds', () => {
      const animation = createValidAnimation()
      const result = validateAnimationBounds(animation)
      
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('fails when out-point equals in-point', () => {
      const animation = createValidAnimation()
      animation.ip = 30
      animation.op = 30
      
      const result = validateAnimationBounds(animation)
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: '/op',
          keyword: 'range',
        })
      )
    })

    it('fails when out-point is less than in-point', () => {
      const animation = createValidAnimation()
      animation.ip = 60
      animation.op = 30
      
      const result = validateAnimationBounds(animation)
      expect(result.valid).toBe(false)
    })

    it('fails for frame rate below 1', () => {
      const animation = createValidAnimation()
      animation.fr = 0
      
      const result = validateAnimationBounds(animation)
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: '/fr',
          keyword: 'range',
        })
      )
    })

    it('fails for frame rate above 120', () => {
      const animation = createValidAnimation()
      animation.fr = 121
      
      const result = validateAnimationBounds(animation)
      expect(result.valid).toBe(false)
    })

    it('fails for zero canvas width', () => {
      const animation = createValidAnimation()
      animation.w = 0
      
      const result = validateAnimationBounds(animation)
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: '/w',
        })
      )
    })

    it('fails for negative canvas height', () => {
      const animation = createValidAnimation()
      animation.h = -100
      
      const result = validateAnimationBounds(animation)
      expect(result.valid).toBe(false)
    })

    it('fails when layer out-point exceeds animation duration', () => {
      const animation = createValidAnimation()
      animation.op = 60
      animation.layers = [createValidLayer({ nm: 'Long Layer', op: 100 })]
      
      const result = validateAnimationBounds(animation)
      expect(result.valid).toBe(false)
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: '/layers/0/op',
        })
      )
    })

    it('passes when layer out-point equals animation duration', () => {
      const animation = createValidAnimation()
      animation.op = 60
      animation.layers = [createValidLayer({ nm: 'Exact Layer', op: 60 })]
      
      const result = validateAnimationBounds(animation)
      expect(result.valid).toBe(true)
    })
  })

  describe('validateLottie', () => {
    it('runs both schema and bounds validation', () => {
      const animation = createValidAnimation()
      const result = validateLottie(animation)
      
      expect(result.valid).toBe(true)
    })

    it('returns schema errors first', () => {
      const animation = {
        v: '5.5.7',
      } as unknown as LottieAnimation
      
      const result = validateLottie(animation)
      expect(result.valid).toBe(false)
    })

    it('returns bounds errors if schema passes', () => {
      const animation = createValidAnimation()
      animation.fr = 0
      
      const result = validateLottie(animation)
      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.path === '/fr')).toBe(true)
    })
  })

  describe('formatValidationErrors', () => {
    it('returns empty string for no errors', () => {
      const result = formatValidationErrors([])
      expect(result).toBe('')
    })

    it('formats single error', () => {
      const errors = [
        { path: '/fr', message: 'Invalid frame rate', keyword: 'range' },
      ]
      const result = formatValidationErrors(errors)
      
      expect(result).toBe('/fr: Invalid frame rate')
    })

    it('formats multiple errors with newlines', () => {
      const errors = [
        { path: '/fr', message: 'Invalid frame rate', keyword: 'range' },
        { path: '/op', message: 'Invalid duration', keyword: 'range' },
      ]
      const result = formatValidationErrors(errors)
      
      expect(result).toContain('/fr: Invalid frame rate')
      expect(result).toContain('/op: Invalid duration')
      expect(result.split('\n')).toHaveLength(2)
    })
  })
})
