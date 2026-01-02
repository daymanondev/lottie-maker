'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useCanvas, useKeyboardShortcuts } from '@/hooks'
import { useEditorStore } from '@/store'
import { EmptyCanvas } from './EmptyCanvas'
import type { Tool } from '@/types'

interface CanvasProps {
  width?: number
  height?: number
  onReady?: () => void
}

export function Canvas({ width = 512, height = 512, onReady }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)

  const { initialize, addShape, getCanvas } = useCanvas(canvasRef)
  
  useKeyboardShortcuts({ canvas: getCanvas() })
  const objects = useEditorStore((s) => s.objects)
  const zoom = useEditorStore((s) => s.zoom)
  const pan = useEditorStore((s) => s.pan)
  const activeTool = useEditorStore((s) => s.activeTool)
  const setActiveTool = useEditorStore((s) => s.setActiveTool)
  const setZoom = useEditorStore((s) => s.setZoom)
  const setPan = useEditorStore((s) => s.setPan)

  const [isPanning, setIsPanning] = useState(false)
  const [isSpaceDown, setIsSpaceDown] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const lastPanPoint = useRef<{ x: number; y: number } | null>(null)
  const drawStartPoint = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (canvasRef.current && !isInitializedRef.current) {
      initialize({
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true,
        preserveObjectStacking: true,
      })
      isInitializedRef.current = true
      onReady?.()
    }
  }, [initialize, width, height, onReady])

  useEffect(() => {
    const canvas = getCanvas()
    if (!canvas) return

    canvas.setZoom(zoom)
    canvas.requestRenderAll()
  }, [zoom, getCanvas])

  useEffect(() => {
    const canvas = getCanvas()
    if (!canvas) return

    const vpt = canvas.viewportTransform
    if (vpt) {
      vpt[4] = pan.x
      vpt[5] = pan.y
      canvas.requestRenderAll()
    }
  }, [pan, getCanvas])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const canvas = getCanvas()
      if (!canvas) return

      if (e.ctrlKey || e.metaKey) {
        const delta = -e.deltaY * 0.001
        const newZoom = Math.max(0.1, Math.min(5, zoom + delta))
        setZoom(newZoom)
      } else {
        const newPan = {
          x: pan.x - e.deltaX,
          y: pan.y - e.deltaY,
        }
        setPan(newPan)
      }
    },
    [zoom, pan, setZoom, setPan, getCanvas]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpaceDown) {
        setIsSpaceDown(true)
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpaceDown(false)
        setIsPanning(false)
        lastPanPoint.current = null
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isSpaceDown])

  const isDrawingTool = (tool: Tool): boolean => {
    return tool === 'rect' || tool === 'ellipse' || tool === 'text'
  }

  const getCanvasPoint = useCallback(
    (e: React.MouseEvent): { x: number; y: number } => {
      const canvas = getCanvas()
      if (!canvas || !containerRef.current) {
        return { x: e.clientX, y: e.clientY }
      }
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - pan.x) / zoom
      const y = (e.clientY - rect.top - pan.y) / zoom
      return { x, y }
    },
    [getCanvas, pan, zoom]
  )

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSpaceDown || e.button === 1) {
      setIsPanning(true)
      lastPanPoint.current = { x: e.clientX, y: e.clientY }
      e.preventDefault()
      return
    }

    if (isDrawingTool(activeTool) && e.button === 0) {
      const point = getCanvasPoint(e)
      drawStartPoint.current = point
      setIsDrawing(true)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && lastPanPoint.current) {
      const dx = e.clientX - lastPanPoint.current.x
      const dy = e.clientY - lastPanPoint.current.y
      setPan({ x: pan.x + dx, y: pan.y + dy })
      lastPanPoint.current = { x: e.clientX, y: e.clientY }
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isPanning) {
      setIsPanning(false)
      lastPanPoint.current = null
      return
    }

    if (isDrawing && drawStartPoint.current) {
      const endPoint = getCanvasPoint(e)
      const startPoint = drawStartPoint.current

      const left = Math.min(startPoint.x, endPoint.x)
      const top = Math.min(startPoint.y, endPoint.y)
      const shapeWidth = Math.abs(endPoint.x - startPoint.x)
      const shapeHeight = Math.abs(endPoint.y - startPoint.y)

      const minSize = 20
      const finalWidth = Math.max(shapeWidth, minSize)
      const finalHeight = Math.max(shapeHeight, minSize)

      if (activeTool === 'rect') {
        addShape('rect', { left, top, width: finalWidth, height: finalHeight })
      } else if (activeTool === 'ellipse') {
        addShape('ellipse', { left, top, width: finalWidth, height: finalHeight })
      } else if (activeTool === 'text') {
        addShape('text', { left: startPoint.x, top: startPoint.y })
      }

      setActiveTool('select')
      setIsDrawing(false)
      drawStartPoint.current = null
    }
  }

  const getCursor = (): string => {
    if (isSpaceDown) {
      return isPanning ? 'grabbing' : 'grab'
    }
    if (isDrawingTool(activeTool)) {
      return 'crosshair'
    }
    return 'default'
  }

  const isEmpty = objects.length === 0

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ cursor: getCursor() }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        if (isPanning) {
          setIsPanning(false)
          lastPanPoint.current = null
        }
      }}
    >
      <canvas ref={canvasRef} />
      {isEmpty && <EmptyCanvas />}
    </div>
  )
}
