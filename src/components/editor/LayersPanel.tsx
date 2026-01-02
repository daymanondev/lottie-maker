'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useEditorStore } from '@/store'
import { getRegisteredObject } from '@/lib/canvas'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Square,
  Circle,
  Type,
  Spline,
  Layers,
  ChevronUp,
  ChevronDown,
  Trash2,
  ArrowUpToLine,
  ArrowDownToLine,
} from 'lucide-react'
import type { CanvasObject } from '@/types'

interface LayerItemProps {
  layer: CanvasObject
  isSelected: boolean
  onSelect: (id: string, multiSelect: boolean) => void
  onToggleVisibility: (id: string) => void
  onToggleLock: (id: string) => void
  onRename: (id: string, name: string) => void
  onDragStart: (id: string) => void
  onDragOver: (id: string) => void
  onDragEnd: () => void
  isDragTarget: boolean
}

function LayerIcon({ type }: { type: CanvasObject['type'] }) {
  const iconClass = 'h-3.5 w-3.5 text-[#71717a]'
  switch (type) {
    case 'rect':
      return <Square className={iconClass} />
    case 'ellipse':
      return <Circle className={iconClass} />
    case 'text':
      return <Type className={iconClass} />
    case 'path':
      return <Spline className={iconClass} />
    case 'group':
      return <Layers className={iconClass} />
    default:
      return <Square className={iconClass} />
  }
}

function LayerItem({
  layer,
  isSelected,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onRename,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragTarget,
}: LayerItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(layer.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    if (!layer.locked) {
      setEditName(layer.name)
      setIsEditing(true)
    }
  }

  const handleSubmitRename = () => {
    if (editName.trim()) {
      onRename(layer.id, editName.trim())
    } else {
      setEditName(layer.name)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitRename()
    } else if (e.key === 'Escape') {
      setEditName(layer.name)
      setIsEditing(false)
    }
  }

  return (
    <div
      className={`
        group flex h-9 items-center gap-2 px-2 cursor-pointer
        transition-colors duration-75
        ${isSelected ? 'bg-[#1d4ed8]/20' : 'hover:bg-[#262626]'}
        ${isDragTarget ? 'border-t-2 border-[#3b82f6]' : 'border-t-2 border-transparent'}
        ${layer.locked ? 'opacity-60' : ''}
      `}
      draggable={!isEditing}
      onDragStart={() => onDragStart(layer.id)}
      onDragOver={(e) => {
        e.preventDefault()
        onDragOver(layer.id)
      }}
      onDragEnd={onDragEnd}
      onClick={(e) => onSelect(layer.id, e.shiftKey || e.metaKey)}
      onDoubleClick={handleDoubleClick}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleVisibility(layer.id)
        }}
        className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#3f3f46] transition-colors"
        title={layer.visible ? 'Hide layer' : 'Show layer'}
      >
        {layer.visible ? (
          <Eye className="h-3.5 w-3.5 text-[#a1a1aa]" />
        ) : (
          <EyeOff className="h-3.5 w-3.5 text-[#52525b]" />
        )}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleLock(layer.id)
        }}
        className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#3f3f46] transition-colors"
        title={layer.locked ? 'Unlock layer' : 'Lock layer'}
      >
        {layer.locked ? (
          <Lock className="h-3.5 w-3.5 text-[#f59e0b]" />
        ) : (
          <Unlock className="h-3.5 w-3.5 text-[#52525b] opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </button>

      <LayerIcon type={layer.type} />

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleSubmitRename}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-[#27272a] px-1.5 py-0.5 text-xs text-[#fafafa] outline-none ring-1 ring-[#3b82f6] rounded"
        />
      ) : (
        <span className="flex-1 truncate text-xs text-[#fafafa]">{layer.name}</span>
      )}

      {isSelected && (
        <div className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
      )}
    </div>
  )
}

