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
  const alignment = ref(DitherAlignment.CANVAS)
  const dx = ref(dither.dx)
  const dy = ref(dither.dy)

  /*
  watch(level, (newValue) => dither.level = newValue)
  watch(dx, (newValue) => dither.dx = newValue)
  watch(dy, (newValue) => dither.dy = newValue)
  */

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
    set,
    reset,
    shouldPaint
  }
}
