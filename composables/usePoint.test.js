import { describe, it, expect } from 'vitest'

describe('usePoint', () => {
  it('should use default point', () => {
    const point = usePoint()
    expect(point.x.value).toBe(0)
    expect(point.y.value).toBe(0)
  })

  it('should initialize point', () => {
    const point = usePoint(10, 20)
    expect(point.x.value).toBe(10)
    expect(point.y.value).toBe(20)
  })

  it('should set point', () => {
    const point = usePoint()
    point.set(10, 20)
    expect(point.x.value).toBe(10)
    expect(point.y.value).toBe(20)
  })

  it('should reset point', () => {
    const point = usePoint(10, 20)
    point.reset()
    expect(point.x.value).toBe(0)
    expect(point.y.value).toBe(0)
  })

  it('should copy point', () => {
    const point = usePoint(10, 20)
    const copy = usePoint(0, 0)
    copy.copy(point)
    expect(copy.x.value).toBe(10)
    expect(copy.y.value).toBe(20)
  })

  it('should clone point', () => {
    const point = usePoint(10, 20)
    const clone = point.clone()
    expect(clone.x.value).toBe(10)
    expect(clone.y.value).toBe(20)
  })

  it('should add point', () => {
    const point = usePoint(10, 20)
    point.add(10, 20)
    expect(point.x.value).toBe(20)
    expect(point.y.value).toBe(40)
  })

  it('should subtract point', () => {
    const point = usePoint(10, 20)
    point.subtract(10, 20)
    expect(point.x.value).toBe(0)
    expect(point.y.value).toBe(0)
  })

  it('should multiply point', () => {
    const point = usePoint(10, 20)
    point.multiply(2, 3)
    expect(point.x.value).toBe(20)
    expect(point.y.value).toBe(60)
  })

  it('should divide point', () => {
    const point = usePoint(10, 20)
    point.divide(2, 4)
    expect(point.x.value).toBe(5)
    expect(point.y.value).toBe(5)
  })

  it('should scale point', () => {
    const point = usePoint(10, 20)
    point.scale(2)
    expect(point.x.value).toBe(20)
    expect(point.y.value).toBe(40)
  })

  it('should perp left point', () => {
    const point = usePoint(10, 20)
    point.perpLeft()
    expect(point.x.value).toBe(20)
    expect(point.y.value).toBe(-10)
  })

  it('should perp right point', () => {
    const point = usePoint(10, 20)
    point.perpRight()
    expect(point.x.value).toBe(-20)
    expect(point.y.value).toBe(10)
  })

  it('should get point length', () => {
    const point = usePoint(3, 5)
    expect(point.length.value).toBe(Math.hypot(3, 5))
  })

  it('should get point angle', () => {
    const point = usePoint(3, 5)
    expect(point.angle.value).toBe(Math.atan2(5, 3))
  })

  it('should floor point', () => {
    const point = usePoint(3.5, 5.5)
    point.floor()
    expect(point.x.value).toBe(3)
    expect(point.y.value).toBe(5)
  })

  it('should ceil point', () => {
    const point = usePoint(3.5, 5.5)
    point.ceil()
    expect(point.x.value).toBe(4)
    expect(point.y.value).toBe(6)
  })

  it('should round point', () => {
    const point = usePoint(3.5, 5.5)
    point.round()
    expect(point.x.value).toBe(4)
    expect(point.y.value).toBe(6)
  })

  it('should negate point', () => {
    const point = usePoint(3, 5)
    point.negate()
    expect(point.x.value).toBe(-3)
    expect(point.y.value).toBe(-5)
  })

  it('should normalize point', () => {
    const point = usePoint(3, 5)
    const length = point.length.value
    point.normalize()
    expect(point.x.value).toBe(3 / length)
    expect(point.y.value).toBe(5 / length)
  })

  it('should clamp point', () => {
    const point = usePoint(3, 5)
    point.clamp(0, 0, 4, 4)
    expect(point.x.value).toBe(3)
    expect(point.y.value).toBe(4)
  })
})
