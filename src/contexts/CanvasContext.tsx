'use client'

import { createContext, useContext, useRef, useCallback, type ReactNode } from 'react'
import type { Canvas as FabricCanvas } from 'fabric'
import { importSVGFile, type SVGImportResult } from '@/lib/svg'

interface CanvasContextValue {
  canvasRef: React.MutableRefObject<FabricCanvas | null>
  importSVG: (file: File) => Promise<SVGImportResult>
  setCanvas: (canvas: FabricCanvas | null) => void
}

const CanvasContext = createContext<CanvasContextValue | null>(null)

export function CanvasProvider({ children }: { children: ReactNode }) {
  const canvasRef = useRef<FabricCanvas | null>(null)

  const setCanvas = useCallback((canvas: FabricCanvas | null) => {
    canvasRef.current = canvas
  }, [])

  const importSVG = useCallback(async (file: File): Promise<SVGImportResult> => {
    const result = await importSVGFile(file)

    if (result.success && canvasRef.current) {
      for (const obj of result.objects) {
        canvasRef.current.add(obj)
      }
      canvasRef.current.requestRenderAll()

      if (result.objects.length > 0) {
        canvasRef.current.setActiveObject(result.objects[0])
      }
    }

    return result
  }, [])

  return (
    <CanvasContext.Provider value={{ canvasRef, importSVG, setCanvas }}>
      {children}
    </CanvasContext.Provider>
  )
}

export function useCanvasContext() {
  const context = useContext(CanvasContext)
  if (!context) {
    throw new Error('useCanvasContext must be used within a CanvasProvider')
  }
  return context
}
