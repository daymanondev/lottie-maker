import type { FabricObject } from 'fabric'

export interface SVGImportOptions {
  scaleToFit?: boolean
  maxWidth?: number
  maxHeight?: number
  centerOnCanvas?: boolean
  preserveAspectRatio?: boolean
}

export interface SVGImportResult {
  success: boolean
  objects: FabricObject[]
  warnings: string[]
  errors: string[]
  metadata: SVGMetadata
}

export interface SVGMetadata {
  width: number | null
  height: number | null
  viewBox: string | null
  elementCount: number
  unsupportedFeatures: string[]
}

export interface SVGParseResult {
  success: boolean
  svgElement: SVGSVGElement | null
  metadata: SVGMetadata
  errors: string[]
}

export const SUPPORTED_SVG_ELEMENTS = [
  'rect',
  'circle',
  'ellipse',
  'line',
  'polyline',
  'polygon',
  'path',
  'text',
  'g',
] as const

export const UNSUPPORTED_SVG_FEATURES = [
  'mask',
  'clipPath',
  'filter',
  'image',
  'use',
  'symbol',
  'pattern',
  'linearGradient',
  'radialGradient',
] as const

export type SupportedSVGElement = (typeof SUPPORTED_SVG_ELEMENTS)[number]
export type UnsupportedSVGFeature = (typeof UNSUPPORTED_SVG_FEATURES)[number]
