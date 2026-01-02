'use client'

import { useCallback, useEffect } from 'react'
import { useEditorStore } from '@/store'
import { getRegisteredObject, unregisterObject, registerObject, generateObjectId } from '@/lib/canvas'
import type { Canvas as FabricCanvas } from 'fabric'

interface UseKeyboardShortcutsOptions {
  canvas: FabricCanvas | null
  onRecordAction?: (actionName: string) => void
}

export function useKeyboardShortcuts({ canvas, onRecordAction }: UseKeyboardShortcutsOptions) {
  const {
    selectedIds,
    objects,
    removeObject,
    addObject,
    updateObject,
    clearSelection,
    selectObjects,
    setActiveTool,
  } = useEditorStore()

  const deleteSelected = useCallback(() => {
    if (selectedIds.length === 0 || !canvas) return

    onRecordAction?.('Delete objects')

    selectedIds.forEach((id) => {
      const synced = getRegisteredObject(id)
      if (synced) {
        canvas.remove(synced.fabricObject)
        unregisterObject(id)
        removeObject(id)
      }
    })

    clearSelection()
    canvas.requestRenderAll()
  }, [selectedIds, canvas, removeObject, clearSelection, onRecordAction])

  const moveSelected = useCallback(
    (dx: number, dy: number) => {
      if (selectedIds.length === 0 || !canvas) return

      selectedIds.forEach((id) => {
        const synced = getRegisteredObject(id)
        if (synced) {
          const obj = synced.fabricObject
          obj.set({
            left: (obj.left ?? 0) + dx,
            top: (obj.top ?? 0) + dy,
          })
          obj.setCoords()

          const current = objects.find((o) => o.id === id)
          if (current) {
            updateObject(id, {
              left: (current.left ?? 0) + dx,
              top: (current.top ?? 0) + dy,
            })
          }
        }
      })

      canvas.requestRenderAll()
    },
    [selectedIds, canvas, objects, updateObject]
  )

  const duplicateSelected = useCallback(() => {
    if (selectedIds.length === 0 || !canvas) return

    onRecordAction?.('Duplicate objects')

    const newIds: string[] = []

    selectedIds.forEach((id) => {
      const synced = getRegisteredObject(id)
      const original = objects.find((o) => o.id === id)

      if (synced && original) {
        synced.fabricObject.clone().then((cloned: typeof synced.fabricObject) => {
          const newId = generateObjectId()

          cloned.set({
            left: (cloned.left ?? 0) + 20,
            top: (cloned.top ?? 0) + 20,
          })

          registerObject(cloned, newId, synced.type)
          canvas.add(cloned)

          addObject({
            ...original,
            id: newId,
            left: (original.left ?? 0) + 20,
            top: (original.top ?? 0) + 20,
          })

          newIds.push(newId)

          if (newIds.length === selectedIds.length) {
            selectObjects(newIds)
            canvas.requestRenderAll()
          }
        })
      }
    })
  }, [selectedIds, canvas, objects, addObject, selectObjects, onRecordAction])

  const selectAll = useCallback(() => {
    const allIds = objects.map((o) => o.id)
    selectObjects(allIds)

    if (canvas) {
      const fabricObjects = allIds
        .map((id) => getRegisteredObject(id)?.fabricObject)
        .filter((obj): obj is NonNullable<typeof obj> => obj !== undefined)

      if (fabricObjects.length === 1) {
        canvas.setActiveObject(fabricObjects[0])
        canvas.requestRenderAll()
      } else if (fabricObjects.length > 1) {
        canvas.discardActiveObject()
        fabricObjects.forEach((obj) => {
          canvas.setActiveObject(obj)
        })
        canvas.requestRenderAll()
      }
    }
  }, [objects, selectObjects, canvas])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifierKey = isMac ? e.metaKey : e.ctrlKey
      const moveAmount = e.shiftKey ? 10 : 1

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          e.preventDefault()
          deleteSelected()
          break

        case 'ArrowUp':
          e.preventDefault()
          moveSelected(0, -moveAmount)
          break

        case 'ArrowDown':
          e.preventDefault()
          moveSelected(0, moveAmount)
          break

        case 'ArrowLeft':
          e.preventDefault()
          moveSelected(-moveAmount, 0)
          break

        case 'ArrowRight':
          e.preventDefault()
          moveSelected(moveAmount, 0)
          break

        case 'd':
        case 'D':
          if (modifierKey) {
            e.preventDefault()
            duplicateSelected()
          }
          break

        case 'a':
        case 'A':
          if (modifierKey) {
            e.preventDefault()
            selectAll()
          }
          break

        case 'Escape':
          e.preventDefault()
          clearSelection()
          setActiveTool('select')
          canvas?.discardActiveObject()
          canvas?.requestRenderAll()
          break

        case 'v':
        case 'V':
          if (!modifierKey) {
            e.preventDefault()
            setActiveTool('select')
          }
          break

        case 'r':
        case 'R':
          if (!modifierKey) {
            e.preventDefault()
            setActiveTool('rect')
          }
          break

        case 'o':
        case 'O':
          if (!modifierKey) {
            e.preventDefault()
            setActiveTool('ellipse')
          }
          break

        case 't':
        case 'T':
          if (!modifierKey) {
            e.preventDefault()
            setActiveTool('text')
          }
          break
      }
    },
    [deleteSelected, moveSelected, duplicateSelected, selectAll, clearSelection, canvas, setActiveTool]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    deleteSelected,
    moveSelected,
    duplicateSelected,
    selectAll,
  }
}
