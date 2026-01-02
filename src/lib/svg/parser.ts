import {
  SUPPORTED_SVG_ELEMENTS,
  UNSUPPORTED_SVG_FEATURES,
  type SVGParseResult,
  type SVGMetadata,
} from './types'

const MAX_FILE_SIZE = 5 * 1024 * 1024

export function parseSVGString(svgString: string): SVGParseResult {
  const errors: string[] = []
  const unsupportedFeatures: string[] = []

  if (!svgString || svgString.trim().length === 0) {
    return {
      success: false,
      svgElement: null,
      metadata: createEmptyMetadata(),
      errors: ['SVG content is empty'],
    }
  }

  if (svgString.length > MAX_FILE_SIZE) {
    return {
      success: false,
      svgElement: null,
      metadata: createEmptyMetadata(),
      errors: [`SVG file exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB`],
    }
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(svgString, 'image/svg+xml')

  const parserError = doc.querySelector('parsererror')
  if (parserError) {
    return {
      success: false,
      svgElement: null,
      metadata: createEmptyMetadata(),
      errors: ['Invalid SVG: ' + parserError.textContent?.slice(0, 200)],
    }
  }

  const svgElement = doc.querySelector('svg')
  if (!svgElement) {
    return {
      success: false,
      svgElement: null,
      metadata: createEmptyMetadata(),
      errors: ['No SVG element found in the document'],
    }
  }

  for (const feature of UNSUPPORTED_SVG_FEATURES) {
    const elements = svgElement.querySelectorAll(feature)
    if (elements.length > 0) {
      unsupportedFeatures.push(feature)
    }
  }

  const metadata = extractMetadata(svgElement, unsupportedFeatures)

  return {
    success: true,
    svgElement,
    metadata,
    errors,
  }
}

export async function parseSVGFile(file: File): Promise<SVGParseResult> {
  if (!file.type.includes('svg') && !file.name.endsWith('.svg')) {
    return {
      success: false,
      svgElement: null,
      metadata: createEmptyMetadata(),
      errors: ['File is not an SVG'],
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      svgElement: null,
      metadata: createEmptyMetadata(),
      errors: [`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum of 5MB`],
    }
  }

  try {
    const content = await file.text()
    return parseSVGString(content)
  } catch {
    return {
      success: false,
      svgElement: null,
      metadata: createEmptyMetadata(),
      errors: ['Failed to read SVG file'],
    }
  }
}

function extractMetadata(
  svgElement: SVGSVGElement,
  unsupportedFeatures: string[]
): SVGMetadata {
  const width = parseFloat(svgElement.getAttribute('width') || '') || null
  const height = parseFloat(svgElement.getAttribute('height') || '') || null
  const viewBox = svgElement.getAttribute('viewBox')

  let elementCount = 0
  for (const tag of SUPPORTED_SVG_ELEMENTS) {
    elementCount += svgElement.querySelectorAll(tag).length
  }

  return {
    width,
    height,
    viewBox,
    elementCount,
    unsupportedFeatures,
  }
}

function createEmptyMetadata(): SVGMetadata {
  return {
    width: null,
    height: null,
    viewBox: null,
    elementCount: 0,
    unsupportedFeatures: [],
  }
}

export function getSVGDimensions(
  svgElement: SVGSVGElement
): { width: number; height: number } {
  const width = parseFloat(svgElement.getAttribute('width') || '')
  const height = parseFloat(svgElement.getAttribute('height') || '')

  if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
    return { width, height }
  }

  const viewBox = svgElement.getAttribute('viewBox')
  if (viewBox) {
    const parts = viewBox.split(/[\s,]+/).map(parseFloat)
    if (parts.length === 4 && !parts.some(isNaN)) {
      return { width: parts[2], height: parts[3] }
    }
  }

  return { width: 100, height: 100 }
}

export function validateSVGForImport(svgString: string): {
  valid: boolean
  warnings: string[]
  errors: string[]
} {
  const result = parseSVGString(svgString)
  const warnings: string[] = []

  if (!result.success) {
    return { valid: false, warnings: [], errors: result.errors }
  }

  if (result.metadata.unsupportedFeatures.length > 0) {
    warnings.push(
      `Unsupported features will be ignored: ${result.metadata.unsupportedFeatures.join(', ')}`
    )
  }

  if (result.metadata.elementCount > 500) {
    warnings.push(
      `Large SVG with ${result.metadata.elementCount} elements may affect performance`
    )
  }

  return { valid: true, warnings, errors: [] }
}
