'use client'

import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { useEditorStore } from '@/store'
import { getRegisteredObject } from '@/lib/canvas'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Move,
  Scale,
  RotateCw,
  Droplet,
  PaintBucket,
  Minus,
  MousePointer,
} from 'lucide-react'
import type { CanvasObject } from '@/types'
import type { FabricObject } from 'fabric'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label: string
  disabled?: boolean
}

function NumberInput({
  value,
  onChange,
  min = -9999,
  max = 9999,
  step = 1,
  label,
  disabled,
}: NumberInputProps) {
  const [localValue, setLocalValue] = useState(String(Math.round(value * 100) / 100))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLocalValue(String(Math.round(value * 100) / 100))
  }, [value])

  const handleBlur = () => {
    const num = parseFloat(localValue)
    if (!isNaN(num)) {
      onChange(Math.max(min, Math.min(max, num)))
    } else {
      setLocalValue(String(value))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur()
    } else if (e.key === 'Escape') {
      setLocalValue(String(value))
      inputRef.current?.blur()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      onChange(Math.min(max, value + step))
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      onChange(Math.max(min, value - step))
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[10px] uppercase text-[#71717a]">{label}</Label>
      <Input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="h-8 bg-[#1a1a1a] border-[#262626] text-xs text-[#fafafa] focus:border-[#3b82f6] focus:ring-0"
      />
    </div>
  )
}

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label: string
  disabled?: boolean
}

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  '#71717a', '#262626', '#dc2626', '#ea580c', '#ca8a04',
  '#16a34a', '#0d9488', '#2563eb', '#7c3aed', '#db2777',
]

