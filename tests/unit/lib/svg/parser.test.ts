import { describe, it, expect } from 'vitest'
import {
  parseSVGString,
  validateSVGForImport,
  getSVGDimensions,
  SUPPORTED_SVG_ELEMENTS,
  UNSUPPORTED_SVG_FEATURES,
} from '@/lib/svg'

describe('SVG Parser', () => {
  describe('parseSVGString', () => {
    it('parses valid SVG with basic shapes', () => {
      const svg = `
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="80" fill="blue" />
        </svg>
      `
      const result = parseSVGString(svg)

      expect(result.success).toBe(true)
      expect(result.svgElement).not.toBeNull()
      expect(result.metadata.width).toBe(100)
      expect(result.metadata.height).toBe(100)
      expect(result.metadata.elementCount).toBeGreaterThan(0)
      expect(result.errors).toHaveLength(0)
    })

    it('parses SVG with viewBox', () => {
      const svg = `
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="50" />
        </svg>
      `
      const result = parseSVGString(svg)

      expect(result.success).toBe(true)
      expect(result.metadata.viewBox).toBe('0 0 200 200')
    })

    it('returns error for empty content', () => {
      const result = parseSVGString('')

      expect(result.success).toBe(false)
      expect(result.errors).toContain('SVG content is empty')
    })

    it('returns error for whitespace-only content', () => {
      const result = parseSVGString('   \n\t  ')

      expect(result.success).toBe(false)
      expect(result.errors).toContain('SVG content is empty')
    })

    it('returns error for invalid XML', () => {
      const result = parseSVGString('<svg><rect></svg>')

      expect(result.success).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors[0]).toContain('Invalid SVG')
    })

    it('returns error for non-SVG XML', () => {
      const result = parseSVGString('<div><p>Hello</p></div>')

      expect(result.success).toBe(false)
      expect(result.errors).toContain('No SVG element found in the document')
    })

    it('detects unsupported features', () => {
      const svg = `
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <mask id="myMask">
              <rect fill="white" width="100" height="100"/>
            </mask>
          </defs>
          <rect mask="url(#myMask)" width="100" height="100" fill="red"/>
        </svg>
      `
      const result = parseSVGString(svg)

      expect(result.success).toBe(true)
      expect(result.metadata.unsupportedFeatures).toContain('mask')
    })

    it('counts supported elements correctly', () => {
      const svg = `
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="50" height="50"/>
          <circle cx="75" cy="75" r="25"/>
          <ellipse cx="50" cy="50" rx="20" ry="10"/>
          <path d="M 0 0 L 100 100"/>
        </svg>
      `
      const result = parseSVGString(svg)

      expect(result.success).toBe(true)
      expect(result.metadata.elementCount).toBe(4)
    })

    it('rejects files over 5MB', () => {
      const largeContent = 'x'.repeat(6 * 1024 * 1024)
      const result = parseSVGString(largeContent)

      expect(result.success).toBe(false)
      expect(result.errors[0]).toContain('exceeds maximum size')
    })
  })

  describe('validateSVGForImport', () => {
    it('returns valid for simple SVG', () => {
      const svg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect/></svg>`
      const result = validateSVGForImport(svg)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('returns warning for unsupported features', () => {
      const svg = `
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <defs><filter id="blur"><feGaussianBlur/></filter></defs>
          <rect/>
        </svg>
      `
      const result = validateSVGForImport(svg)

      expect(result.valid).toBe(true)
      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings[0]).toContain('Unsupported features')
    })

    it('returns error for invalid SVG', () => {
      const result = validateSVGForImport('not valid xml')

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('getSVGDimensions', () => {
    it('gets dimensions from width/height attributes', () => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(
        '<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg"></svg>',
        'image/svg+xml'
      )
      const svg = doc.querySelector('svg')!

      const dimensions = getSVGDimensions(svg)

      expect(dimensions.width).toBe(200)
      expect(dimensions.height).toBe(150)
    })

    it('gets dimensions from viewBox when no width/height', () => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(
        '<svg viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg"></svg>',
        'image/svg+xml'
      )
      const svg = doc.querySelector('svg')!

      const dimensions = getSVGDimensions(svg)

      expect(dimensions.width).toBe(300)
      expect(dimensions.height).toBe(250)
    })

    it('returns default dimensions when neither available', () => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(
        '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
        'image/svg+xml'
      )
      const svg = doc.querySelector('svg')!

      const dimensions = getSVGDimensions(svg)

      expect(dimensions.width).toBe(100)
      expect(dimensions.height).toBe(100)
    })
  })

  describe('constants', () => {
    it('exports supported SVG elements', () => {
      expect(SUPPORTED_SVG_ELEMENTS).toContain('rect')
      expect(SUPPORTED_SVG_ELEMENTS).toContain('circle')
      expect(SUPPORTED_SVG_ELEMENTS).toContain('ellipse')
      expect(SUPPORTED_SVG_ELEMENTS).toContain('path')
      expect(SUPPORTED_SVG_ELEMENTS).toContain('text')
      expect(SUPPORTED_SVG_ELEMENTS).toContain('g')
    })

    it('exports unsupported SVG features', () => {
      expect(UNSUPPORTED_SVG_FEATURES).toContain('mask')
      expect(UNSUPPORTED_SVG_FEATURES).toContain('clipPath')
      expect(UNSUPPORTED_SVG_FEATURES).toContain('filter')
      expect(UNSUPPORTED_SVG_FEATURES).toContain('image')
    })
  })
})
