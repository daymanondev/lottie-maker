'use client'

import { useEditorStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Minus, Plus, Maximize } from 'lucide-react'

const ZOOM_LEVELS = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5]

export function ZoomControls() {
  const zoom = useEditorStore((s) => s.zoom)
  const setZoom = useEditorStore((s) => s.setZoom)
  const resetView = useEditorStore((s) => s.resetView)

  const zoomIn = () => {
    const nextLevel = ZOOM_LEVELS.find((level) => level > zoom)
    if (nextLevel) setZoom(nextLevel)
  }

  const zoomOut = () => {
    const prevLevels = ZOOM_LEVELS.filter((level) => level < zoom)
    if (prevLevels.length > 0) setZoom(prevLevels[prevLevels.length - 1])
  }

  const zoomToFit = () => {
    resetView()
  }

  const percentage = Math.round(zoom * 100)

  return (
    <div className="flex items-center gap-1 rounded-lg border border-[#262626] bg-[#141414] p-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={zoomOut}
            disabled={zoom <= 0.1}
            className="h-7 w-7 text-[#a1a1aa] hover:bg-[#262626] hover:text-[#fafafa]"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Zoom out (⌘-)</TooltipContent>
      </Tooltip>

      <button
        className="min-w-[52px] rounded px-2 py-1 text-sm font-medium text-[#fafafa] hover:bg-[#262626]"
        onClick={zoomToFit}
        title="Click to reset"
      >
        {percentage}%
      </button>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={zoomIn}
            disabled={zoom >= 5}
            className="h-7 w-7 text-[#a1a1aa] hover:bg-[#262626] hover:text-[#fafafa]"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Zoom in (⌘+)</TooltipContent>
      </Tooltip>

      <div className="mx-1 h-4 w-px bg-[#262626]" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={zoomToFit}
            className="h-7 w-7 text-[#a1a1aa] hover:bg-[#262626] hover:text-[#fafafa]"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">Fit to view (⌘0)</TooltipContent>
      </Tooltip>
    </div>
  )
}
