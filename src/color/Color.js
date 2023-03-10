import { parse } from './ColorParser.js'
import { stringify } from './ColorStringifier.js'

/**
 *
 * @see https://en.wikipedia.org/wiki/HSL_and_HSV#Hue_and_chroma
 */

/**
 * @typedef {Array} Color
 * @property {number} 0 red
 * @property {number} 1 green
 * @property {number} 2 blue
 * @property {number} 3 alpha
 */

/**
 *
 * @param {number} h Hue [0,360]
 * @param {number} s Saturación [0,100]
 * @param {number} l Saturación [0,100]
 * @param {number}
 */
export function fromHSLA(h, s, l, a) {
  const û = Math.min(1, Math.max(0, l / 100)) // convertimos de [0, 100] a [0,1]
  const ŝ = Math.min(1, Math.max(0, s / 100)) // convertimos de [0, 100] a [0,1]
  const c = (1 - Math.abs(2 * û - 1)) * ŝ
  const ĥ = Math.min(6, Math.max(0, h / 60)) // convertimos de [0º,360º] a [0,6]
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
  return create(r + m, g + m, b + m, a)
}

/**
 *
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} a
 * @returns
 */
export function fromRGBA(r = 0, g = 0, b = 0, a = 255) {
  return create(r / 255, g / 255, b / 255, a / 255)
}

/**
 *
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} a
 * @returns {Color}
 */
export function create(r = 0, g = 0, b = 0, a = 1) {
  return [r, g, b, a]
}

/**
 * Establecemos el valor del color.
 *
 * @param {Color} out
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} a
 * @returns {Color}
 */
export function set(out, r, g, b, a) {
  out[0] = r
  out[1] = g
  out[2] = b
  out[3] = a
  return out
}

export function reset(out) {
  return set(out, 0, 0, 0, 1)
}

export function copy(out, [r, g, b, a]) {
  return set(out, r, g, ba)
}

export function clone([r, g, b, a]) {
  return create(r, g, b, a)
}

export function max([r, g, b]) {
  return Math.max(r, g, b)
}

export function min([r, g, b]) {
  return Math.min(r, g, b)
}

export function mid(color) {
  return (max(color) + min(color)) / 2
}

export function saturationHSV(color) {
  const [r, g, b] = color
  return 1 - (min(color) / max(color))
}

/**
 * Devuelve el valor medio de todos los componentes
 * del color.
 *
 * @param {Color} color
 * @returns {number} Valor entre 0 y 1 con el valor medio de todos los componentes.
 */
export function average([r, g, b]) {
  return (r + g + b) / 3
}

/**
 * Luminosidad
 *
 * Alias de average
 */
export const lightness = mid

/**
 * Devuelve el rango entre el componente mayor
 * y el componente menor del color.
 *
 * @param {Color} color
 * @returns {number}
 */
export function range(color) {
  return max(color) - min(color)
}

/**
 * Croma
 *
 * Alias de range
 */
export const chroma = range

/**
 * Obtenemos el hue del color
 *
 * @param {Color} color
 * @returns {number} Hue en grados de 0 a 360
 */
export function hue(color) {
  const c = chroma(color)
  const M = max(color)
  const [r, g, b] = color
  // en realidad si el chroma es 0, el hue
  // no estaría definido pero ponemos 0 por
  // conveniencia
  if (c === 0) {
    return 0
  }
  let hue = 0
  if (M === r) {
    hue = ((g - b) / c) % 6
  } else if (M === g) {
    hue = (b - r) / c + 2
  } else if (M === b) {
    hue = (r - g) / c + 4
  }
  // retornamos el valor en grados (0 a 360).
  return hue * 60
}

/**
 * Devuelve la saturación
 *
 * @param {Color} color
 * @returns {number} Un valor entre 0 y 1 representando la saturación del color
 */
export function saturation(color) {
  const l = lightness(color)
  const c = chroma(color)
  if (l === 1 || l === 0) {
    return 0
  }
  return c / (1 - Math.abs(2 * l - 1))
}

/**
 *
 * @param {Color} color
 * @returns {Uint8Array}
 */
export function asUint8([r, g, b, a]) {
  return new Uint8Array([r * 0xFF, g * 0xFF, b * 0xFF, a * 0xFF])
}

/**
 *
 * @param {string} color
 * @returns {Uint8Array}
 */
export function toUint8(color) {
  return asUint8(parse(color))
}

export function equals(a, b) {
  if (a === b) {
    return true
  }
  const [ar, ag, ab, aa] = parse(a)
  const [br, bg, bb, ba] = parse(b)
  return ar === br && ag === bg && ab === bb && aa === ba
}

export default {
  fromHSLA,
  fromRGBA,
  create,
  set,
  reset,
  copy,
  clone,
  average,
  max,
  min,
  mid,
  range,
  chroma,
  hue,
  lightness,
  saturationHSV,
  saturation,
  asUint8,
  toUint8,
  parse,
  stringify,
  equals
}
