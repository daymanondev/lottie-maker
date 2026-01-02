'use client'

import { useRef, useEffect, useCallback, useState, useMemo } from 'react'
import lottie, { AnimationItem } from 'lottie-web'
import { useEditorStore } from '@/store'
import { useLottieExport } from '@/hooks'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertCircle, Maximize2, Minimize2 } from 'lucide-react'

interface LottiePreviewProps {
  className?: string
}

export function LottiePreview({ className = '' }: LottiePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationItem | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const { currentFrame, duration, frameRate, isPlaying } = useEditorStore()
  const { generateLottieJson } = useLottieExport()

  const { animationData, error } = useMemo(() => {
    try {
      const json = generateLottieJson({ validate: false })
      return { animationData: json, error: null }
    } catch (err) {
      return {
        animationData: null,
        error: err instanceof Error ? err.message : 'Failed to generate preview',
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- refreshKey is intentionally used to force re-computation
  }, [generateLottieJson, refreshKey])

  const refreshPreview = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !animationData) return

    if (animationRef.current) {
      animationRef.current.destroy()
      animationRef.current = null
    }

    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData,
    })

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy()
        animationRef.current = null
      }
    }
  }, [animationData])

  useEffect(() => {
    if (!animationRef.current) return

    const totalFrames = animationRef.current.totalFrames
    const frame = Math.min(currentFrame, totalFrames - 1)
    animationRef.current.goToAndStop(frame, true)
  }, [currentFrame])

  useEffect(() => {
    if (!animationRef.current) return

    if (isPlaying) {
      animationRef.current.goToAndPlay(currentFrame, true)
    } else {
      animationRef.current.goToAndStop(currentFrame, true)
    }
  }, [isPlaying, currentFrame])

  return (
    <div className={`flex h-full flex-col ${className}`}>
      <div className="flex h-10 items-center justify-between border-b border-[#262626] px-4">
        <span className="text-sm font-medium text-[#fafafa]">Preview</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-[#a1a1aa] hover:text-[#fafafa]"
            onClick={refreshPreview}
            title="Refresh preview"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-[#a1a1aa] hover:text-[#fafafa]"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Minimize' : 'Maximize'}
          >
            {isExpanded ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#0a0a0a] p-4">
        {error ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="max-w-[200px] text-xs text-[#a1a1aa]">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 h-7 text-xs"
              onClick={refreshPreview}
            >
              Retry
            </Button>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="aspect-square w-full max-w-[240px] rounded-lg border border-[#262626] bg-white"
            style={{
              maxHeight: isExpanded ? '400px' : '200px',
              maxWidth: isExpanded ? '400px' : '200px',
            }}
          />
        )}
      </div>

      <div className="flex h-8 items-center justify-between border-t border-[#262626] px-4 text-xs text-[#71717a]">
        <span>
          Frame {currentFrame}/{duration}
        </span>
        <span>{frameRate}fps</span>
      </div>
    </div>
  )
}
