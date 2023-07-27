import Vec2 from './Vec2'
import Interpolation from './Interpolation'

export function linear(x, [ax, ay], [bx, by]) {
  return Vec2.set(
    Interpolation.linear(x, ax, bx),
    Interpolation.linear(x, ay, by)
  )
}

export function quadratic(x, [ax, ay], [bx, by], [cx, cy]) {
  return Vec2.set(
    Interpolation.quadratic(x, ax, bx, cx),
    Interpolation.quadratic(x, ay, by, cy)
  )
}

export function cubic(x, [ax, ay], [bx, by], [cx, cy], [dx, dy]) {
  return Vec2.set(
    Interpolation.cubic(x, ax, bx, cx, dx),
    Interpolation.cubic(x, ay, by, cy, dy)
  )
}

export default {
  linear,
  quadratic,
  cubic
}
