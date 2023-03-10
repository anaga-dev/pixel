/**
 * Constante para convertir de radianes a grados
 *
 * @type {number}
 */
export const RAD_TO_DEG = 180 / Math.PI

/**
 * Constante para convertir de grados a radianes
 *
 * @type {number}
 */
export const DEG_TO_RAD = Math.PI / 180

/**
 * Convierte grados a radianes
 *
 * @param {number} degrees
 * @returns {number}
 */
export function degreesToRadians(degrees) {
  return DEG_TO_RAD * degrees
}

/**
 * Convierte radianes a grados
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
