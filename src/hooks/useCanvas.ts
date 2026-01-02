'use client'

import { useRef, useEffect, useCallback, MutableRefObject } from 'react'
import type { Canvas as FabricCanvas } from 'fabric'
import { useEditorStore } from '@/store'
import {
  initializeFabricCanvas,
  disposeCanvas,
  createShape,
  syncObjectToStore,
  detectObjectType,
  type CanvasConfig,
  type FabricObjectType,
} from '@/lib/canvas'
import { importSVGString, importSVGFile, type SVGImportResult, type SVGImportOptions } from '@/lib/svg'
import type { CanvasObject } from '@/types'

export function useCanvas(canvasRef: MutableRefObject<HTMLCanvasElement | null>) {
  const fabricRef = useRef<FabricCanvas | null>(null)
  const {
    addObject,
    removeObject,
    updateObject,
    selectObject,
    selectObjects,
    clearSelection,
    layerOrder,
    setLayerOrder,
  } = useEditorStore()

  const initialize = useCallback(
    (config?: Partial<CanvasConfig>) => {
      const canvasElement = canvasRef.current
      if (!canvasElement || fabricRef.current) return

      const canvas = initializeFabricCanvas(canvasElement, config, {
        onObjectAdded: (id, fabricObj) => {
          syncObjectToStore(fabricObj)
          const canvasObj: CanvasObject = {
            id,
            name: `Layer ${id.slice(-4)}`,
            type: detectObjectType(fabricObj),
            visible: true,
            locked: false,
          }
          addObject(canvasObj)
          setLayerOrder([id, ...layerOrder])
        },
        onObjectRemoved: (id) => {
          removeObject(id)
          setLayerOrder(layerOrder.filter((layerId) => layerId !== id))
        },
        onObjectModified: (id, fabricObj) => {
          syncObjectToStore(fabricObj)
          updateObject(id, {})
        },
        onSelectionCreated: (ids) => {
          if (ids.length === 1) {
            selectObject(ids[0])
          } else {
            selectObjects(ids)
          }
        },
        onSelectionUpdated: (ids) => {
          selectObjects(ids)
        },
        onSelectionCleared: () => {
          clearSelection()
        },
      })

      fabricRef.current = canvas
    },
    [
      canvasRef,
      addObject,
      removeObject,
      updateObject,
      selectObject,
      selectObjects,
      clearSelection,
      layerOrder,
      setLayerOrder,
    ]
  )

  const addShape = useCallback(
    (type: FabricObjectType, options?: Record<string, unknown>) => {
      if (!fabricRef.current) return null

      const { object, id } = createShape(type, options)
      fabricRef.current.add(object)
      fabricRef.current.setActiveObject(object)
      fabricRef.current.requestRenderAll()

      return id
    },
    []
  )

  const removeSelected = useCallback(() => {
    if (!fabricRef.current) return

    const active = fabricRef.current.getActiveObjects()
    active.forEach((obj) => {
      fabricRef.current?.remove(obj)
    })
    fabricRef.current.discardActiveObject()
    fabricRef.current.requestRenderAll()
  }, [])

  const getCanvas = useCallback(() => fabricRef.current, [])

  const importSVG = useCallback(
    async (input: string | File, options?: SVGImportOptions): Promise<SVGImportResult> => {
      const result =
        typeof input === 'string'
          ? await importSVGString(input, options)
          : await importSVGFile(input, options)

      if (result.success && fabricRef.current) {
        for (const obj of result.objects) {
          fabricRef.current.add(obj)
        }
        fabricRef.current.requestRenderAll()

        if (result.objects.length > 0) {
          fabricRef.current.setActiveObject(result.objects[0])
        }
      }

      return result
    },
    []
  )

  useEffect(() => {
    return () => {
      if (fabricRef.current) {
        disposeCanvas(fabricRef.current)
        fabricRef.current = null
      }
    }
  }, [])

  return {
    initialize,
    addShape,
    removeSelected,
    getCanvas,
    importSVG,
  }
}
