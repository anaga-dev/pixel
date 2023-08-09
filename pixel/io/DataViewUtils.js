import BinaryType from './BinaryType'

/**
 * List of valid sizes for integers.
 *
 * @type {Array<number>}
 */
export const BinaryTypeIntegerSizes = [1, 2, 4, 8]

/**
 * List of valid sizes for floats.
 *
 * @type {Array<number>}
 */
export const BinaryTypeFloatSizes = [4, 8]

/**
 * List of allowed sizes.
 */
export const BinaryTypeAllowedSizes = {
  [BinaryType.UNSIGNED]: BinaryTypeIntegerSizes,
  [BinaryType.SIGNED]: BinaryTypeIntegerSizes,
  [BinaryType.FLOAT]: BinaryTypeFloatSizes
}

/**
 * List of allowed types.
 */
export const BinaryTypes = [
  BinaryType.U1,
  BinaryType.U2,
  BinaryType.U4,
  BinaryType.U8,
  BinaryType.S1,
  BinaryType.S2,
  BinaryType.S4,
  BinaryType.S8,
  BinaryType.F4,
  BinaryType.F8
]

/**
 * Gets DataView's method name that needs to be called
 * in order to read a data piece from a fixed type.
 *
 * @param {BinaryOperation} operation
 * @param {BinaryType} typeSize
 * @returns {string}
 */
export function getMethodNameByType(operation, typeSize) {
  if (typeSize.length !== 2 || !BinaryTypes.includes(typeSize)) {
    throw new Error(`Invalid type "${typeSize}"`)
  }
  const type = typeSize.slice(0, 1)
  const size = parseInt(typeSize.slice(1, 2), 10)
  return getMethodName(operation, type, size)
}

/**
 * Gets the name of the DataView method that we have to call
 * to read the data.
 *
 * @param {BinaryOperation} operation
 * @param {BinaryType} type
 * @param {number} size
 * @returns {string}
 */
export function getMethodName(operation, type, size) {
  if (!BinaryTypeAllowedSizes[type].includes(size)) {
    throw new Error(`Invalid binary type size "${size}" for type "${type}"`)
  }
  if (type === BinaryType.UNSIGNED) {
    return `${operation}Uint${size * 8}`
  } else if (type === BinaryType.SIGNED) {
    return `${operation}Int${size * 8}`
  } else if (type === BinaryType.FLOAT) {
    return `${operation}Float${size * 8}`
  } else {
    throw new Error(`Invalid binary type "${type}"`)
  }
}

export default {
  getMethodNameByType,
  getMethodName
}
