import { describe, it, expect } from 'vitest'
import {
  templates,
  getTemplatesByCategory,
  getTemplateById,
  templateCategories,
} from '@/lib/templates/registry'

describe('template registry', () => {
  describe('templates', () => {
    it('has 5 templates', () => {
      expect(templates).toHaveLength(5)
    })

    it('contains expected template ids', () => {
      const ids = templates.map((t) => t.id)
      expect(ids).toContain('loading-spinner')
      expect(ids).toContain('pulse-dot')
      expect(ids).toContain('fade-in-up')
      expect(ids).toContain('bounce-ball')
      expect(ids).toContain('check-mark')
    })

    it('each template has required properties', () => {
      for (const template of templates) {
        expect(template).toHaveProperty('id')
        expect(template).toHaveProperty('name')
        expect(template).toHaveProperty('description')
        expect(template).toHaveProperty('category')
        expect(template).toHaveProperty('thumbnail')
        expect(template).toHaveProperty('duration')
        expect(template).toHaveProperty('frameRate')
        expect(template).toHaveProperty('canvasSize')
        expect(template).toHaveProperty('objects')
        expect(template).toHaveProperty('keyframes')

        expect(typeof template.id).toBe('string')
        expect(typeof template.name).toBe('string')
        expect(typeof template.duration).toBe('number')
        expect(typeof template.frameRate).toBe('number')
        expect(template.canvasSize).toHaveProperty('width')
        expect(template.canvasSize).toHaveProperty('height')
        expect(Array.isArray(template.objects)).toBe(true)
        expect(Array.isArray(template.keyframes)).toBe(true)
      }
    })
  })

  describe('getTemplatesByCategory', () => {
    it('returns loading templates', () => {
      const result = getTemplatesByCategory('loading')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('loading-spinner')
    })

    it('returns icons templates', () => {
      const result = getTemplatesByCategory('icons')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('check-mark')
    })

    it('returns transitions templates', () => {
      const result = getTemplatesByCategory('transitions')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('fade-in-up')
    })

    it('returns ui-elements templates', () => {
      const result = getTemplatesByCategory('ui-elements')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('pulse-dot')
    })

    it('returns illustrations templates', () => {
      const result = getTemplatesByCategory('illustrations')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('bounce-ball')
    })

    it('returns empty array for unknown category', () => {
      const result = getTemplatesByCategory('unknown-category')
      expect(result).toEqual([])
    })
  })

  describe('getTemplateById', () => {
    it('returns correct template for valid id', () => {
      const result = getTemplateById('loading-spinner')
      expect(result).toBeDefined()
      expect(result?.id).toBe('loading-spinner')
      expect(result?.name).toBe('Loading Spinner')
    })

    it('returns check-mark template', () => {
      const result = getTemplateById('check-mark')
      expect(result).toBeDefined()
      expect(result?.category).toBe('icons')
    })

    it('returns undefined for unknown id', () => {
      const result = getTemplateById('non-existent-template')
      expect(result).toBeUndefined()
    })

    it('returns undefined for empty string', () => {
      const result = getTemplateById('')
      expect(result).toBeUndefined()
    })
  })

  describe('templateCategories', () => {
    it('has 5 categories', () => {
      expect(templateCategories).toHaveLength(5)
    })

    it('each category has id, name, and icon', () => {
      for (const category of templateCategories) {
        expect(category).toHaveProperty('id')
        expect(category).toHaveProperty('name')
        expect(category).toHaveProperty('icon')
        expect(typeof category.id).toBe('string')
        expect(typeof category.name).toBe('string')
        expect(typeof category.icon).toBe('string')
      }
    })

    it('contains expected category ids', () => {
      const ids = templateCategories.map((c) => c.id)
      expect(ids).toContain('loading')
      expect(ids).toContain('icons')
      expect(ids).toContain('transitions')
      expect(ids).toContain('ui-elements')
      expect(ids).toContain('illustrations')
    })
  })
})
