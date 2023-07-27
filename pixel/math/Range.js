import { linear } from './Interpolation'

export function from(value, min, max) {
  return (value - min) / (max - min)
}

export const to = linear

export function fromTo(value, fMin, fMax, tMin, tMax) {
  return to(from(value, fMin, fMax), tMin, tMax)
}

export function clamp(value, min, max) {
  if (value < min) return min
  if (value > max) return max
  return value
}

export default {
  from,
  to,
  fromTo,
  clamp
}
