import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

class MockCanvasRenderingContext2D {
  fillStyle = ''
  strokeStyle = ''
  lineWidth = 1
  font = ''
  textAlign = ''
  textBaseline = ''

  fillRect = vi.fn()
  strokeRect = vi.fn()
  clearRect = vi.fn()
  beginPath = vi.fn()
  closePath = vi.fn()
  moveTo = vi.fn()
  lineTo = vi.fn()
  arc = vi.fn()
  fill = vi.fn()
  stroke = vi.fn()
  save = vi.fn()
  restore = vi.fn()
  translate = vi.fn()
  rotate = vi.fn()
  scale = vi.fn()
  transform = vi.fn()
  setTransform = vi.fn()
  resetTransform = vi.fn()
  clip = vi.fn()
  measureText = vi.fn(() => ({ width: 0 }))
  fillText = vi.fn()
  strokeText = vi.fn()
  drawImage = vi.fn()
  createLinearGradient = vi.fn(() => ({
    addColorStop: vi.fn(),
  }))
  createRadialGradient = vi.fn(() => ({
    addColorStop: vi.fn(),
  }))
  createPattern = vi.fn()
  getImageData = vi.fn(() => ({
    data: new Uint8ClampedArray(4),
    width: 1,
    height: 1,
  }))
  putImageData = vi.fn()
  rect = vi.fn()
  quadraticCurveTo = vi.fn()
  bezierCurveTo = vi.fn()
  ellipse = vi.fn()
  arcTo = vi.fn()
  getLineDash = vi.fn(() => [])
  setLineDash = vi.fn()
}

HTMLCanvasElement.prototype.getContext = vi.fn(function (
  this: HTMLCanvasElement,
  contextId: string
) {
  if (contextId === '2d') {
    return new MockCanvasRenderingContext2D() as unknown as CanvasRenderingContext2D
  }
  return null
}) as unknown as typeof HTMLCanvasElement.prototype.getContext
