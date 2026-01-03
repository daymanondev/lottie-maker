import { describe, it, expect, beforeEach } from 'vitest'
import {
  createRect,
  createEllipse,
  createCircle,
  createPath,
  createText,
  createGroup,
  createShape,
} from '@/lib/canvas/shapes'
import { clearRegistry, getRegisteredObject } from '@/lib/canvas/fabric-sync'

describe('shapes', () => {
  beforeEach(() => {
    clearRegistry()
  })

  describe('createRect', () => {
    it('creates a rect with default options', () => {
      const { object, id } = createRect()
      
      expect(id).toBeDefined()
      expect(object.type).toBe('rect')
      expect(object.left).toBe(100)
      expect(object.top).toBe(100)
      expect(object.width).toBe(100)
      expect(object.height).toBe(100)
    })

    it('creates a rect with custom options', () => {
      const { object } = createRect({
        left: 50,
        top: 75,
        width: 200,
        height: 150,
        fill: '#ff0000',
        stroke: '#00ff00',
        strokeWidth: 4,
      })
      
      expect(object.left).toBe(50)
      expect(object.top).toBe(75)
      expect(object.width).toBe(200)
      expect(object.height).toBe(150)
      expect(object.fill).toBe('#ff0000')
      expect(object.stroke).toBe('#00ff00')
      expect(object.strokeWidth).toBe(4)
    })

    it('registers the rect in registry', () => {
      const { id } = createRect()
      const registered = getRegisteredObject(id)
      
      expect(registered).toBeDefined()
      expect(registered?.type).toBe('rect')
    })
  })

  describe('createEllipse', () => {
    it('creates an ellipse with default options', () => {
      const { object, id } = createEllipse()
      
      expect(id).toBeDefined()
      expect(object.type).toBe('ellipse')
      expect(object.rx).toBe(50)
      expect(object.ry).toBe(40)
    })

    it('creates an ellipse with custom dimensions', () => {
      const { object } = createEllipse({
        width: 200,
        height: 100,
      })
      
      expect(object.rx).toBe(100)
      expect(object.ry).toBe(50)
    })

    it('registers the ellipse in registry', () => {
      const { id } = createEllipse()
      const registered = getRegisteredObject(id)
      
      expect(registered).toBeDefined()
      expect(registered?.type).toBe('ellipse')
    })
  })

  describe('createCircle', () => {
    it('creates a circle with default radius', () => {
      const { object, id } = createCircle()
      
      expect(id).toBeDefined()
      expect(object.type).toBe('circle')
      expect(object.radius).toBe(50)
    })

    it('creates a circle with custom radius', () => {
      const { object } = createCircle({ radius: 75 })
      
      expect(object.radius).toBe(75)
    })

    it('registers the circle as ellipse type', () => {
      const { id } = createCircle()
      const registered = getRegisteredObject(id)
      
      expect(registered?.type).toBe('ellipse')
    })
  })

  describe('createPath', () => {
    it('creates a path with given path data', () => {
      const pathData = 'M 0 0 L 50 50 L 100 0 Z'
      const { object, id } = createPath(pathData)
      
      expect(id).toBeDefined()
      expect(object.type).toBe('path')
    })

    it('applies custom styling', () => {
      const { object } = createPath('M 0 0 L 100 100', {
        fill: '#123456',
        stroke: '#654321',
        strokeWidth: 3,
      })
      
      expect(object.fill).toBe('#123456')
      expect(object.stroke).toBe('#654321')
      expect(object.strokeWidth).toBe(3)
    })

    it('registers the path in registry', () => {
      const { id } = createPath('M 0 0')
      const registered = getRegisteredObject(id)
      
      expect(registered?.type).toBe('path')
    })
  })

  describe('createText', () => {
    it('creates text with given content', () => {
      const { object, id } = createText('Hello World')
      
      expect(id).toBeDefined()
      expect(object.type).toBe('i-text')
      expect(object.text).toBe('Hello World')
    })

    it('applies custom font options', () => {
      const { object } = createText('Test', {
        fontSize: 36,
        fontFamily: 'Arial',
        fill: '#000000',
      })
      
      expect(object.fontSize).toBe(36)
      expect(object.fontFamily).toBe('Arial')
      expect(object.fill).toBe('#000000')
    })

    it('registers the text in registry', () => {
      const { id } = createText('Test')
      const registered = getRegisteredObject(id)
      
      expect(registered?.type).toBe('text')
    })
  })

  describe('createGroup', () => {
    it('creates an empty group', () => {
      const { object, id } = createGroup([])
      
      expect(id).toBeDefined()
      expect(object.type).toBe('group')
    })

    it('registers the group in registry', () => {
      const { id } = createGroup([])
      const registered = getRegisteredObject(id)
      
      expect(registered?.type).toBe('group')
    })
  })

  describe('createShape', () => {
    it('creates rect for "rect" type', () => {
      const { object } = createShape('rect')
      expect(object.type).toBe('rect')
    })

    it('creates ellipse for "ellipse" type', () => {
      const { object } = createShape('ellipse')
      expect(object.type).toBe('ellipse')
    })

    it('creates path for "path" type', () => {
      const { object } = createShape('path')
      expect(object.type).toBe('path')
    })

    it('creates text for "text" type', () => {
      const { object } = createShape('text')
      expect(object.type).toBe('i-text')
    })

    it('creates group for "group" type', () => {
      const { object } = createShape('group')
      expect(object.type).toBe('group')
    })

    it('defaults to rect for unknown type', () => {
      const { object } = createShape('unknown' as 'rect')
      expect(object.type).toBe('rect')
    })

    it('passes options to shape factory', () => {
      const { object } = createShape('rect', {
        left: 200,
        top: 300,
        fill: '#abcdef',
      })
      
      expect(object.left).toBe(200)
      expect(object.top).toBe(300)
      expect(object.fill).toBe('#abcdef')
    })
  })

  describe('unique ids', () => {
    it('generates unique ids for each shape', () => {
      const ids = new Set<string>()
      
      for (let i = 0; i < 100; i++) {
        const { id } = createRect()
        ids.add(id)
      }
      
      expect(ids.size).toBe(100)
    })
  })
})
