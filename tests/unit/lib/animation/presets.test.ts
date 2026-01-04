import { describe, it, expect } from 'vitest'
import {
  ANIMATION_PRESETS,
  applyPreset,
  getPreset,
  getPresetNames,
  getPresetsByCategory,
  getAllCategories,
  type PresetName,
} from '@/lib/animation/presets'

describe('presets', () => {
  describe('getPresetNames', () => {
    it('returns all preset names', () => {
      const names = getPresetNames()

      expect(names).toContain('fade-in')
      expect(names).toContain('fade-out')
      expect(names).toContain('scale-up')
      expect(names).toContain('bounce-in')
      expect(names.length).toBe(10)
    })
  })

  describe('getPreset', () => {
    it('returns preset definition by name', () => {
      const preset = getPreset('fade-in')

      expect(preset).toBeDefined()
      expect(preset?.label).toBe('Fade In')
      expect(preset?.category).toBe('fade')
    })

    it('returns undefined for unknown preset', () => {
      const preset = getPreset('unknown' as PresetName)

      expect(preset).toBeUndefined()
    })
  })

  describe('getPresetsByCategory', () => {
    it('returns fade presets', () => {
      const presets = getPresetsByCategory('fade')

      expect(presets.length).toBe(2)
      expect(presets.map((p) => p.name)).toContain('fade-in')
      expect(presets.map((p) => p.name)).toContain('fade-out')
    })

    it('returns scale presets', () => {
      const presets = getPresetsByCategory('scale')

      expect(presets.length).toBe(2)
      expect(presets.map((p) => p.name)).toContain('scale-up')
      expect(presets.map((p) => p.name)).toContain('scale-down')
    })

    it('returns rotate presets', () => {
      const presets = getPresetsByCategory('rotate')

      expect(presets.length).toBe(2)
    })

    it('returns bounce presets', () => {
      const presets = getPresetsByCategory('bounce')

      expect(presets.length).toBe(2)
    })

    it('returns slide presets', () => {
      const presets = getPresetsByCategory('slide')

      expect(presets.length).toBe(2)
    })
  })

  describe('getAllCategories', () => {
    it('returns all categories', () => {
      const categories = getAllCategories()

      expect(categories).toEqual(['fade', 'scale', 'rotate', 'bounce', 'slide'])
    })
  })

  describe('applyPreset', () => {
    it('generates keyframes with unique ids', () => {
      const keyframes = applyPreset('fade-in', { objectId: 'obj-1' })

      expect(keyframes.length).toBe(2)
      expect(keyframes[0].id).toBeDefined()
      expect(keyframes[1].id).toBeDefined()
      expect(keyframes[0].id).not.toBe(keyframes[1].id)
    })

    it('uses provided objectId', () => {
      const keyframes = applyPreset('fade-in', { objectId: 'test-object' })

      expect(keyframes[0].objectId).toBe('test-object')
      expect(keyframes[1].objectId).toBe('test-object')
    })

    it('uses default startFrame of 0', () => {
      const keyframes = applyPreset('fade-in', { objectId: 'obj-1' })

      expect(keyframes[0].frame).toBe(0)
    })

    it('uses default duration of 30 frames', () => {
      const keyframes = applyPreset('fade-in', { objectId: 'obj-1' })

      expect(keyframes[1].frame).toBe(30)
    })

    it('respects custom startFrame', () => {
      const keyframes = applyPreset('fade-in', { objectId: 'obj-1', startFrame: 15 })

      expect(keyframes[0].frame).toBe(15)
      expect(keyframes[1].frame).toBe(45)
    })

    it('respects custom duration', () => {
      const keyframes = applyPreset('fade-in', { objectId: 'obj-1', duration: 60 })

      expect(keyframes[0].frame).toBe(0)
      expect(keyframes[1].frame).toBe(60)
    })

    it('throws for unknown preset', () => {
      expect(() => applyPreset('unknown' as PresetName, { objectId: 'obj-1' })).toThrow(
        'Unknown preset: unknown'
      )
    })
  })

  describe('fade-in preset', () => {
    it('generates opacity keyframes from 0 to 100', () => {
      const keyframes = applyPreset('fade-in', { objectId: 'obj-1' })

      expect(keyframes[0].property).toBe('opacity')
      expect(keyframes[0].value).toBe(0)
      expect(keyframes[1].property).toBe('opacity')
      expect(keyframes[1].value).toBe(100)
    })

    it('uses ease-out easing for first keyframe', () => {
      const keyframes = applyPreset('fade-in', { objectId: 'obj-1' })

      expect(keyframes[0].easing.type).toBe('bezier')
    })
  })

  describe('fade-out preset', () => {
    it('generates opacity keyframes from 100 to 0', () => {
      const keyframes = applyPreset('fade-out', { objectId: 'obj-1' })

      expect(keyframes[0].value).toBe(100)
      expect(keyframes[1].value).toBe(0)
    })
  })

  describe('scale-up preset', () => {
    it('generates scale keyframes from [0,0] to [100,100]', () => {
      const keyframes = applyPreset('scale-up', { objectId: 'obj-1' })

      expect(keyframes[0].property).toBe('scale')
      expect(keyframes[0].value).toEqual([0, 0])
      expect(keyframes[1].value).toEqual([100, 100])
    })
  })

  describe('scale-down preset', () => {
    it('generates scale keyframes from [100,100] to [0,0]', () => {
      const keyframes = applyPreset('scale-down', { objectId: 'obj-1' })

      expect(keyframes[0].value).toEqual([100, 100])
      expect(keyframes[1].value).toEqual([0, 0])
    })
  })

  describe('rotate-cw preset', () => {
    it('generates rotation keyframes from 0 to 360', () => {
      const keyframes = applyPreset('rotate-cw', { objectId: 'obj-1' })

      expect(keyframes[0].property).toBe('rotation')
      expect(keyframes[0].value).toBe(0)
      expect(keyframes[1].value).toBe(360)
    })
  })

  describe('rotate-ccw preset', () => {
    it('generates rotation keyframes from 0 to -360', () => {
      const keyframes = applyPreset('rotate-ccw', { objectId: 'obj-1' })

      expect(keyframes[0].value).toBe(0)
      expect(keyframes[1].value).toBe(-360)
    })
  })

  describe('bounce-in preset', () => {
    it('generates scale keyframes with bounce easing', () => {
      const keyframes = applyPreset('bounce-in', { objectId: 'obj-1' })

      expect(keyframes[0].property).toBe('scale')
      expect(keyframes[0].easing.type).toBe('bezier')
      expect(keyframes[0].easing.bezier?.y1).toBeLessThan(0)
    })
  })

  describe('bounce-out preset', () => {
    it('generates scale keyframes with bounce easing', () => {
      const keyframes = applyPreset('bounce-out', { objectId: 'obj-1' })

      expect(keyframes[0].easing.bezier?.y2).toBeGreaterThan(1)
    })
  })

  describe('slide-in-left preset', () => {
    it('generates position keyframes from left to center', () => {
      const keyframes = applyPreset('slide-in-left', { objectId: 'obj-1' })

      expect(keyframes[0].property).toBe('position')
      expect((keyframes[0].value as number[])[0]).toBeLessThan(0)
      expect((keyframes[1].value as number[])[0]).toBe(256)
    })
  })

  describe('slide-in-right preset', () => {
    it('generates position keyframes from right to center', () => {
      const keyframes = applyPreset('slide-in-right', { objectId: 'obj-1' })

      expect((keyframes[0].value as number[])[0]).toBeGreaterThan(500)
      expect((keyframes[1].value as number[])[0]).toBe(256)
    })
  })

  describe('preset definitions', () => {
    it('all presets have required fields', () => {
      for (const [name, preset] of Object.entries(ANIMATION_PRESETS)) {
        expect(preset.name).toBe(name)
        expect(preset.label).toBeDefined()
        expect(preset.description).toBeDefined()
        expect(preset.category).toBeDefined()
        expect(typeof preset.generate).toBe('function')
      }
    })

    it('all presets generate at least 2 keyframes', () => {
      for (const preset of Object.values(ANIMATION_PRESETS)) {
        const keyframes = preset.generate({ objectId: 'test' })
        expect(keyframes.length).toBeGreaterThanOrEqual(2)
      }
    })
  })
})
