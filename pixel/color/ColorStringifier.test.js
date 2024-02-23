import { describe, it, expect, vi } from 'vitest'
import ColorStringifier from './ColorStringifier'
import OffscreenCanvasMock from '@/test/mocks/OffscreenCanvas'

vi.stubGlobal('OffscreenCanvas', OffscreenCanvasMock)

describe('ColorStringifier', () => {
  it('should stringify color', () => {
    expect(ColorStringifier.stringify([1, 1, 1, 1], 'hex')).toBe('#ffffffff')
    expect(ColorStringifier.stringify([1, 1, 1, 1], 'rgb')).toBe('rgb(255, 255, 255)')
    expect(ColorStringifier.stringify([1, 1, 1, 1], 'rgba')).toBe('rgba(255, 255, 255, 1)')
    expect(ColorStringifier.stringify([1, 1, 1, 1], 'hsl')).toBe('hsl(0, 0%, 100%)')
    expect(ColorStringifier.stringify([1, 1, 1, 1], 'hsla')).toBe('hsla(0, 0%, 100%, 1)')

  })
})
