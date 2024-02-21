import { isSize } from '../validation/isSize.js'

/**
 * Returns the offset of the specified coordinates.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @returns {number}
 */
export function getOffset(x, y, width, height) {
  if (!isInside(x, y, width, height)) {
    throw new RangeError('Coordinates out of range')
  }
  return y * width + x
}

/**
 * Checks if the coordinates are inside the image
 *
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @returns {boolean}
 */
export function isInside(x, y, width, height) {
  if (!isSize(x) || !isSize(y)) {
    throw new TypeError('Invalid coordinates')
  }
  if (!isSize(width) || !isSize(height)) {
    throw new TypeError('Invalid size')
  }
  return x >= 0 && y >= 0 && x < width && y < height
}

/**
 * Checks if the coordinates are outside the image
 *
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @returns {boolean}
 */
export function isOutside(x, y, width, height) {
  return !isInside(x, y, width, height)
}

export default {
  getOffset,
  isInside,
  isOutside
}
