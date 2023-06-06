export const ZERO = 0x00000000
export const ONE = 0xFFFFFFFF

/**
 * Patrones de dithering
 */
export const patterns = [
  // 0
  new Uint32Array([
    ZERO, ZERO, ZERO, ZERO,
    ZERO, ZERO, ZERO, ZERO,
    ZERO, ZERO, ZERO, ZERO,
    ZERO, ZERO, ZERO, ZERO
  ]),
  //  1
  new Uint32Array([
     ONE, ZERO, ZERO, ZERO,
    ZERO, ZERO, ZERO, ZERO,
    ZERO, ZERO, ZERO, ZERO,
    ZERO, ZERO, ZERO, ZERO
  ]),
  // 2
  new Uint32Array([
     ONE, ZERO, ZERO, ZERO,
    ZERO, ZERO, ZERO, ZERO,
    ZERO, ZERO,  ONE, ZERO,
    ZERO, ZERO, ZERO, ZERO
  ]),
  // 3
  new Uint32Array([
     ONE, ZERO, ZERO, ZERO,
    ZERO, ZERO, ZERO, ZERO,
     ONE, ZERO,  ONE, ZERO,
    ZERO, ZERO, ZERO, ZERO
  ]),
  // 4
  new Uint32Array([
     ONE, ZERO,  ONE, ZERO,
    ZERO, ZERO, ZERO, ZERO,
     ONE, ZERO,  ONE, ZERO,
    ZERO, ZERO, ZERO, ZERO
  ]),
  // 5
  new Uint32Array([
     ONE, ZERO,  ONE, ZERO,
    ZERO,  ONE, ZERO, ZERO,
     ONE, ZERO,  ONE, ZERO,
    ZERO, ZERO, ZERO, ZERO
  ]),
  // 6
  new Uint32Array([
     ONE, ZERO,  ONE, ZERO,
    ZERO,  ONE, ZERO, ZERO,
     ONE, ZERO,  ONE, ZERO,
    ZERO, ZERO, ZERO,  ONE
  ]),
  // 7
  new Uint32Array([
     ONE, ZERO,  ONE, ZERO,
    ZERO,  ONE, ZERO, ZERO,
     ONE, ZERO,  ONE, ZERO,
    ZERO,  ONE, ZERO,  ONE
  ]),
  // 8
  new Uint32Array([
     ONE, ZERO,  ONE, ZERO,
    ZERO,  ONE, ZERO,  ONE,
     ONE, ZERO,  ONE, ZERO,
    ZERO,  ONE, ZERO,  ONE
  ]),
  // 9
  new Uint32Array([
     ONE, ZERO,  ONE, ZERO,
     ONE,  ONE, ZERO,  ONE,
     ONE, ZERO,  ONE, ZERO,
    ZERO,  ONE, ZERO,  ONE
  ]),
  // 10
  new Uint32Array([
     ONE, ZERO,  ONE, ZERO,
     ONE,  ONE, ZERO,  ONE,
     ONE, ZERO,  ONE, ZERO,
     ONE,  ONE,  ONE,  ONE
  ]),
  // 11
  new Uint32Array([
     ONE, ZERO,  ONE, ZERO,
     ONE,  ONE,  ONE,  ONE,
     ONE, ZERO,  ONE, ZERO,
     ONE,  ONE,  ONE,  ONE
  ]),
  // 12
  new Uint32Array([
     ONE,  ONE,  ONE, ZERO,
     ONE,  ONE,  ONE,  ONE,
     ONE, ZERO,  ONE, ZERO,
     ONE,  ONE,  ONE,  ONE
  ]),
  // 13
  new Uint32Array([
     ONE,  ONE,  ONE, ZERO,
     ONE,  ONE,  ONE,  ONE,
     ONE, ZERO,  ONE,  ONE,
     ONE,  ONE,  ONE,  ONE
  ]),
  // 14
  new Uint32Array([
     ONE,  ONE,  ONE, ZERO,
     ONE,  ONE,  ONE,  ONE,
     ONE,  ONE,  ONE,  ONE,
     ONE,  ONE,  ONE,  ONE
  ])
]

export class Dither {
  constructor(level = 0, dx = 0, dy = 0) {
    if (!Number.isInteger(dx) || !Number.isInteger(dy)) {
      throw new Error('Invalid dither offset')
    }
    if (!Number.isInteger(level) || level < 0 || level > 13) {
      throw new Error('Invalid dither level')
    }
    this.level = level
    this.dx = dx
    this.dy = dy
  }

  shouldPaint(x, y) {
    const cx = (this.dx + x) % 4
    const cy = (this.dy + y) % 4
    const pattern = patterns[this.level]
    return pattern[cy * 4 + cx] === ONE
  }
}

export default Dither
