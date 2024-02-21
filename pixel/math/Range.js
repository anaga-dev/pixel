import { linear } from './Interpolation'

/**
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function from(value, min, max) {
  return (value - min) / (max - min)
}

/**
 * @alias Interpolation/linear
 */
export const to = linear

/**
 *
 * @alias map
 * @param {number} value
 * @param {number} fMin
 * @param {number} fMax
 * @param {number} tMin
 * @param {number} tMax
 * @returns {number}
 */
export function fromTo(value, fMin, fMax, tMin, tMax) {
  return to(from(value, fMin, fMax), tMin, tMax)
}

/**
 * @alias fromTo
 */
export const map = fromTo

/**
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  if (value < min) return min
  if (value > max) return max
  return value
}

export default {
  from,
  to,
  fromTo,
  clamp
}
