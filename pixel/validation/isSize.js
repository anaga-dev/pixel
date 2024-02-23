/**
 * Check if the given value is a valid size.
 *
 * @param {number} size
 * @param {number} [max=Infinity]
 * @returns {number}
 */
export function isSize(size, max = Infinity) {
  if (Number.isNaN(max) || (Number.isFinite(max) && !Number.isSafeInteger(max))) {
    throw new Error('The maximum size must be a finite integer number')
  }
  return Number.isSafeInteger(size) && size > 0 && size < max
}

export default isSize
