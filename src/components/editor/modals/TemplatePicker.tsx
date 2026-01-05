'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useEditorStore } from '@/store'
import { templates, templateCategories, type Template, type TemplateCategory } from '@/lib/templates'
import { registerObject, generateObjectId } from '@/lib/canvas'
import { Rect, Ellipse, FabricText } from 'fabric'
import type { Canvas as FabricCanvas } from 'fabric'

interface TemplatePickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  canvas: FabricCanvas | null
}

export function TemplatePicker({ open, onOpenChange, canvas }: TemplatePickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const { addObject, addKeyframe, setDuration, setFrameRate, clearObjects, clearKeyframes } =
    useEditorStore()

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'all') return templates
    return templates.filter((t) => t.category === selectedCategory)
  }, [selectedCategory])

  const handleApplyTemplate = useCallback(
    (template: Template) => {
      if (!canvas) return

      clearObjects()
      clearKeyframes()
      canvas.clear()
      canvas.set('backgroundColor', '#ffffff')

      setDuration(template.duration)
      setFrameRate(template.frameRate)

      const idMap = new Map<string, string>()

      template.objects.forEach((obj) => {
        const newId = generateObjectId()
        idMap.set(obj.localId, newId)

        let fabricObj

        if (obj.type === 'rect') {
          fabricObj = new Rect({
            left: obj.left,
            top: obj.top,
            width: obj.width,
            height: obj.height,
            fill: obj.fill ?? '#000000',
            stroke: obj.stroke,
            strokeWidth: obj.strokeWidth ?? 0,
            rx: obj.rx ?? 0,
            ry: obj.ry ?? 0,
            opacity: obj.opacity ?? 1,
            scaleX: obj.scaleX ?? 1,
            scaleY: obj.scaleY ?? 1,
            angle: obj.angle ?? 0,
          })
        } else if (obj.type === 'ellipse') {
          fabricObj = new Ellipse({
            left: obj.left,
            top: obj.top,
            rx: (obj.width ?? 100) / 2,
            ry: (obj.height ?? 100) / 2,
            fill: obj.fill ?? '#000000',
            stroke: obj.stroke,
            strokeWidth: obj.strokeWidth ?? 0,
            opacity: obj.opacity ?? 1,
            scaleX: obj.scaleX ?? 1,
            scaleY: obj.scaleY ?? 1,
            angle: obj.angle ?? 0,
          })
        } else if (obj.type === 'text') {
          fabricObj = new FabricText(obj.text ?? 'Text', {
            left: obj.left,
            top: obj.top,
            fontSize: obj.fontSize ?? 24,
            fontFamily: obj.fontFamily ?? 'sans-serif',
            fill: obj.fill ?? '#000000',
            opacity: obj.opacity ?? 1,
          })
        }

        if (fabricObj) {
          registerObject(fabricObj, newId, obj.type)
          canvas.add(fabricObj)

          addObject({
            id: newId,
            name: obj.name,
            type: obj.type,
            visible: obj.visible,
            locked: obj.locked,
            left: obj.left,
            top: obj.top,
            width: obj.width,
            height: obj.height,
            scaleX: obj.scaleX ?? 1,
            scaleY: obj.scaleY ?? 1,
            angle: obj.angle ?? 0,
            opacity: obj.opacity ?? 1,
          })
        }
      })

      template.keyframes.forEach((kf) => {
        const objectId = idMap.get(kf.localObjectId)
        if (objectId) {
          addKeyframe({
            id: generateObjectId(),
            objectId,
            frame: kf.frame,
            property: kf.property,
            value: kf.value,
            easing: kf.easing,
          })
        }
      })

      canvas.requestRenderAll()
      onOpenChange(false)
      setSelectedTemplate(null)
    },
    [canvas, addObject, addKeyframe, setDuration, setFrameRate, clearObjects, clearKeyframes, onOpenChange]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden bg-[#141414] border-[#262626]">
        <DialogHeader>
          <DialogTitle className="text-[#fafafa]">Start from Template</DialogTitle>
          <DialogDescription className="text-[#a1a1aa]">
            Choose a template to quickly get started with your animation
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 mt-2">
          <div className="w-36 shrink-0">
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#3b82f6] text-white'
                    : 'text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-[#fafafa]'
                }`}
              >
                All Templates
              </button>
              {templateCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as TemplateCategory)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? 'bg-[#3b82f6] text-white'
                      : 'text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-[#fafafa]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[400px] pr-2">
            <div className="grid grid-cols-2 gap-3">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`
                    p-4 rounded-lg border text-left transition-all
                    ${
                      selectedTemplate?.id === template.id
                        ? 'border-[#3b82f6] bg-[#1e3a5f]/30'
                        : 'border-[#3f3f46] bg-[#1a1a1a] hover:border-[#52525b]'
                    }
                  `}
                >
                  <div className="text-3xl mb-2">{template.thumbnail}</div>
                  <h3 className="font-medium text-[#fafafa] text-sm">{template.name}</h3>
                  <p className="text-xs text-[#71717a] mt-1 line-clamp-2">{template.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] bg-[#262626] text-[#a1a1aa] px-1.5 py-0.5 rounded">
                      {template.duration / template.frameRate}s
                    </span>
                    <span className="text-[10px] bg-[#262626] text-[#a1a1aa] px-1.5 py-0.5 rounded">
                      {template.objects.length} layer{template.objects.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-[#262626]">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-[#a1a1aa]">
            Cancel
          </Button>
          <Button
            onClick={() => selectedTemplate && handleApplyTemplate(selectedTemplate)}
            disabled={!selectedTemplate}
            className="bg-[#3b82f6] text-white hover:bg-[#3b82f6]/90 disabled:opacity-50"
          >
            Use Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
