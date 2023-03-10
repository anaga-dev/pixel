/**
 * Interpolación lineal
 *
 * @param {number} x
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function linear(x, a, b) {
  return (1 - x) * a + x * b
}

/**
 * Interpolación cuadrática
 *
 * @param {number} x
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @returns {number}
 */
export function quadratic(x, a, b, c) {
  return linear(x, linear(x, a, b), linear(x, b,c ))
}

/**
 * Interpolación cúbica
 *
 * @param {number} x
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @returns {number}
 */
export function cubic(x, a, b, c, d) {
  return linear(x, quadratic(x, a, b, c), quadratic(x, b, c, d))
}

export default {
  linear,
  quadratic,
  cubic
}
