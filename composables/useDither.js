import Dither from '@/pixel/paint/Dither'
import DitherAlignment from '@/pixel/enums/DitherAlignment'

/**
 * @typedef {Object} DitherComposable
 * @property {Ref<number>} level
 * @property {Ref<DitherAlignment>} alignment
 * @property {Ref<number>} dx
 * @property {Ref<number>} dy
 * @property {(x: number, y: number) => void} set
 * @property {() => void} reset
 * @property {(x: number, y: number) => boolean} shouldPaint
 */

/**
 * Composable to use the Dither class
 *
 * @returns {DitherComposable}
 */
export function useDither() {
  const dither = new Dither()

  const level = ref(dither.level)
  const alignment = ref(dither.alignment)
  const dx = ref(dither.dx)
  const dy = ref(dither.dy)

  watch(level, (newLevel) => dither.level = newLevel)
  watch(alignment, (newAlignment) => dither.alignment = newAlignment)
  watch(dx, (newDx) => dither.dx = newDx)
  watch(dy, (newDy) => dither.dy = newDy)

  function set(x, y) {
    dx.value = x
    dy.value = y
  }

  function reset() {
    set(0, 0)
  }

  function shouldPaint(x, y) {
    return dither.shouldPaint(x, y)
  }

  return {
    level,
    alignment,
    dx,
    dy,
    setLevel(newLevel) {
      if (!Number.isInteger(newLevel) && newLevel < 0) {
        throw new Error('Invalid level')
      }
      level.value = newLevel
    },
    setAlignment(newAlignment) {
      if (!Object.values(DitherAlignment).includes(newAlignment)) {
        throw new Error('Invalid alignment')
      }
      alignment.value = newAlignment
    },
    set,
    reset,
    shouldPaint,
  }
}
