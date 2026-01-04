import { describe, it, expect } from 'vitest'
import {
  hexToRgbArray,
  rgbArrayToHex,
  isValidHexColor,
  normalizeColor,
} from '@/lib/animation/color'

describe('color utilities', () => {
  describe('hexToRgbArray', () => {
    it('converts black', () => {
      expect(hexToRgbArray('#000000')).toEqual([0, 0, 0])
    })

    it('converts white', () => {
      expect(hexToRgbArray('#ffffff')).toEqual([1, 1, 1])
    })

    it('converts red', () => {
      expect(hexToRgbArray('#ff0000')).toEqual([1, 0, 0])
    })

    it('converts green', () => {
      expect(hexToRgbArray('#00ff00')).toEqual([0, 1, 0])
    })

    it('converts blue', () => {
      expect(hexToRgbArray('#0000ff')).toEqual([0, 0, 1])
    })

    it('converts mid-gray', () => {
      const result = hexToRgbArray('#808080')
      expect(result[0]).toBeCloseTo(0.502, 2)
      expect(result[1]).toBeCloseTo(0.502, 2)
      expect(result[2]).toBeCloseTo(0.502, 2)
    })

    it('handles uppercase hex', () => {
      expect(hexToRgbArray('#FF0000')).toEqual([1, 0, 0])
    })

    it('handles hex without hash', () => {
      expect(hexToRgbArray('ff0000')).toEqual([1, 0, 0])
    })
  })

  describe('rgbArrayToHex', () => {
    it('converts black', () => {
      expect(rgbArrayToHex([0, 0, 0])).toBe('#000000')
    })

    it('converts white', () => {
      expect(rgbArrayToHex([1, 1, 1])).toBe('#ffffff')
    })

    it('converts red', () => {
      expect(rgbArrayToHex([1, 0, 0])).toBe('#ff0000')
    })

    it('converts green', () => {
      expect(rgbArrayToHex([0, 1, 0])).toBe('#00ff00')
    })

    it('converts blue', () => {
      expect(rgbArrayToHex([0, 0, 1])).toBe('#0000ff')
    })

    it('rounds correctly', () => {
      expect(rgbArrayToHex([0.5, 0.5, 0.5])).toBe('#808080')
    })
  })

  describe('isValidHexColor', () => {
    it('accepts valid 6-digit hex with hash', () => {
      expect(isValidHexColor('#ff0000')).toBe(true)
      expect(isValidHexColor('#00FF00')).toBe(true)
      expect(isValidHexColor('#123abc')).toBe(true)
    })

    it('rejects hex without hash', () => {
      expect(isValidHexColor('ff0000')).toBe(false)
    })

    it('rejects 3-digit hex', () => {
      expect(isValidHexColor('#fff')).toBe(false)
    })

    it('rejects invalid characters', () => {
      expect(isValidHexColor('#gggggg')).toBe(false)
    })

    it('rejects empty string', () => {
      expect(isValidHexColor('')).toBe(false)
    })
  })

  describe('normalizeColor', () => {
    it('keeps hash and lowercases', () => {
      expect(normalizeColor('#FF0000')).toBe('#ff0000')
    })

    it('adds hash if missing', () => {
      expect(normalizeColor('ff0000')).toBe('#ff0000')
    })

    it('lowercases all characters', () => {
      expect(normalizeColor('#AABBCC')).toBe('#aabbcc')
    })
  })

  describe('round-trip conversion', () => {
    it('hex -> rgb -> hex preserves common colors', () => {
      const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff']
      for (const hex of colors) {
        const rgb = hexToRgbArray(hex)
        expect(rgbArrayToHex(rgb)).toBe(hex)
      }
    })

    it('rgb -> hex -> rgb preserves values', () => {
      const rgbValues: [number, number, number][] = [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
        [0.5, 0.5, 0.5],
      ]
      for (const rgb of rgbValues) {
        const hex = rgbArrayToHex(rgb)
        const result = hexToRgbArray(hex)
        expect(result[0]).toBeCloseTo(rgb[0], 2)
        expect(result[1]).toBeCloseTo(rgb[1], 2)
        expect(result[2]).toBeCloseTo(rgb[2], 2)
      }
    })
  })
})
