'use client'

import { useCallback, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileWarning, CheckCircle2, Loader2 } from 'lucide-react'
import { importSVGFile, type SVGImportResult } from '@/lib/svg'

interface SVGImportProps {
  onImportSuccess: (result: SVGImportResult) => void
  onImportError?: (errors: string[]) => void
  className?: string
  compact?: boolean
}

type ImportStatus = 'idle' | 'loading' | 'success' | 'error'

export function SVGImport({
  onImportSuccess,
  onImportError,
  className = '',
  compact = false,
}: SVGImportProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [status, setStatus] = useState<ImportStatus>('idle')
  const [message, setMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImport = useCallback(
    async (file: File) => {
      setStatus('loading')
      setMessage('Importing SVG...')

      const result = await importSVGFile(file)

      if (result.success) {
        setStatus('success')
        setMessage(`Imported ${result.objects.length} shape${result.objects.length !== 1 ? 's' : ''}`)
        onImportSuccess(result)

        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 2000)
      } else {
        setStatus('error')
        setMessage(result.errors[0] || 'Import failed')
        onImportError?.(result.errors)

        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 3000)
      }
    },
    [onImportSuccess, onImportError]
  )

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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      const svgFile = files.find(
        (f) => f.type === 'image/svg+xml' || f.name.endsWith('.svg')
      )

      if (svgFile) {
        handleImport(svgFile)
      } else if (files.length > 0) {
        setStatus('error')
        setMessage('Please drop an SVG file')
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 2000)
      }
    },
    [handleImport]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleImport(file)
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [handleImport]
  )

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin text-[#3b82f6]" />
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-[#22c55e]" />
      case 'error':
        return <FileWarning className="h-5 w-5 text-[#ef4444]" />
      default:
        return <Upload className={`h-5 w-5 ${isDragOver ? 'text-[#3b82f6]' : 'text-[#71717a]'}`} />
    }
  }

  if (compact) {
    return (
      <div className={className}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,image/svg+xml"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={status === 'loading'}
          className="gap-2 border-[#3f3f46] bg-[#1a1a1a] hover:bg-[#262626] hover:border-[#52525b]"
        >
          {getStatusIcon()}
          <span className="text-[#a1a1aa]">
            {status === 'loading' ? 'Importing...' : 'Import SVG'}
          </span>
        </Button>
      </div>
    )
  }

  return (
    <div
      className={`
        relative rounded-lg border-2 border-dashed p-6
        transition-all duration-200 cursor-pointer
        ${isDragOver
          ? 'border-[#3b82f6] bg-[#3b82f6]/10 scale-[1.01]'
          : 'border-[#3f3f46] bg-[#141414]/50 hover:border-[#52525b] hover:bg-[#1a1a1a]'
        }
        ${className}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-3">
        <div
          className={`
            flex h-12 w-12 items-center justify-center rounded-full
            transition-colors duration-200
            ${isDragOver ? 'bg-[#3b82f6]/20' : 'bg-[#262626]'}
          `}
        >
          {getStatusIcon()}
        </div>

        <div className="text-center">
          {status === 'idle' ? (
            <>
              <p className="text-sm font-medium text-[#fafafa]">
                {isDragOver ? 'Drop SVG here' : 'Import SVG'}
              </p>
              <p className="mt-1 text-xs text-[#71717a]">
                Drop a file or click to browse
              </p>
            </>
          ) : (
            <p
              className={`text-sm font-medium ${
                status === 'success'
                  ? 'text-[#22c55e]'
                  : status === 'error'
                    ? 'text-[#ef4444]'
                    : 'text-[#a1a1aa]'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
