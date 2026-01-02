import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  generateObjectId,
  registerObject,
  unregisterObject,
  getRegisteredObject,
  getAllRegisteredObjects,
  clearRegistry,
  getObjectId,
  setObjectId,
  syncObjectToStore,
  applyStoreToObject,
  batchUpdate,
  detectObjectType,
} from '@/lib/canvas/fabric-sync'
import { Rect, Circle, Ellipse, Path, IText, Group, type FabricObject } from 'fabric'

const createMockFabricObject = (props: Partial<FabricObject> = {}): FabricObject => {
  return {
    left: 100,
    top: 100,
    width: 50,
    height: 50,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    opacity: 1,
    set: vi.fn(),
    setCoords: vi.fn(),
    ...props,
  } as unknown as FabricObject
}

describe('fabric-sync utilities', () => {
  beforeEach(() => {
    clearRegistry()
  })

  describe('generateObjectId', () => {
    it('generates a unique id with obj_ prefix', () => {
      const id = generateObjectId()
      expect(id).toMatch(/^obj_/)
    })

    it('generates different ids on each call', () => {
      const id1 = generateObjectId()
      const id2 = generateObjectId()
      expect(id1).not.toBe(id2)
    })
  })

  describe('registerObject / getRegisteredObject / unregisterObject', () => {
    it('registers and retrieves an object', () => {
      const mockObj = createMockFabricObject()
      const synced = registerObject(mockObj, 'test-id', 'rect')

      expect(synced.id).toBe('test-id')
      expect(synced.type).toBe('rect')
      expect(synced.fabricObject).toBe(mockObj)

      const retrieved = getRegisteredObject('test-id')
      expect(retrieved).toEqual(synced)
    })

    it('returns undefined for unregistered object', () => {
      const retrieved = getRegisteredObject('nonexistent')
      expect(retrieved).toBeUndefined()
    })

    it('unregisters an object', () => {
      const mockObj = createMockFabricObject()
      registerObject(mockObj, 'test-id', 'rect')

      unregisterObject('test-id')

      expect(getRegisteredObject('test-id')).toBeUndefined()
    })
  })

  describe('getAllRegisteredObjects', () => {
    it('returns all registered objects', () => {
      registerObject(createMockFabricObject(), 'obj-1', 'rect')
      registerObject(createMockFabricObject(), 'obj-2', 'ellipse')
      registerObject(createMockFabricObject(), 'obj-3', 'path')

      const all = getAllRegisteredObjects()
      expect(all).toHaveLength(3)
      expect(all.map((s) => s.id).sort()).toEqual(['obj-1', 'obj-2', 'obj-3'])
    })

    it('returns empty array when no objects registered', () => {
      expect(getAllRegisteredObjects()).toEqual([])
    })
  })

  describe('clearRegistry', () => {
    it('clears all registered objects', () => {
      registerObject(createMockFabricObject(), 'obj-1', 'rect')
      registerObject(createMockFabricObject(), 'obj-2', 'ellipse')

      clearRegistry()

      expect(getAllRegisteredObjects()).toHaveLength(0)
    })
  })

  describe('getObjectId / setObjectId', () => {
    it('sets and gets object id via WeakMap', () => {
      const mockObj = createMockFabricObject()
      setObjectId(mockObj, 'my-id')
      expect(getObjectId(mockObj)).toBe('my-id')
    })

    it('returns undefined for objects without id', () => {
      const mockObj = createMockFabricObject()
      expect(getObjectId(mockObj)).toBeUndefined()
    })
  })

  describe('syncObjectToStore', () => {
    it('extracts transform properties from fabric object', () => {
      const mockObj = createMockFabricObject({
        left: 150,
        top: 200,
        width: 100,
        height: 80,
        scaleX: 2,
        scaleY: 1.5,
        angle: 45,
        opacity: 0.8,
      })
      setObjectId(mockObj, 'sync-test')

      const result = syncObjectToStore(mockObj)

      expect(result).toEqual({
        id: 'sync-test',
        left: 150,
        top: 200,
        width: 100,
        height: 80,
        scaleX: 2,
        scaleY: 1.5,
        angle: 45,
        opacity: 0.8,
      })
    })

    it('handles undefined properties with defaults', () => {
      const mockObj = {
        set: vi.fn(),
        setCoords: vi.fn(),
      } as unknown as FabricObject

      const result = syncObjectToStore(mockObj)

      expect(result.left).toBe(0)
      expect(result.top).toBe(0)
      expect(result.scaleX).toBe(1)
      expect(result.scaleY).toBe(1)
    })
  })

  describe('applyStoreToObject', () => {
    it('applies properties to fabric object', () => {
      const mockObj = createMockFabricObject()

      applyStoreToObject(mockObj, { left: 200, top: 300, angle: 90 })

      expect(mockObj.set).toHaveBeenCalledWith({ left: 200, top: 300, angle: 90 })
      expect(mockObj.setCoords).toHaveBeenCalled()
    })
  })

  describe('batchUpdate', () => {
    it('applies updates to multiple objects and renders once', () => {
      const obj1 = createMockFabricObject()
      const obj2 = createMockFabricObject()
      const mockCanvas = {
        requestRenderAll: vi.fn(),
      }

      batchUpdate(mockCanvas as never, [
        { obj: obj1, props: { left: 100 } },
        { obj: obj2, props: { top: 200 } },
      ])

      expect(obj1.set).toHaveBeenCalledWith({ left: 100 })
      expect(obj2.set).toHaveBeenCalledWith({ top: 200 })
      expect(mockCanvas.requestRenderAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('detectObjectType', () => {
    it('detects Rect type', () => {
      const rect = Object.create(Rect.prototype)
      expect(detectObjectType(rect)).toBe('rect')
    })

    it('detects Circle as ellipse type', () => {
      const circle = Object.create(Circle.prototype)
      expect(detectObjectType(circle)).toBe('ellipse')
    })

    it('detects Ellipse type', () => {
      const ellipse = Object.create(Ellipse.prototype)
      expect(detectObjectType(ellipse)).toBe('ellipse')
    })

    it('detects Path type', () => {
      const path = Object.create(Path.prototype)
      expect(detectObjectType(path)).toBe('path')
    })

    it('detects IText type', () => {
      const text = Object.create(IText.prototype)
      expect(detectObjectType(text)).toBe('text')
    })

    it('detects Group type', () => {
      const group = Object.create(Group.prototype)
      expect(detectObjectType(group)).toBe('group')
    })

    it('defaults to rect for unknown types', () => {
      const unknown = {} as FabricObject
      expect(detectObjectType(unknown)).toBe('rect')
    })
  })
})
