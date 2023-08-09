/**
 * Constant to translate radians into degrees
 *
 * @type {number}
 */
export const RAD_TO_DEG = 180 / Math.PI

/**
 * Constant to translate degrees into radians
 *
 * @type {number}
 */
export const DEG_TO_RAD = Math.PI / 180

/**
 * Translates degrees to radians
 *
 * @param {number} degrees
 * @returns {number}
 */
export function degreesToRadians(degrees) {
  return DEG_TO_RAD * degrees
}

/**
 * Translates radians to degrees
 *
 * @param {number} radians
 * @returns {number}
 */
export function radiansToDegrees(radians) {
  return RAD_TO_DEG * radians
}

export default {
  RAD_TO_DEG,
  DEG_TO_RAD,
  degreesToRadians,
  radiansToDegrees,
}
