export function usePoint(initialX = 0, initialY = 0) {
  const x = ref(initialX)
  const y = ref(initialY)

  function set(newX, newY) {
    x.value = newX
    y.value = newY
  }

  function reset() {
    x.value = 0
    y.value = 0
  }

  function copy({ x: cx, y: cy }) {
    x.value = cx.value
    y.value = cy.value
  }

  function clone() {
    return {
      x: ref(x.value),
      y: ref(y.value)
    }
  }

  function add(ax, ay) {
    x.value += ax
    y.value += ay
  }

  function subtract(ax, ay) {
    x.value -= ax
    y.value -= ay
  }

  function multiply(ax, ay) {
    x.value *= ax
    y.value *= ay
  }

  function divide(ax, ay) {
    x.value /= ax
    y.value /= ay
  }

  function scale(s) {
    x.value *= s
    y.value *= s
  }

  function perpLeft() {
    const cx = x.value
    x.value = y.value
    y.value = -cx
  }

  function perpRight() {
    const cx = x.value
    x.value = -y.value
    y.value = cx
  }

  function rotate(angle) {
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    x.value = c * x - s * y
    y.value = s * x + c * y
  }

  function floor() {
    x.value = Math.floor(x.value)
    y.value = Math.floor(y.value)
  }

  function ceil() {
    x.value = Math.ceil(x.value)
    y.value = Math.ceil(y.value)
  }

  function round() {
    x.value = Math.round(x.value)
    y.value = Math.round(y.value)
  }

  function normalize() {
    const length = Math.hypot(x.value, y.value)
    x.value /= length
    y.value /= length
  }

  function negate() {
    x.value = -x.value
    y.value = -y.value
  }

  function clamp(minx, miny, maxx, maxy) {
    x.value = Range.clamp(x, minx, maxx)
    y.value = Range.clamp(y, miny, maxy)
  }

  return {
    x, y, set, reset, copy, clone, add, subtract, multiply, divide, scale, perpLeft, perpRight, rotate, floor, ceil, round, normalize, negate, clamp
  }
}
