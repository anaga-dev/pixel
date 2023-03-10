import Color from './Color.js'

/**
 *
 * @param {Color} out
 * @param {Color} in
 * @returns {Color}
 */
export function fromUint8(out, [r = 0, g = 0, b = 0, a = 255]) {
  return Color.set(out, r / 255, g / 255, b / 255, a / 255)
}

/**
 *
 * @param {Color} out
 * @param {Color} in
 * @returns
 */
export function toUint8(out, [r, g, b, a]) {
  return Color.set(out, r * 255, g * 255, b * 255, a * 255)
}

/**
 *
 * @param {Color} out
 * @param {Color} in
 * @returns {Color}
 */
export function fromHSLA(out, [h, s, l, a]) {
  const û = l / 100 // convertimos de [0, 100] a [0,1]
  const ŝ = s / 100 // convertimos de [0, 100] a [0,1]
  const c = (1 - Math.abs(2 * û - 1)) * ŝ
  const ĥ = h / 60 // convertimos de [0º,360º] a [0,6]
  const x = c * (1 - Math.abs((ĥ % 2) - 1))
  let r, g, b
  if (ĥ >= 0 && ĥ < 1) {
    [r, g, b] = [c, x, 0]
  } else if (ĥ >= 1 && ĥ < 2) {
    [r, g, b] = [x, c, 0]
  } else if (ĥ >= 2 && ĥ < 3) {
    [r, g, b] = [0, c, x]
  } else if (ĥ >= 3 && ĥ < 4) {
    [r, g, b] = [0, x, c]
  } else if (ĥ >= 4 && ĥ < 5) {
    [r, g, b] = [x, 0, c]
  } else if (ĥ >= 5 && ĥ < 6) {
    [r, g, b] = [c, 0, x]
  }
  const m = û - c / 2
  return Color.set(out, r + m, g + m, b + m, a)
}

/**
 * Convertimos un color de RGBA a HSLA
 *
 * @param {Color} out Color de destino (en HSLA)
 * @param {Color} color Color de origen (en RGBA)
 * @returns {Color}
 */
export function toHSLA(out, color) {
  const [,,,a] = color
  const h = Color.hue(color)
  const s = Color.saturation(color) * 100
  const l = Color.lightness(color) * 100
  return Color.set(out, h, s, l, a)
}

export default {
  fromUint8,
  toUint8,
  fromHSLA,
  toHSLA
}
