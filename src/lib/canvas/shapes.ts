import { Rect, Circle, Ellipse, Path, IText, Group, type FabricObject } from 'fabric'
import type { FabricObjectType } from './types'
import { generateObjectId, registerObject } from './fabric-sync'

export interface ShapeOptions {
  left?: number
  top?: number
  width?: number
  height?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  opacity?: number
  rx?: number
  ry?: number
}

export function createRect(options: ShapeOptions = {}): { object: Rect; id: string } {
  const id = generateObjectId()
  const rect = new Rect({
    left: options.left ?? 100,
    top: options.top ?? 100,
    width: options.width ?? 100,
    height: options.height ?? 100,
    fill: options.fill ?? '#3498db',
    stroke: options.stroke ?? '#2980b9',
    strokeWidth: options.strokeWidth ?? 2,
    rx: options.rx ?? 0,
    ry: options.ry ?? 0,
    opacity: options.opacity ?? 1,
  })
  registerObject(rect, id, 'rect')
  return { object: rect, id }
}

export function createEllipse(options: ShapeOptions = {}): { object: Ellipse; id: string } {
  const id = generateObjectId()
  const ellipse = new Ellipse({
    left: options.left ?? 100,
    top: options.top ?? 100,
    rx: (options.width ?? 100) / 2,
    ry: (options.height ?? 80) / 2,
    fill: options.fill ?? '#9b59b6',
    stroke: options.stroke ?? '#8e44ad',
    strokeWidth: options.strokeWidth ?? 2,
    opacity: options.opacity ?? 1,
  })
  registerObject(ellipse, id, 'ellipse')
  return { object: ellipse, id }
}

export function createCircle(options: ShapeOptions & { radius?: number } = {}): {
  object: Circle
  id: string
} {
  const id = generateObjectId()
  const circle = new Circle({
    left: options.left ?? 100,
    top: options.top ?? 100,
    radius: options.radius ?? 50,
    fill: options.fill ?? '#e74c3c',
    stroke: options.stroke ?? '#c0392b',
    strokeWidth: options.strokeWidth ?? 2,
    opacity: options.opacity ?? 1,
  })
  registerObject(circle, id, 'ellipse')
  return { object: circle, id }
}

export function createPath(
  pathData: string,
  options: ShapeOptions = {}
): { object: Path; id: string } {
  const id = generateObjectId()
  const path = new Path(pathData, {
    left: options.left ?? 100,
    top: options.top ?? 100,
    fill: options.fill ?? '#2ecc71',
    stroke: options.stroke ?? '#27ae60',
    strokeWidth: options.strokeWidth ?? 2,
    opacity: options.opacity ?? 1,
  })
  registerObject(path, id, 'path')
  return { object: path, id }
}

export function createText(
  text: string,
  options: ShapeOptions & { fontSize?: number; fontFamily?: string } = {}
): { object: IText; id: string } {
  const id = generateObjectId()
  const textObj = new IText(text, {
    left: options.left ?? 100,
    top: options.top ?? 100,
    fontSize: options.fontSize ?? 24,
    fontFamily: options.fontFamily ?? 'Inter, sans-serif',
    fill: options.fill ?? '#333333',
    opacity: options.opacity ?? 1,
  })
  registerObject(textObj, id, 'text')
  return { object: textObj, id }
}

export function createGroup(
  objects: FabricObject[],
  options: ShapeOptions = {}
): { object: Group; id: string } {
  const id = generateObjectId()
  const group = new Group(objects, {
    left: options.left ?? 100,
    top: options.top ?? 100,
    opacity: options.opacity ?? 1,
  })
  registerObject(group, id, 'group')
  return { object: group, id }
}

export function createShape(
  type: FabricObjectType,
  options: ShapeOptions = {}
): { object: FabricObject; id: string } {
  switch (type) {
    case 'rect':
      return createRect(options)
    case 'ellipse':
      return createEllipse(options)
    case 'path':
      return createPath('M 0 0 L 100 0 L 100 100 Z', options)
    case 'text':
      return createText('Text', options)
    case 'group':
      return createGroup([], options)
    default:
      return createRect(options)
  }
}
