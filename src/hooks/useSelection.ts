'use client'

import { useCallback, useMemo } from 'react'
import { useEditorStore } from '@/store'
import { getRegisteredObject } from '@/lib/canvas'

export function useSelection() {
  const { objects, selectedIds, selectObject, selectObjects, addToSelection, removeFromSelection, clearSelection } =
    useEditorStore()

  const selectedObjects = useMemo(() => {
    return objects.filter((obj) => selectedIds.includes(obj.id))
  }, [objects, selectedIds])

  const hasSelection = selectedIds.length > 0
  const isMultiSelect = selectedIds.length > 1

  const firstSelected = useMemo(() => {
    if (selectedIds.length === 0) return null
    return objects.find((obj) => obj.id === selectedIds[0]) ?? null
  }, [objects, selectedIds])

  const toggleSelection = useCallback(
    (id: string) => {
      if (selectedIds.includes(id)) {
        removeFromSelection(id)
      } else {
        addToSelection(id)
      }
    },
    [selectedIds, addToSelection, removeFromSelection]
  )

  const selectAll = useCallback(() => {
    selectObjects(objects.map((obj) => obj.id))
  }, [objects, selectObjects])

  const getSelectedFabricObjects = useCallback(() => {
    return selectedIds
      .map((id) => getRegisteredObject(id))
      .filter((synced): synced is NonNullable<typeof synced> => synced !== undefined)
      .map((synced) => synced.fabricObject)
  }, [selectedIds])

  return {
    selectedIds,
    selectedObjects,
    firstSelected,
    hasSelection,
    isMultiSelect,
    selectObject,
    selectObjects,
    addToSelection,
    removeFromSelection,
    toggleSelection,
    clearSelection,
    selectAll,
    getSelectedFabricObjects,
  }
}
