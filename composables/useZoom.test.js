import { describe, it, expect } from 'vitest'
import { useZoom, Zoom } from './useZoom'

describe('useZoom composable', () => {
  it('should verify default zoom', () => {
    const zoom = useZoom()
    expect(zoom.current.value).toBe(Zoom.DEFAULT)
    expect(zoom.percentage.value).toBe('100%')
  })

  it('should zoom in', () => {
    const zoom = useZoom()
    zoom.increase()
    expect(zoom.current.value).toBe(2)
  })

  it('should zoom in (max)', () => {
    const zoom = useZoom()
    for (let i = 0; i < 100; i++) {
      zoom.increase()
    }
    expect(zoom.current.value).toBe(Zoom.MAX)
  })

  it('should zoom out', () => {
    const zoom = useZoom({ initial: 2 })
    zoom.decrease()
    expect(zoom.current.value).toBe(Zoom.DEFAULT)
  })

  it('should zoom in (max)', () => {
    const zoom = useZoom({ initial: Zoom.MAX })
    for (let i = 0; i < 100; i++) {
      zoom.decrease()
    }
    expect(zoom.current.value).toBe(Zoom.MIN)
  })

  it('should zoom relative (from 2, relative 0.5)', () => {
    const zoom = useZoom({ initial: 2 })
    zoom.relative(0.5)
    expect(zoom.current.value).toBe(Zoom.DEFAULT)
  })

  it('should zoom relative (from 2, relative 2)', () => {
    const zoom = useZoom({ initial: 2 })
    zoom.relative(2)
    expect(zoom.current.value).toBe(4)
  })

  it('should zoom reset', () => {
    const zoom = useZoom({ initial: 2 })
    zoom.reset()
    expect(zoom.current.value).toBe(Zoom.DEFAULT)
  })
})
