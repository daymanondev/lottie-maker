'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useCanvas } from '@/hooks'
import { useEditorStore } from '@/store'

interface CanvasProps {
  width?: number
  height?: number
  onReady?: () => void
}

export function Canvas({ width = 512, height = 512, onReady }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)

  const { initialize, getCanvas } = useCanvas(canvasRef)
  const zoom = useEditorStore((s) => s.zoom)
  const pan = useEditorStore((s) => s.pan)
  const setZoom = useEditorStore((s) => s.setZoom)
  const setPan = useEditorStore((s) => s.setPan)

  const [isPanning, setIsPanning] = useState(false)
  const [isSpaceDown, setIsSpaceDown] = useState(false)
  const lastPanPoint = useRef<{ x: number; y: number } | null>(null)

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSpaceDown || e.button === 1) {
      setIsPanning(true)
      lastPanPoint.current = { x: e.clientX, y: e.clientY }
      e.preventDefault()
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

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false)
      lastPanPoint.current = null
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        cursor: isSpaceDown ? (isPanning ? 'grabbing' : 'grab') : 'default',
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas ref={canvasRef} />
    </div>
  )
}
