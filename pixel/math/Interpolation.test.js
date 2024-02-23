import { describe, it, expect } from 'vitest'
import Interpolation from './Interpolation'

describe('Interpolation', () => {
  it('should interpolate linearly', () => {
    expect(Interpolation.linear(0.5, 0, 100)).toBe(50)
  })

  it('should interpolate quadraticaly', () => {
    expect(Interpolation.quadratic(0.5, 0, 50, 100)).toBe(50)
  })

  it('should interpolate cubicaly', () => {
    expect(Interpolation.cubic(0.5, 0, 50, 50, 100)).toBe(50)
  })
})
