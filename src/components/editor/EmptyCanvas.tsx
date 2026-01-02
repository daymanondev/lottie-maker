'use client'

import { useCallback, useState } from 'react'
import { useEditorStore } from '@/store'
import { useCanvasContext } from '@/contexts'
import { Button } from '@/components/ui/button'
import { Upload, Square, Circle, Type, MousePointer2, Loader2 } from 'lucide-react'

interface EmptyCanvasProps {
  onCreateShape?: (type: 'rect' | 'ellipse' | 'text') => void
}

export function EmptyCanvas({ onCreateShape }: EmptyCanvasProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const setActiveTool = useEditorStore((s) => s.setActiveTool)
  const { importSVG } = useCanvasContext()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleImportFile = useCallback(async (file: File) => {
    setIsImporting(true)
    try {
      await importSVG(file)
    } finally {
      setIsImporting(false)
    }
  }, [importSVG])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const svgFile = files.find(f => f.type === 'image/svg+xml' || f.name.endsWith('.svg'))
    
    if (svgFile) {
      handleImportFile(svgFile)
    }
  }, [handleImportFile])

  const handleSelectTool = (tool: 'rect' | 'ellipse' | 'text') => {
    setActiveTool(tool)
    onCreateShape?.(tool)
  }

  return (
    <div
      className={`
        absolute inset-0 flex items-center justify-center
        transition-colors duration-200
        ${isDragOver ? 'bg-[#3b82f6]/5' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`
          flex flex-col items-center gap-6 rounded-xl border-2 border-dashed p-10
          transition-all duration-200
          ${isDragOver 
            ? 'border-[#3b82f6] bg-[#3b82f6]/10 scale-[1.02]' 
            : 'border-[#3f3f46] bg-[#141414]/50'
          }
        `}
      >
        <div className="flex flex-col items-center gap-2">
          <div className={`
            flex h-16 w-16 items-center justify-center rounded-full
            transition-colors duration-200
            ${isDragOver ? 'bg-[#3b82f6]/20' : 'bg-[#262626]'}
          `}>
            {isImporting ? (
              <Loader2 className="h-8 w-8 animate-spin text-[#3b82f6]" />
            ) : (
              <Upload className={`h-8 w-8 ${isDragOver ? 'text-[#3b82f6]' : 'text-[#71717a]'}`} />
            )}
          </div>
          <h3 className="text-lg font-medium text-[#fafafa]">
            {isImporting ? 'Importing...' : isDragOver ? 'Drop SVG here' : 'Start creating'}
          </h3>
          <p className="text-center text-sm text-[#71717a]">
            Drop an SVG file here, or add a shape to get started
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-[#3f3f46]" />
          <span className="text-xs text-[#52525b]">or</span>
          <div className="h-px w-8 bg-[#3f3f46]" />
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-medium text-[#a1a1aa]">Add a shape</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-10 border-[#3f3f46] bg-[#1a1a1a] hover:bg-[#262626] hover:border-[#52525b]"
              onClick={() => handleSelectTool('rect')}
              title="Rectangle (R)"
            >
              <Square className="h-4 w-4 text-[#a1a1aa]" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-10 border-[#3f3f46] bg-[#1a1a1a] hover:bg-[#262626] hover:border-[#52525b]"
              onClick={() => handleSelectTool('ellipse')}
              title="Ellipse (O)"
            >
              <Circle className="h-4 w-4 text-[#a1a1aa]" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-10 border-[#3f3f46] bg-[#1a1a1a] hover:bg-[#262626] hover:border-[#52525b]"
              onClick={() => handleSelectTool('text')}
              title="Text (T)"
            >
              <Type className="h-4 w-4 text-[#a1a1aa]" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 text-xs text-[#52525b]">
          <MousePointer2 className="h-3 w-3" />
          <span>Click and drag on canvas to draw</span>
        </div>
      </div>
    </div>
  )
}
