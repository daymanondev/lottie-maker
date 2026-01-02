'use client'

import { useRef } from 'react'
import { useEditorStore } from '@/store'
import { useCanvasContext } from '@/contexts'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { MousePointer2, Square, Circle, Type, Upload } from 'lucide-react'
import type { Tool } from '@/types'

const tools: { id: Tool; icon: typeof MousePointer2; label: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Select (V)' },
  { id: 'rect', icon: Square, label: 'Rectangle (R)' },
  { id: 'ellipse', icon: Circle, label: 'Ellipse (O)' },
  { id: 'text', icon: Type, label: 'Text (T)' },
]

export function Toolbar() {
  const activeTool = useEditorStore((s) => s.activeTool)
  const setActiveTool = useEditorStore((s) => s.setActiveTool)
  const { importSVG } = useCanvasContext()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await importSVG(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex items-center gap-1">
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 w-8 text-[#a1a1aa] hover:bg-[#262626] hover:text-[#fafafa]"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Import SVG</TooltipContent>
      </Tooltip>

      <div className="mx-1 h-4 w-px bg-[#3f3f46]" />

      {tools.map((tool) => {
        const Icon = tool.icon
        const isActive = activeTool === tool.id
        return (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setActiveTool(tool.id)}
                className={`h-8 w-8 ${
                  isActive
                    ? 'bg-[#3b82f6] text-white hover:bg-[#3b82f6]/90'
                    : 'text-[#a1a1aa] hover:bg-[#262626] hover:text-[#fafafa]'
                }`}
              >
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{tool.label}</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
