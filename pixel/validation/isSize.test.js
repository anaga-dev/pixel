import { describe, it, expect } from 'vitest'
import { isSize } from './isSize'

describe('Validation', () => {
  it('should throw on invalid max', () => {
    expect(() => isSize(1, 1.5)).toThrow('The maximum size must be a finite integer number')
    expect(() => isSize(1, NaN)).toThrow('The maximum size must be a finite integer number')
  })

  it('should return false on invalid values', () => {
    expect(isSize(0)).toBe(false)
    expect(isSize(-1)).toBe(false)
    expect(isSize(1.5)).toBe(false)
    expect(isSize(1, 0)).toBe(false)
    expect(isSize(1, -1)).toBe(false)
    expect(isSize(Infinity)).toBe(false)
    expect(isSize(-Infinity)).toBe(false)
    expect(isSize(NaN)).toBe(false)
  })

  it('should return true on valid values', () => {
    expect(isSize(1)).toBe(true)
    expect(isSize(1, 2)).toBe(true)
    expect(isSize(32)).toBe(true)
  })
})
