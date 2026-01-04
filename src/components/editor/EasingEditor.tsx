'use client'

import { useCallback, useRef, useState, useMemo, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { Keyframe } from '@/types'

export interface EasingEditorProps {
  easing: Keyframe['easing']
  onChange: (easing: Keyframe['easing']) => void
  size?: number
  className?: string
}

interface Point {
  x: number
  y: number
}

const PRESETS: { name: string; easing: Keyframe['easing'] }[] = [
  { name: 'Linear', easing: { type: 'linear' } },
  { name: 'Ease In', easing: { type: 'ease-in' } },
  { name: 'Ease Out', easing: { type: 'ease-out' } },
  { name: 'Ease In-Out', easing: { type: 'ease-in-out' } },
]

function getInitialPoints(easing: Keyframe['easing']): { p1: Point; p2: Point } {
  if (easing.type === 'bezier' && easing.bezier) {
    return {
      p1: { x: easing.bezier.x1, y: easing.bezier.y1 },
      p2: { x: easing.bezier.x2, y: easing.bezier.y2 },
    }
  }
  return getPresetPoints(easing.type)
}

export function EasingEditor({
  easing,
  onChange,
  size = 200,
  className,
}: EasingEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dragging, setDragging] = useState<'p1' | 'p2' | null>(null)

  const initialPoints = useMemo(() => getInitialPoints(easing), [easing])
  const [localP1, setLocalP1] = useState<Point>(initialPoints.p1)
  const [localP2, setLocalP2] = useState<Point>(initialPoints.p2)

  const p1 = dragging ? localP1 : initialPoints.p1
  const p2 = dragging ? localP2 : initialPoints.p2

  const drawCurve = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const padding = 20
    const width = size - padding * 2
    const height = size - padding * 2

    ctx.clearRect(0, 0, size, size)

    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(padding, size - padding)
    ctx.lineTo(size - padding, padding)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.strokeStyle = '#666'
    ctx.beginPath()
    ctx.rect(padding, padding, width, height)
    ctx.stroke()

    const toCanvas = (p: Point): Point => ({
      x: padding + p.x * width,
      y: size - padding - p.y * height,
    })

    const start = toCanvas({ x: 0, y: 0 })
    const end = toCanvas({ x: 1, y: 1 })
    const cp1 = toCanvas(p1)
    const cp2 = toCanvas(p2)

    ctx.strokeStyle = '#888'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(cp1.x, cp1.y)
    ctx.moveTo(end.x, end.y)
    ctx.lineTo(cp2.x, cp2.y)
    ctx.stroke()

    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y)
    ctx.stroke()

    ctx.fillStyle = '#3b82f6'
    ctx.beginPath()
    ctx.arc(start.x, start.y, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(end.x, end.y, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.arc(cp1.x, cp1.y, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cp2.x, cp2.y, 6, 0, Math.PI * 2)
    ctx.fill()
  }, [size, p1, p2])

  useEffect(() => {
    drawCurve()
  }, [drawCurve])

  const getMousePos = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): Point => {
      const canvas = canvasRef.current
      if (!canvas) return { x: 0, y: 0 }

      const rect = canvas.getBoundingClientRect()
      const padding = 20
      const width = size - padding * 2
      const height = size - padding * 2

      const x = (e.clientX - rect.left - padding) / width
      const y = 1 - (e.clientY - rect.top - padding) / height

      return { x, y }
    },
    [size]
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const pos = getMousePos(e)
      const threshold = 0.1

      const distToP1 = Math.hypot(pos.x - p1.x, pos.y - p1.y)
      const distToP2 = Math.hypot(pos.x - p2.x, pos.y - p2.y)

      if (distToP1 < threshold) {
        setLocalP1(p1)
        setLocalP2(p2)
        setDragging('p1')
      } else if (distToP2 < threshold) {
        setLocalP1(p1)
        setLocalP2(p2)
        setDragging('p2')
      }
    },
    [getMousePos, p1, p2]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!dragging) return

      const pos = getMousePos(e)
      const clampedX = Math.max(0, Math.min(1, pos.x))
      const clampedY = Math.max(-0.5, Math.min(1.5, pos.y))

      if (dragging === 'p1') {
        setLocalP1({ x: clampedX, y: clampedY })
      } else {
        setLocalP2({ x: clampedX, y: clampedY })
      }
    },
    [dragging, getMousePos]
  )

  const handleMouseUp = useCallback(() => {
    if (dragging) {
      onChange({
        type: 'bezier',
        bezier: { x1: localP1.x, y1: localP1.y, x2: localP2.x, y2: localP2.y },
      })
    }
    setDragging(null)
  }, [dragging, localP1, localP2, onChange])

  const handlePresetClick = useCallback(
    (preset: Keyframe['easing']) => {
      onChange(preset)
    },
    [onChange]
  )

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="cursor-crosshair rounded border border-border bg-background"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      <div className="flex flex-wrap gap-1">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset.easing)}
            className={cn(
              'rounded px-2 py-1 text-xs transition-colors',
              easing.type === preset.easing.type && easing.type !== 'bezier'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            )}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground">
        {easing.type === 'bezier' && easing.bezier ? (
          <span>
            cubic-bezier({easing.bezier.x1.toFixed(2)}, {easing.bezier.y1.toFixed(2)},{' '}
            {easing.bezier.x2.toFixed(2)}, {easing.bezier.y2.toFixed(2)})
          </span>
        ) : (
          <span>{easing.type}</span>
        )}
      </div>
    </div>
  )
}

function getPresetPoints(type: Keyframe['easing']['type']): { p1: Point; p2: Point } {
  switch (type) {
    case 'ease-in':
      return { p1: { x: 0.42, y: 0 }, p2: { x: 1, y: 1 } }
    case 'ease-out':
      return { p1: { x: 0, y: 0 }, p2: { x: 0.58, y: 1 } }
    case 'ease-in-out':
      return { p1: { x: 0.42, y: 0 }, p2: { x: 0.58, y: 1 } }
    case 'linear':
    default:
      return { p1: { x: 0, y: 0 }, p2: { x: 1, y: 1 } }
  }
}

export default EasingEditor