function ColorPicker({ color, onChange, label, disabled }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[10px] uppercase text-[#71717a]">{label}</Label>
      <Popover>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            className="flex h-8 w-full items-center gap-2 rounded-md border border-[#262626] bg-[#1a1a1a] px-2 hover:border-[#3b82f6] transition-colors disabled:opacity-50"
            disabled={disabled}
          >
            <div
              className="h-4 w-4 rounded border border-[#404040]"
              style={{ backgroundColor: color }}
            />
            <span className="flex-1 text-left text-xs text-[#a1a1aa] uppercase">
              {color}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] bg-[#1a1a1a] border-[#262626] p-3" align="start">
          <div className="grid grid-cols-5 gap-2">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                className={`h-8 w-8 rounded border transition-all ${
                  color === presetColor
                    ? 'border-[#3b82f6] ring-1 ring-[#3b82f6]'
                    : 'border-[#404040] hover:border-[#71717a]'
                }`}
                style={{ backgroundColor: presetColor }}
                onClick={() => onChange(presetColor)}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border-none bg-transparent"
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="h-8 flex-1 bg-[#0a0a0a] border-[#262626] text-xs text-[#fafafa] uppercase"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface PropertySectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

function PropertySection({ title, icon, children }: PropertySectionProps) {
  return (
    <div className="border-b border-[#262626] px-4 py-3">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[#71717a]">{icon}</span>
        <span className="text-xs font-medium text-[#a1a1aa]">{title}</span>
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  )
}

export function PropertiesPanel() {
  const { objects, selectedIds, updateObject } = useEditorStore()

  const selectedObject = selectedIds.length === 1
    ? objects.find((obj) => obj.id === selectedIds[0])
    : null

  const initialProps = useMemo(() => {
    if (!selectedObject) {
      return {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        opacity: 1,
        fill: '#000000',
        stroke: '#000000',
        strokeWidth: 0,
      }
    }

    const synced = getRegisteredObject(selectedObject.id)
    if (!synced) {
      return {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        opacity: 1,
        fill: '#000000',
        stroke: '#000000',
        strokeWidth: 0,
      }
    }

    const fabricObj = synced.fabricObject
    return {
      left: fabricObj.left ?? 0,
      top: fabricObj.top ?? 0,
      width: (fabricObj.width ?? 0) * (fabricObj.scaleX ?? 1),
      height: (fabricObj.height ?? 0) * (fabricObj.scaleY ?? 1),
      scaleX: fabricObj.scaleX ?? 1,
      scaleY: fabricObj.scaleY ?? 1,
      angle: fabricObj.angle ?? 0,
      opacity: fabricObj.opacity ?? 1,
      fill: (fabricObj.fill as string) ?? '#000000',
      stroke: (fabricObj.stroke as string) ?? '#000000',
      strokeWidth: fabricObj.strokeWidth ?? 0,
    }
  }, [selectedObject])

  const [localProps, setLocalProps] = useState(initialProps)
  
  const prevSelectedIdRef = useRef<string | null>(null)
  if (selectedObject?.id !== prevSelectedIdRef.current) {
    prevSelectedIdRef.current = selectedObject?.id ?? null
    if (selectedObject) {
      setLocalProps(initialProps)
    }
  }

  const updateFabricObject = useCallback(
    (props: Partial<Record<string, unknown>>) => {
      if (!selectedObject) return

      const synced = getRegisteredObject(selectedObject.id)
      if (synced) {
        synced.fabricObject.set(props as Partial<FabricObject>)
        synced.fabricObject.setCoords()
        synced.fabricObject.canvas?.requestRenderAll()
      }
      updateObject(selectedObject.id, props as Partial<CanvasObject>)
    },
    [selectedObject, updateObject]
  )

  const handlePositionChange = useCallback(
    (axis: 'left' | 'top', value: number) => {
      setLocalProps((prev) => ({ ...prev, [axis]: value }))
      updateFabricObject({ [axis]: value })
    },
    [updateFabricObject]
  )

  const handleSizeChange = useCallback(
    (dimension: 'width' | 'height', value: number) => {
      if (!selectedObject) return

      const synced = getRegisteredObject(selectedObject.id)
      if (!synced) return

      const fabricObj = synced.fabricObject
      const baseWidth = fabricObj.width ?? 1
      const baseHeight = fabricObj.height ?? 1

      if (dimension === 'width') {
        const newScaleX = value / baseWidth
        setLocalProps((prev) => ({ ...prev, width: value, scaleX: newScaleX }))
        updateFabricObject({ scaleX: newScaleX })
      } else {
        const newScaleY = value / baseHeight
        setLocalProps((prev) => ({ ...prev, height: value, scaleY: newScaleY }))
        updateFabricObject({ scaleY: newScaleY })
      }
    },
    [selectedObject, updateFabricObject]
  )

  const handleRotationChange = useCallback(
    (value: number) => {
      setLocalProps((prev) => ({ ...prev, angle: value }))
      updateFabricObject({ angle: value })
    },
    [updateFabricObject]
  )

  const handleOpacityChange = useCallback(
    (value: number) => {
      setLocalProps((prev) => ({ ...prev, opacity: value }))
      updateFabricObject({ opacity: value })
    },
    [updateFabricObject]
  )

  const handleFillChange = useCallback(
    (value: string) => {
      setLocalProps((prev) => ({ ...prev, fill: value }))
      updateFabricObject({ fill: value })
    },
    [updateFabricObject]
  )

  const handleStrokeChange = useCallback(
    (value: string) => {
      setLocalProps((prev) => ({ ...prev, stroke: value }))
      updateFabricObject({ stroke: value })
    },
    [updateFabricObject]
  )

  const handleStrokeWidthChange = useCallback(
    (value: number) => {
      setLocalProps((prev) => ({ ...prev, strokeWidth: value }))
      updateFabricObject({ strokeWidth: value })
    },
    [updateFabricObject]
  )

  if (!selectedObject) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-10 items-center border-b border-[#262626] px-4">
          <span className="text-sm font-medium text-[#fafafa]">Properties</span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <MousePointer className="mb-3 h-8 w-8 text-[#3f3f46]" />
          <p className="text-xs text-[#71717a]">No object selected</p>
          <p className="mt-1 text-xs text-[#52525b]">Select an object to edit its properties</p>
        </div>
      </div>
    )
  }

  const isLocked = selectedObject.locked

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 items-center justify-between border-b border-[#262626] px-4">
        <span className="text-sm font-medium text-[#fafafa]">Properties</span>
        <span className="text-xs text-[#71717a] capitalize">{selectedObject.type}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PropertySection title="Position" icon={<Move className="h-3.5 w-3.5" />}>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="X"
              value={localProps.left}
              onChange={(v) => handlePositionChange('left', v)}
              disabled={isLocked}
            />
            <NumberInput
              label="Y"
              value={localProps.top}
              onChange={(v) => handlePositionChange('top', v)}
              disabled={isLocked}
            />
          </div>
        </PropertySection>

        <PropertySection title="Size" icon={<Scale className="h-3.5 w-3.5" />}>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              label="W"
              value={localProps.width}
              onChange={(v) => handleSizeChange('width', v)}
              min={1}
              disabled={isLocked}
            />
            <NumberInput
              label="H"
              value={localProps.height}
              onChange={(v) => handleSizeChange('height', v)}
              min={1}
              disabled={isLocked}
            />
          </div>
        </PropertySection>

        <PropertySection title="Rotation" icon={<RotateCw className="h-3.5 w-3.5" />}>
          <div className="flex items-center gap-3">
            <Slider
              value={[localProps.angle]}
              onValueChange={([v]) => handleRotationChange(v)}
              min={0}
              max={360}
              step={1}
              disabled={isLocked}
              className="flex-1"
            />
            <div className="w-16">
              <NumberInput
                label="°"
                value={localProps.angle}
                onChange={handleRotationChange}
                min={0}
                max={360}
                disabled={isLocked}
              />
            </div>
          </div>
        </PropertySection>

        <PropertySection title="Opacity" icon={<Droplet className="h-3.5 w-3.5" />}>
          <div className="flex items-center gap-3">
            <Slider
              value={[localProps.opacity * 100]}
              onValueChange={([v]) => handleOpacityChange(v / 100)}
              min={0}
              max={100}
              step={1}
              disabled={isLocked}
              className="flex-1"
            />
            <span className="w-10 text-right text-xs text-[#a1a1aa]">
              {Math.round(localProps.opacity * 100)}%
            </span>
          </div>
        </PropertySection>

        <PropertySection title="Fill" icon={<PaintBucket className="h-3.5 w-3.5" />}>
          <ColorPicker
            label="Color"
            color={localProps.fill}
            onChange={handleFillChange}
            disabled={isLocked}
          />
        </PropertySection>

        <PropertySection title="Stroke" icon={<Minus className="h-3.5 w-3.5" />}>
          <ColorPicker
            label="Color"
            color={localProps.stroke}
            onChange={handleStrokeChange}
            disabled={isLocked}
          />
          <NumberInput
            label="Width"
            value={localProps.strokeWidth}
            onChange={handleStrokeWidthChange}
            min={0}
            max={100}
            step={1}
            disabled={isLocked}
          />
        </PropertySection>
      </div>
    </div>
  )
}
