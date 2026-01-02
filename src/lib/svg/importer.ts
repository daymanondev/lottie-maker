import { loadSVGFromString, type FabricObject } from 'fabric'
import { parseSVGString, getSVGDimensions } from './parser'
import { generateObjectId, registerObject, detectObjectType } from '../canvas/fabric-sync'
import type { SVGImportOptions, SVGImportResult } from './types'

const DEFAULT_IMPORT_OPTIONS: SVGImportOptions = {
  scaleToFit: true,
  maxWidth: 400,
  maxHeight: 400,
  centerOnCanvas: true,
  preserveAspectRatio: true,
}

export async function importSVGString(
  svgString: string,
  options: SVGImportOptions = {}
): Promise<SVGImportResult> {
  const opts = { ...DEFAULT_IMPORT_OPTIONS, ...options }
  const warnings: string[] = []

  const parseResult = parseSVGString(svgString)

  if (!parseResult.success || !parseResult.svgElement) {
    return {
      success: false,
      objects: [],
      warnings: [],
      errors: parseResult.errors,
      metadata: parseResult.metadata,
    }
  }

  if (parseResult.metadata.unsupportedFeatures.length > 0) {
    warnings.push(
      `Unsupported features ignored: ${parseResult.metadata.unsupportedFeatures.join(', ')}`
    )
  }

  try {
    const { objects } = await loadSVGFromString(svgString)
    const validObjects = objects.filter((obj): obj is FabricObject => obj !== null)

    if (validObjects.length === 0) {
      return {
        success: false,
        objects: [],
        warnings,
        errors: ['No valid shapes found in SVG'],
        metadata: parseResult.metadata,
      }
    }

    const svgDimensions = getSVGDimensions(parseResult.svgElement)
    const processedObjects = processImportedObjects(validObjects, svgDimensions, opts)

    for (const obj of processedObjects) {
      const id = generateObjectId()
      const type = detectObjectType(obj)
      registerObject(obj, id, type)
    }

    return {
      success: true,
      objects: processedObjects,
      warnings,
      errors: [],
      metadata: parseResult.metadata,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return {
      success: false,
      objects: [],
      warnings,
      errors: [`Failed to import SVG: ${message}`],
      metadata: parseResult.metadata,
    }
  }
}

export async function importSVGFile(
  file: File,
  options: SVGImportOptions = {}
): Promise<SVGImportResult> {
  try {
    const content = await file.text()
    return importSVGString(content, options)
  } catch {
    return {
      success: false,
      objects: [],
      warnings: [],
      errors: ['Failed to read SVG file'],
      metadata: {
        width: null,
        height: null,
        viewBox: null,
        elementCount: 0,
        unsupportedFeatures: [],
      },
    }
  }
}

function processImportedObjects(
  objects: FabricObject[],
  svgDimensions: { width: number; height: number },
  options: SVGImportOptions
): FabricObject[] {
  const processed: FabricObject[] = []

  for (const obj of objects) {
    if (!obj) continue

    if (options.scaleToFit && options.maxWidth && options.maxHeight) {
      const scale = calculateScaleFactor(
        svgDimensions.width,
        svgDimensions.height,
        options.maxWidth,
        options.maxHeight,
        options.preserveAspectRatio ?? true
      )

      if (scale !== 1) {
        obj.scaleX = (obj.scaleX ?? 1) * scale
        obj.scaleY = (obj.scaleY ?? 1) * scale
        obj.left = (obj.left ?? 0) * scale
        obj.top = (obj.top ?? 0) * scale
      }
    }

    if (options.centerOnCanvas) {
      obj.left = (obj.left ?? 0) + 56
      obj.top = (obj.top ?? 0) + 56
    }

    obj.setCoords()
    processed.push(obj)
  }

  return processed
}

function calculateScaleFactor(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number,
  preserveAspectRatio: boolean
): number {
  if (srcWidth <= maxWidth && srcHeight <= maxHeight) {
    return 1
  }

  if (preserveAspectRatio) {
    return Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
  }

  return Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
}

export function flattenSVGGroup(objects: FabricObject[]): FabricObject[] {
  const result: FabricObject[] = []

  for (const obj of objects) {
    if (obj.type === 'group' && 'getObjects' in obj) {
      const groupObjects = (obj as { getObjects: () => FabricObject[] }).getObjects()
      result.push(...flattenSVGGroup(groupObjects))
    } else {
      result.push(obj)
    }
  }

  return result
}
