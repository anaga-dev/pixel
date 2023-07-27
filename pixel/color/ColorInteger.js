// FIXME: Lo mejor sería contemplar una serie de funciones del tipo R5G6B5, RGBA8
// R5G5B5A1, etc.

export function toUint32(r, g, b, a) {
  if (!Number.isInteger(r) || !Number.isInteger(g) || !Number.isInteger(b) || !Number.isInteger(a)) {
    throw new TypeError('Channels must be integers')
  }
  return ((r & 0xFF) << 24) | ((g & 0xFF) << 16) | ((b & 0xFF) << 16) | (a & 0xFF)
}

export function fromUint32(color) {
  const r = color >> 24
  const g = color >> 16
  const b = color >> 8
  const a = color & 0xFF
  return [r, g, b, a]
}

export function toUint16(r, g, b) {
  return ((r & 0x1F) << 11) | ((g & 0x3F) << 5) | (b & 0x1F)
}

export function fromUint16(r, g, b) {
  const r = (color >> 11) & 0x1F
  const g = (color >> 5) & 0x3F
  const b = color & 0x1F
  return [r, g, b, 1]
}
