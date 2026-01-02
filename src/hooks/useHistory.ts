'use client'

import { useCallback, useEffect } from 'react'
import { useEditorStore } from '@/store'

export interface HistorySnapshot {
  objects: unknown[]
  layerOrder: string[]
  keyframes: unknown[]
}

export function useHistory() {
  const {
    past,
    future,
    pushHistory,
    undo: storeUndo,
    redo: storeRedo,
    canUndo,
    canRedo,
    clearHistory,
    objects,
    layerOrder,
    keyframes,
    setObjects,
    setLayerOrder,
    setKeyframes: setKeyframesRaw,
  } = useEditorStore()

  const createSnapshot = useCallback((): HistorySnapshot => {
    return {
      objects: JSON.parse(JSON.stringify(objects)),
      layerOrder: [...layerOrder],
      keyframes: JSON.parse(JSON.stringify(keyframes)),
    }
  }, [objects, layerOrder, keyframes])

  const restoreSnapshot = useCallback(
    (snapshot: HistorySnapshot) => {
      setObjects(snapshot.objects as Parameters<typeof setObjects>[0])
      setLayerOrder(snapshot.layerOrder)
      if (setKeyframesRaw && typeof setKeyframesRaw === 'function') {
        setKeyframesRaw(snapshot.keyframes as Parameters<typeof setKeyframesRaw>[0])
      }
    },
    [setObjects, setLayerOrder, setKeyframesRaw]
  )

  const recordAction = useCallback(
    (actionName: string) => {
      const snapshot = createSnapshot()
      pushHistory(actionName, snapshot)
    },
    [createSnapshot, pushHistory]
  )

  const undo = useCallback(() => {
    if (!canUndo()) return false

    createSnapshot()
    const previousEntry = storeUndo()

    if (previousEntry && previousEntry.snapshot) {
      restoreSnapshot(previousEntry.snapshot as HistorySnapshot)
      return true
    }

    return false
  }, [canUndo, createSnapshot, storeUndo, restoreSnapshot])

  const redo = useCallback(() => {
    if (!canRedo()) return false

    const nextEntry = storeRedo()

    if (nextEntry && nextEntry.snapshot) {
      restoreSnapshot(nextEntry.snapshot as HistorySnapshot)
      return true
    }

    return false
  }, [canRedo, storeRedo, restoreSnapshot])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifierKey = isMac ? e.metaKey : e.ctrlKey

      if (!modifierKey) return

      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  return {
    past,
    future,
    canUndo: canUndo(),
    canRedo: canRedo(),
    undo,
    redo,
    recordAction,
    clearHistory,
    historyLength: past.length,
    futureLength: future.length,
  }
}
