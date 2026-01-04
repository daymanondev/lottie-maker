'use client'

import { useCallback, useState } from 'react'
import { useEditorStore } from '@/store'
import { getAllRegisteredObjects, getRegisteredObject } from '@/lib/canvas'
import { validateLottie, formatValidationErrors, type ValidationResult } from '@/lib/lottie'
import { getEasingHandles } from '@/lib/animation'
import type { LottieAnimation, LottieLayer, LottieShape, LottieKeyframe, Keyframe } from '@/types'

export interface ExportOptions {
  name?: string
  width?: number
  height?: number
  validate?: boolean
}

export interface ExportResult {
  success: boolean
  json?: LottieAnimation
  error?: string
  validation?: ValidationResult
}

export function useLottieExport() {
  const { duration, frameRate, keyframes } = useEditorStore()
  const [isExporting, setIsExporting] = useState(false)
  const [lastExportError, setLastExportError] = useState<string | null>(null)
  const [lastValidation, setLastValidation] = useState<ValidationResult | null>(null)

  const generateLottieJson = useCallback(
    (options: ExportOptions = {}): LottieAnimation => {
      const registeredObjects = getAllRegisteredObjects()

      const layers: LottieLayer[] = registeredObjects.map((synced, index) => {
        const obj = synced.fabricObject
        const objectKeyframes = keyframes.filter((kf) => kf.objectId === synced.id)

        const hasPositionKeyframes = objectKeyframes.some((kf) => kf.property === 'position')
        const hasScaleKeyframes = objectKeyframes.some((kf) => kf.property === 'scale')
        const hasRotationKeyframes = objectKeyframes.some((kf) => kf.property === 'rotation')
        const hasOpacityKeyframes = objectKeyframes.some((kf) => kf.property === 'opacity')

        const layer: LottieLayer = {
          ty: 4,
          nm: synced.id,
          ind: index,
          ip: 0,
          op: duration,
          ks: {
            p: {
              a: hasPositionKeyframes ? 1 : 0,
              k: hasPositionKeyframes
                ? buildKeyframeArray(objectKeyframes, 'position')
                : [obj.left ?? 0, obj.top ?? 0],
            },
            s: {
              a: hasScaleKeyframes ? 1 : 0,
              k: hasScaleKeyframes
                ? buildKeyframeArray(objectKeyframes, 'scale')
                : [(obj.scaleX ?? 1) * 100, (obj.scaleY ?? 1) * 100],
            },
            r: {
              a: hasRotationKeyframes ? 1 : 0,
              k: hasRotationKeyframes
                ? buildKeyframeArray(objectKeyframes, 'rotation')
                : (obj.angle ?? 0),
            },
            o: {
              a: hasOpacityKeyframes ? 1 : 0,
              k: hasOpacityKeyframes
                ? buildKeyframeArray(objectKeyframes, 'opacity')
                : (obj.opacity ?? 1) * 100,
            },
            a: { a: 0, k: [0, 0] },
          },
          shapes: buildShapes(synced),
        }
        return layer
      })

      return {
        v: '5.5.7',
        fr: frameRate,
        ip: 0,
        op: duration,
        w: options.width ?? 512,
        h: options.height ?? 512,
        nm: options.name ?? 'Animation',
        layers,
      }
    },
    [duration, frameRate, keyframes]
  )

  const exportToJson = useCallback(
    async (options: ExportOptions = {}): Promise<ExportResult> => {
      setIsExporting(true)
      setLastExportError(null)
      setLastValidation(null)

      try {
        const json = generateLottieJson(options)

        if (options.validate !== false) {
          const validation = validateLottie(json)
          setLastValidation(validation)

          if (!validation.valid) {
            const errorMessage = formatValidationErrors(validation.errors)
            setLastExportError(errorMessage)
            return { success: false, json, error: errorMessage, validation }
          }
        }

        return { success: true, json }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Export failed'
        setLastExportError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsExporting(false)
      }
    },
    [generateLottieJson]
  )

  const downloadJson = useCallback(
    async (filename = 'animation.json', options: ExportOptions = {}): Promise<boolean> => {
      const result = await exportToJson(options)

      if (!result.success || !result.json) {
        return false
      }

      const blob = new Blob([JSON.stringify(result.json, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename.endsWith('.json') ? filename : `${filename}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return true
    },
    [exportToJson]
  )

  const copyToClipboard = useCallback(
    async (options: ExportOptions = {}): Promise<boolean> => {
      const result = await exportToJson(options)

      if (!result.success || !result.json) {
        return false
      }

      try {
        await navigator.clipboard.writeText(JSON.stringify(result.json, null, 2))
        return true
      } catch {
        return false
      }
    },
    [exportToJson]
  )

  return {
    isExporting,
    lastExportError,
    lastValidation,
    generateLottieJson,
    exportToJson,
    downloadJson,
    copyToClipboard,
  }
}

function buildKeyframeArray(
  keyframes: Keyframe[],
  property: 'position' | 'scale' | 'rotation' | 'opacity'
): LottieKeyframe[] {
  const filtered = keyframes.filter((kf) => kf.property === property)
  const sorted = filtered.sort((a, b) => a.frame - b.frame)

  return sorted.map((kf, index) => {
    const isLast = index === sorted.length - 1
    const value = Array.isArray(kf.value) ? kf.value : [kf.value]

    if (isLast) {
      return { t: kf.frame, s: value }
    }

    const handles = getEasingHandles(kf.easing)
    return {
      t: kf.frame,
      s: value,
      o: handles.o,
      i: handles.i,
    }
  })
}

function buildShapes(synced: ReturnType<typeof getRegisteredObject>): LottieShape[] {
  if (!synced) return []

  const shapes: LottieShape[] = []

  switch (synced.type) {
    case 'rect':
      shapes.push({ ty: 'rc', nm: 'Rectangle' })
      break
    case 'ellipse':
      shapes.push({ ty: 'el', nm: 'Ellipse' })
      break
    case 'path':
      shapes.push({ ty: 'sh', nm: 'Path' })
      break
    default:
      shapes.push({ ty: 'sh', nm: 'Shape' })
  }

  return shapes
}
