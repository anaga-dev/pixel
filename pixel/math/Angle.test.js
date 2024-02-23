import { describe, it, expect } from 'vitest'
import Angle from './Angle'

describe('Angle', () => {
  it('should convert degrees to radians', () => {
    expect(Angle.degreesToRadians(0)).toBe(0)
    expect(Angle.degreesToRadians(90)).toBe(Math.PI / 2)
    expect(Angle.degreesToRadians(180)).toBe(Math.PI)
    expect(Angle.degreesToRadians(270)).toBe(3 * Math.PI / 2)
    expect(Angle.degreesToRadians(360)).toBe(2 * Math.PI)
  })

  it('should convert radians to degrees', () => {
    expect(Angle.radiansToDegrees(0)).toBe(0)
    expect(Angle.radiansToDegrees(Math.PI / 2)).toBe(90)
    expect(Angle.radiansToDegrees(Math.PI)).toBe(180)
    expect(Angle.radiansToDegrees(3 * Math.PI / 2)).toBe(270)
    expect(Angle.radiansToDegrees(2 * Math.PI)).toBe(360)
  })
})
