'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useEditorStore } from '@/store'
import { Upload, LayoutTemplate, FileJson, Sparkles } from 'lucide-react'
import { importSVGFile, type SVGImportResult } from '@/lib/svg'
import { registerObject, generateObjectId } from '@/lib/canvas'
import type { Canvas as FabricCanvas, FabricObject } from 'fabric'

type StartOption = 'svg' | 'template' | 'lottie' | 'scratch'

interface WelcomeModalProps {
  canvas: FabricCanvas | null
  onOpenTemplatePicker?: () => void
}

export function WelcomeModal({ canvas, onOpenTemplatePicker }: WelcomeModalProps) {
  const { isWelcomeModalOpen, setWelcomeModalOpen, addObject } = useEditorStore()
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lottieInputRef = useRef<HTMLInputElement>(null)

  const handleClose = useCallback(() => {
    setWelcomeModalOpen(false)
  }, [setWelcomeModalOpen])

  const handleOptionClick = useCallback(
    (option: StartOption) => {
      switch (option) {
        case 'svg':
          fileInputRef.current?.click()
          break
        case 'template':
          handleClose()
          onOpenTemplatePicker?.()
          break
        case 'lottie':
          lottieInputRef.current?.click()
          break
        case 'scratch':
          handleClose()
          break
      }
    },
    [handleClose, onOpenTemplatePicker]
  )

  const handleSVGImport = useCallback(
    async (file: File) => {
      if (!canvas) return

      setIsImporting(true)
      const result: SVGImportResult = await importSVGFile(file)

      if (result.success && result.objects.length > 0) {
        result.objects.forEach((fabricObj: FabricObject) => {
          const id = generateObjectId()
          registerObject(fabricObj, id, 'path')
          canvas.add(fabricObj)

          addObject({
            id,
            name: `Layer ${id.slice(-4)}`,
            type: 'path',
            visible: true,
            locked: false,
            left: fabricObj.left ?? 0,
            top: fabricObj.top ?? 0,
            width: fabricObj.width ?? 100,
            height: fabricObj.height ?? 100,
            scaleX: fabricObj.scaleX ?? 1,
            scaleY: fabricObj.scaleY ?? 1,
            angle: fabricObj.angle ?? 0,
            opacity: fabricObj.opacity ?? 1,
          })
        })
        canvas.requestRenderAll()
        handleClose()
      }

      setIsImporting(false)
    },
    [canvas, addObject, handleClose]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleSVGImport(file)
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [handleSVGImport]
  )

  const handleLottieImport = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const json = JSON.parse(text)
        if (json.v && json.layers) {
          console.log('Valid Lottie file detected:', json.nm || 'Unnamed')
          handleClose()
        }
      } catch {
        console.error('Invalid Lottie file')
      }

      if (lottieInputRef.current) {
        lottieInputRef.current.value = ''
      }
    },
    [handleClose]
  )

  const options: Array<{
    id: StartOption
    icon: React.ReactNode
    title: string
    description: string
    disabled?: boolean
  }> = [
    {
      id: 'svg',
      icon: <Upload className="h-6 w-6" />,
      title: 'Import SVG',
      description: 'Start with your own vector graphics',
    },
    {
      id: 'template',
      icon: <LayoutTemplate className="h-6 w-6" />,
      title: 'Start from Template',
      description: 'Choose from pre-built animations',
    },
    {
      id: 'lottie',
      icon: <FileJson className="h-6 w-6" />,
      title: 'Open Lottie',
      description: 'Edit an existing Lottie file',
      disabled: true,
    },
    {
      id: 'scratch',
      icon: <Sparkles className="h-6 w-6" />,
      title: 'Start from Scratch',
      description: 'Create with basic shapes',
    },
  ]

  return (
    <Dialog open={isWelcomeModalOpen} onOpenChange={setWelcomeModalOpen}>
      <DialogContent
        className="sm:max-w-[520px] bg-[#141414] border-[#262626]"
        showCloseButton={false}
      >
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-xl font-semibold text-[#fafafa]">
            Welcome to Lottie Maker
          </DialogTitle>
          <DialogDescription className="text-[#a1a1aa]">
            Create beautiful animations for your apps and websites
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={isImporting || option.disabled}
              className={`
                flex flex-col items-center gap-3 p-5 rounded-lg
                border border-[#3f3f46] bg-[#1a1a1a]
                transition-all duration-200
                ${
                  option.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-[#3b82f6] hover:bg-[#1e3a5f]/20 cursor-pointer'
                }
                focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 focus:ring-offset-[#141414]
              `}
            >
              <div
                className={`
                flex h-12 w-12 items-center justify-center rounded-full
                ${option.disabled ? 'bg-[#262626] text-[#52525b]' : 'bg-[#262626] text-[#3b82f6]'}
              `}
              >
                {option.icon}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#fafafa]">{option.title}</p>
                <p className="mt-1 text-xs text-[#71717a]">{option.description}</p>
              </div>
              {option.disabled && (
                <span className="text-[10px] uppercase tracking-wider text-[#52525b] bg-[#262626] px-2 py-0.5 rounded">
                  Coming Soon
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button variant="ghost" onClick={handleClose} className="text-[#71717a] hover:text-[#a1a1aa]">
            Skip for now
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,image/svg+xml"
          onChange={handleFileSelect}
          className="hidden"
        />
        <input
          ref={lottieInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleLottieImport}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  )
}
