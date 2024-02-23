import { describe, it, expect, vi } from 'vitest'
import { useColor } from './useColor'
import OffscreenCanvasMock from '@/test/mocks/OffscreenCanvas'

vi.stubGlobal('OffscreenCanvas', OffscreenCanvasMock)

describe('useColor composable', () => {
  it('should create a default color', () => {
    const color = useColor()
    expect(color.red.value).toBe(0)
    expect(color.green.value).toBe(0)
    expect(color.blue.value).toBe(0)
    expect(color.hue.value).toBe(0)
    expect(color.saturation.value).toBe(0)
    expect(color.lightness.value).toBe(0)
    expect(color.style.value).toBe('rgb(0, 0, 0)')
  })

  /*
  it('should create a color from string', () => {
    const color = useColor('#ff0000')
    expect(color.red.value).toBe(255)
    expect(color.green.value).toBe(0)
    expect(color.blue.value).toBe(0)
    expect(color.hue.value).toBe(0)
    expect(color.saturation.value).toBe(100)
    expect(color.lightness.value).toBe(50)
    expect(color.style.value).toBe('rgb(255, 0, 0)')
  })
  */
})
