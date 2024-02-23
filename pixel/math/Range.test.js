import { describe, it, expect } from 'vitest'
import Range from './Range'

describe('Range', () => {
  it('should convert from range', () => {
    expect(Range.from(50, 0, 100)).toBe(0.5)
  })

  it('should convert to range', () => {
    expect(Range.to(0.5, 0, 100)).toBe(50)
  })

  it('should convert to range (negative)', () => {
    expect(Range.to(-0.5, 0, 100)).toBe(-50)
  })

  it('should convert from to range', () => {
    expect(Range.to(Range.from(50, 0, 100), 0, 100)).toBe(50)
    expect(Range.fromTo(50, 0, 100, 0, 100)).toBe(50)
  })
})
