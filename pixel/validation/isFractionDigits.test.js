import { describe, it, expect } from 'vitest'
import isFractionDigits from './isFractionDigits'

describe('isFractionDigits', () => {
  it('should test if number is fraction', () => {
    expect(isFractionDigits(0.5)).toBe(false)
    expect(isFractionDigits(NaN)).toBe(false)
    expect(isFractionDigits(Infinity)).toBe(false)
    expect(isFractionDigits(undefined)).toBe(false)
    expect(isFractionDigits(0)).toBe(true)
    expect(isFractionDigits(1)).toBe(true)
  })
})
