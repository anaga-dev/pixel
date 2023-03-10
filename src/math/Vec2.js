export function create(x = 0, y = 0) {
  return [x, y]
}

export function set(out, x, y) {
  out[0] = x
  out[1] = y
  return out
}

export function reset(out) {
  return set(out, 0, 0)
}

export function copy(out, [x, y]) {
  return set(out, x, y)
}

export function clone([x, y]) {
  return create(x, y)
}

export function add(out, [ax, ay], [bx, by]) {
  return set(out, ax + bx, ay + by)
}

export function subtract(out, [ax, ay], [bx, by]) {
  return set(out, ax - bx, ay - by)
}

export function multiply(out, [ax, ay], [bx, by]) {
  return set(out, ax * bx, ay * by)
}

export function divide(out, [ax, ay], [bx, by]) {
  return set(out, ax / bx, ay / by)
}

export function scale(out, [ax, ay], s) {
  return set(out, ax * s, ay * s)
}

export function perpLeft(out, [x, y]) {
  return set(out, y, -x)
}

export function perpRight(out, [x, y]) {
  return set(out, -y, x)
}

export function rotate(out, [x, y], angle) {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return set(
    out,
    c * x - s * y,
    s * x + c * y
  )
}

export function floor(out, [x, y]) {
  return set(out, Math.floor(x), Math.floor(y))
}

export function ceil(out, [x, y]) {
  return set(out, Math.ceil(x), Math.ceil(y))
}

export function round(out, [x, y]) {
  return set(out, Math.round(x), Math.round(y))
}

export function normalize(out, [x, y]) {
  const length = Math.hypot(x, y)
  return set(out, x / length, y / length)
}

export function clamp(out, [x, y], [minx, miny], [maxx, maxy]) {
  return set(out, Range.clamp(x, minx, maxx), Range.clamp(y, miny, maxy))
}

export default {
  create,
  set,
  reset,
  copy,
  clone,
  add,
  subtract,
  multiply,
  divide,
  scale,
  perpLeft,
  perpRight,
  rotate,
  floor,
  ceil,
  round,
  normalize,
  clamp
}
