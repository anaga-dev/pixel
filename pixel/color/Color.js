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
 * @param {number} s Saturation [0,100]
 * @param {number} l Saturation [0,100]
 * @param {number}
 */
export function fromHSLA(h, s, l, a) {
  const û = Math.min(1, Math.max(0, l / 100)) // converts from [0, 100] to [0,1]
  const ŝ = Math.min(1, Math.max(0, s / 100)) // converts from [0, 100] to [0,1]
  const c = (1 - Math.abs(2 * û - 1)) * ŝ
  const ĥ = Math.min(6, Math.max(0, h / 60)) // converts from [0º,360º] to [0,6]
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
 * Sets the color value.
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
 * Returns average value from all color components.
 *
 * @param {Color} color
 * @returns {number} Value from 0 to 1.
 */
export function average([r, g, b]) {
  return (r + g + b) / 3
}

/**
 * Luminosity
 *
 * Average alias
 */
export const lightness = mid

/**
 * Returns the range between the highest and lowest color components.
 *
 * @param {Color} color
 * @returns {number}
 */
export function range(color) {
  return max(color) - min(color)
}

/**
 * Chroma
 *
 * Range alias
 */
export const chroma = range

/**
 * Gets color hue
 *
 * @param {Color} color
 * @returns {number} Hue in degrees from 0 to 360
 */
export function hue(color) {
  const c = chroma(color)
  const M = max(color)
  const [r, g, b] = color
  // actually if chroma is equal to 0, hue
  // would be undefined, but it's set to 0 for convenience
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
  // returns the value in degrees (0 to 360).
  return hue * 60
}

/**
 * Returns saturation
 *
 * @param {Color} color
 * @returns {number} Value from 0 to 1
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

// We create this offscreen canvas and context to parse
// colors to Uint8Arrays.
const offscreenCanvas = new OffscreenCanvas(1,1)
const offscreenContext = offscreenCanvas.getContext('2d')

/**
 * Parses a CSS string color and returns a Uint8Array
 * with the r, g, b, a components.
 *
 * @param {string} color
 * @returns {Uint8Array}
 */
export function parseAsUint8(color) {
  offscreenContext.clearRect(0, 0, 1, 1)
  offscreenContext.fillStyle = color
  offscreenContext.fillRect(0, 0, 1, 1)
  const imageData = offscreenContext.getImageData(0, 0, 1, 1)
  return imageData.data
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
  parseAsUint8,
  stringify,
  equals
}