export function LayersPanel() {
  const {
    objects,
    selectedIds,
    layerOrder,
    selectObject,
    addToSelection,
    updateObject,
    removeObject,
    moveLayer,
    bringToFront,
    sendToBack,
  } = useEditorStore()

  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragTargetId, setDragTargetId] = useState<string | null>(null)

  const orderedLayers = layerOrder
    .map((id) => objects.find((obj) => obj.id === id))
    .filter((obj): obj is CanvasObject => obj !== undefined)

  const handleSelect = useCallback(
    (id: string, multiSelect: boolean) => {
      if (multiSelect) {
        addToSelection(id)
      } else {
        selectObject(id)
      }
      
      const synced = getRegisteredObject(id)
      if (synced) {
        const canvas = synced.fabricObject.canvas
        if (canvas) {
          canvas.setActiveObject(synced.fabricObject)
          canvas.requestRenderAll()
        }
      }
    },
    [selectObject, addToSelection]
  )

  const handleToggleVisibility = useCallback(
    (id: string) => {
      const obj = objects.find((o) => o.id === id)
      if (obj) {
        updateObject(id, { visible: !obj.visible })
        const synced = getRegisteredObject(id)
        if (synced) {
          synced.fabricObject.visible = !obj.visible
          synced.fabricObject.canvas?.requestRenderAll()
        }
      }
    },
    [objects, updateObject]
  )

  const handleToggleLock = useCallback(
    (id: string) => {
      const obj = objects.find((o) => o.id === id)
      if (obj) {
        updateObject(id, { locked: !obj.locked })
        const synced = getRegisteredObject(id)
        if (synced) {
          synced.fabricObject.selectable = obj.locked
          synced.fabricObject.evented = obj.locked
          synced.fabricObject.canvas?.requestRenderAll()
        }
      }
    },
    [objects, updateObject]
  )

  const handleRename = useCallback(
    (id: string, name: string) => {
      updateObject(id, { name })
    },
    [updateObject]
  )

  const handleDragStart = (id: string) => {
    setDraggedId(id)
  }

  const handleDragOver = (id: string) => {
    if (draggedId && draggedId !== id) {
      setDragTargetId(id)
    }
  }

  const handleDragEnd = () => {
    if (draggedId && dragTargetId) {
      const targetIndex = layerOrder.indexOf(dragTargetId)
      if (targetIndex !== -1) {
        moveLayer(draggedId, targetIndex)
        syncLayerOrderToCanvas()
      }
    }
    setDraggedId(null)
    setDragTargetId(null)
  }

  const syncLayerOrderToCanvas = useCallback(() => {
    const canvas = objects.length > 0 ? getRegisteredObject(objects[0].id)?.fabricObject.canvas : null
    if (!canvas) return

    const fabricObjects = layerOrder
      .slice()
      .reverse()
      .map((id) => getRegisteredObject(id)?.fabricObject)
      .filter((obj): obj is NonNullable<typeof obj> => obj !== undefined)

    fabricObjects.forEach((obj) => {
      canvas.bringObjectToFront(obj)
    })
    canvas.requestRenderAll()
  }, [objects, layerOrder])

  const handleDeleteSelected = useCallback(() => {
    selectedIds.forEach((id) => {
      const synced = getRegisteredObject(id)
      if (synced) {
        synced.fabricObject.canvas?.remove(synced.fabricObject)
      }
      removeObject(id)
    })
  }, [selectedIds, removeObject])

  const handleBringToFront = useCallback(() => {
    if (selectedIds.length === 1) {
      bringToFront(selectedIds[0])
      syncLayerOrderToCanvas()
    }
  }, [selectedIds, bringToFront, syncLayerOrderToCanvas])

  const handleSendToBack = useCallback(() => {
    if (selectedIds.length === 1) {
      sendToBack(selectedIds[0])
      syncLayerOrderToCanvas()
    }
  }, [selectedIds, sendToBack, syncLayerOrderToCanvas])

  const selectedLayer = selectedIds.length === 1 ? objects.find((o) => o.id === selectedIds[0]) : null

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 items-center justify-between border-b border-[#262626] px-4">
        <span className="text-sm font-medium text-[#fafafa]">Layers</span>
        <span className="text-xs text-[#71717a]">{objects.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {orderedLayers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#262626]">
              <Layers className="h-6 w-6 text-[#52525b]" />
            </div>
            <p className="text-sm font-medium text-[#a1a1aa]">No layers yet</p>
            <p className="mt-2 max-w-[180px] text-xs text-[#52525b]">
              Add shapes using the toolbar or drag an SVG file onto the canvas
            </p>
            <div className="mt-4 flex flex-col gap-1.5 text-[10px] text-[#3f3f46]">
              <div className="flex items-center gap-2">
                <kbd className="rounded bg-[#262626] px-1.5 py-0.5 font-mono">R</kbd>
                <span>Rectangle</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="rounded bg-[#262626] px-1.5 py-0.5 font-mono">O</kbd>
                <span>Ellipse</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="rounded bg-[#262626] px-1.5 py-0.5 font-mono">T</kbd>
                <span>Text</span>
              </div>
            </div>
          </div>
        ) : (
          orderedLayers.map((layer) => (
            <ContextMenu key={layer.id}>
              <ContextMenuTrigger asChild>
                <div>
                  <LayerItem
                    layer={layer}
                    isSelected={selectedIds.includes(layer.id)}
                    onSelect={handleSelect}
                    onToggleVisibility={handleToggleVisibility}
                    onToggleLock={handleToggleLock}
                    onRename={handleRename}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    isDragTarget={dragTargetId === layer.id}
                  />
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-48">
                <ContextMenuItem
                  onClick={() => handleSelect(layer.id, false)}
                >
                  <Square className="mr-2 h-4 w-4" />
                  Select
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onClick={() => handleToggleVisibility(layer.id)}
                >
                  {layer.visible ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Show
                    </>
                  )}
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => handleToggleLock(layer.id)}
                >
                  {layer.locked ? (
                    <>
                      <Unlock className="mr-2 h-4 w-4" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Lock
                    </>
                  )}
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onClick={() => {
                    handleSelect(layer.id, false)
                    handleBringToFront()
                  }}
                >
                  <ArrowUpToLine className="mr-2 h-4 w-4" />
                  Bring to Front
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => {
                    handleSelect(layer.id, false)
                    handleSendToBack()
                  }}
                >
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Send to Back
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onClick={() => {
                    handleSelect(layer.id, false)
                    handleDeleteSelected()
                  }}
                  className="text-red-400 focus:text-red-400"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))
        )}
      </div>

      {selectedLayer && (
        <div className="flex h-10 items-center justify-center gap-1 border-t border-[#262626] px-2">
          <button
            onClick={handleBringToFront}
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-[#262626] transition-colors"
            title="Bring to front"
          >
            <ChevronUp className="h-4 w-4 text-[#a1a1aa]" />
          </button>
          <button
            onClick={handleSendToBack}
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-[#262626] transition-colors"
            title="Send to back"
          >
            <ChevronDown className="h-4 w-4 text-[#a1a1aa]" />
          </button>
          <div className="mx-2 h-4 w-px bg-[#262626]" />
          <button
            onClick={handleDeleteSelected}
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-[#262626] transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-[#a1a1aa]" />
          </button>
        </div>
      )}
    </div>
  )
}
