export function hexToRgbArray(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '')
  const r = parseInt(normalized.slice(0, 2), 16) / 255
  const g = parseInt(normalized.slice(2, 4), 16) / 255
  const b = parseInt(normalized.slice(4, 6), 16) / 255
  return [r, g, b]
}

export function rgbArrayToHex(rgb: [number, number, number]): string {
  const [r, g, b] = rgb
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color)
}

export function normalizeColor(color: string): string {
  if (color.startsWith('#')) {
    return color.toLowerCase()
  }
  return `#${color.toLowerCase()}`
}
