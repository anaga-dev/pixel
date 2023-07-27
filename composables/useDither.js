import Dither from '@/pixel/canvas/Dither'
import DitherAlignment from '@/pixel/enums/DitherAlignment'

export function useDither() {
  const dither = new Dither()

  const level = ref(dither.level)
  const alignment = ref(DitherAlignment.CANVAS)
  const dx = ref(dither.dx)
  const dy = ref(dither.dy)

  watch(level, (newValue) => dither.level = newValue)
  watch(dx, (newValue) => dither.dx = newValue)
  watch(dy, (newValue) => dither.dy = newValue)

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
