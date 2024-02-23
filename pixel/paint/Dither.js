export const ZERO = 0x00
export const ONE = 0xFF

/**
 * Dithering patterns
 *
 * @type {Array<Uint8ClampedArray>}
 */
export const patterns = [
  // 0
  new Uint8ClampedArray([
    ZERO, ZERO, ZERO, ZERO,
    ZERO, ZERO, ZERO, ZERO,
    ZERO, ZERO, ZERO, ZERO,
    ZERO, ZERO, ZERO, ZERO
  ]),
  // 1
  new Uint8ClampedArray([
     ONE, ZERO, ZERO, ZERO,
    ZERO, ZERO, ZERO, ZERO,
    ZERO, ZERO, ZERO, ZERO,
    ZERO, ZERO, ZERO, ZERO
  ]),
  // 2
  new Uint8ClampedArray([
     ONE, ZERO, ZERO, ZERO,
    ZERO, ZERO, ZERO, ZERO,
    ZERO, ZERO,  ONE, ZERO,
    ZERO, ZERO, ZERO, ZERO
  ]),
  // 3
  new Uint8ClampedArray([
     ONE, ZERO, ZERO, ZERO,
    ZERO, ZERO, ZERO, ZERO,
     ONE, ZERO,  ONE, ZERO,
    ZERO, ZERO, ZERO, ZERO
  ]),
  // 4
  new Uint8ClampedArray([
     ONE, ZERO,  ONE, ZERO,
    ZERO, ZERO, ZERO, ZERO,
     ONE, ZERO,  ONE, ZERO,
    ZERO, ZERO, ZERO, ZERO
  ]),
  // 5
  new Uint8ClampedArray([
     ONE, ZERO,  ONE, ZERO,
    ZERO,  ONE, ZERO, ZERO,
     ONE, ZERO,  ONE, ZERO,
    ZERO, ZERO, ZERO, ZERO
  ]),
  // 6
  new Uint8ClampedArray([
     ONE, ZERO,  ONE, ZERO,
    ZERO,  ONE, ZERO, ZERO,
     ONE, ZERO,  ONE, ZERO,
    ZERO, ZERO, ZERO,  ONE
  ]),
  // 7
  new Uint8ClampedArray([
     ONE, ZERO,  ONE, ZERO,
    ZERO,  ONE, ZERO, ZERO,
     ONE, ZERO,  ONE, ZERO,
    ZERO,  ONE, ZERO,  ONE
  ]),
  // 8
  new Uint8ClampedArray([
     ONE, ZERO,  ONE, ZERO,
    ZERO,  ONE, ZERO,  ONE,
     ONE, ZERO,  ONE, ZERO,
    ZERO,  ONE, ZERO,  ONE
  ]),
  // 9
  new Uint8ClampedArray([
     ONE, ZERO,  ONE, ZERO,
     ONE,  ONE, ZERO,  ONE,
     ONE, ZERO,  ONE, ZERO,
    ZERO,  ONE, ZERO,  ONE
  ]),
  // 10
  new Uint8ClampedArray([
     ONE, ZERO,  ONE, ZERO,
     ONE,  ONE, ZERO,  ONE,
     ONE, ZERO,  ONE, ZERO,
     ONE,  ONE,  ONE,  ONE
  ]),
  // 11
  new Uint8ClampedArray([
     ONE, ZERO,  ONE, ZERO,
     ONE,  ONE,  ONE,  ONE,
     ONE, ZERO,  ONE, ZERO,
     ONE,  ONE,  ONE,  ONE
  ]),
  // 12
  new Uint8ClampedArray([
     ONE,  ONE,  ONE, ZERO,
     ONE,  ONE,  ONE,  ONE,
     ONE, ZERO,  ONE, ZERO,
     ONE,  ONE,  ONE,  ONE
  ]),
  // 13
  new Uint8ClampedArray([
     ONE,  ONE,  ONE, ZERO,
     ONE,  ONE,  ONE,  ONE,
     ONE, ZERO,  ONE,  ONE,
     ONE,  ONE,  ONE,  ONE
  ]),
  // 14
  new Uint8ClampedArray([
     ONE,  ONE,  ONE, ZERO,
     ONE,  ONE,  ONE,  ONE,
     ONE,  ONE,  ONE,  ONE,
     ONE,  ONE,  ONE,  ONE
  ])
]

/**
 * Dithering
 */
export class Dither {
  /**
   * Constructor
   *
   * @param {number} level
   * @param {number} dx
   * @param {number} dy
   */
  constructor(level = 0, dx = 0, dy = 0) {
    if (!Number.isInteger(dx) || !Number.isInteger(dy)) {
      throw new Error('Invalid dither offset')
    }
    if (!Number.isInteger(level) || level < 0 || level >= patterns.length) {
      throw new Error('Invalid dither level')
    }
    this.level = level
    // TODO: We should make this wrap around when
    // this value is negative.
    this.dx = dx
    this.dy = dy
  }

  /**
   * Returns if the pixel should be painted
   * using the specified dithering level.
   *
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  shouldPaint(x, y) {
    const SIZE = 4
    const cx = (this.dx + x) % SIZE
    const cy = (this.dy + y) % SIZE
    const pattern = patterns[this.level]
    return pattern[cy * SIZE + cx] === ONE
  }
}

export default Dither
