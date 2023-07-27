import Color from '@/pixel/color/Color'

/**
 *
 * @param {string} string
 * @returns {Color}
 */
export function useColor(string) {
  const PERCENTAGE = 101
  const max = (r, g, b) => Math.max(r, g, b)
  const min = (r, g, b) => Math.min(r, g, b)
  const range = (r, g, b) => max(r, g, b) - min(r, g, b)
  const l = (r, g, b) => (max(r, g, b) + min(r, g, b)) / 2
  const s = (r, g, b) => {
    const R = range(r, g, b)
    if (R === 0) return 0

    const L = l(r, g, b)
    if (L > 0.5) return R / (2 * L)

    return R / (2 - 2 * L)
  }
  const h = (r, g, b) => {
    const R = range(r, g, b)
    if (R === 0) return 0
    const M = max(r, g, b)
    if (r === M) return (g - b) / R
    else if (g === M) return (b - r) / R + 2
    else if (b === M) return (r - g) / R + 4
    return 0
  }

  const rgb = reactive({
    r: 0,
    g: 0,
    b: 0
  })

  const hsl = reactive({
    h: 0,
    s: 0,
    l: 0
  })

  function setFromRGB(r, g, b) {
    rgb.r = r
    rgb.g = g
    rgb.b = b
    updateFromRGB(r, g, b)
  }

  function updateFromRGB(r, g, b) {
    hsl.h = h(r, g, b)
    hsl.s = s(r, g, b)
    hsl.l = l(r, g, b)
  }

  function updateFromHSL(h, s, l) {
    const H = h
    const C = (1 - Math.abs(2 * l - 1)) * s
    const X = C * (1 - Math.abs((h % 2) - 1))
    let r = 0,
      g = 0,
      b = 0
    if (H < 1) {
      r = C
      g = X
    } else if (H < 2) {
      r = X
      g = C
    } else if (H < 3) {
      g = C
      b = X
    } else if (H < 4) {
      g = X
      b = C
    } else if (H < 5) {
      r = X
      b = C
    } else if (H < 6) {
      r = C
      b = X
    }
    const m = l - C / 2
    rgb.r = r + m
    rgb.g = g + m
    rgb.b = b + m
  }

  setFromRGB(...Color.parse(string))

  const red = computed({
    set(value) {
      rgb.r = value / 0xff
      updateFromRGB(rgb.r, rgb.g, rgb.b)
    },
    get() {
      return ~~(rgb.r * 0xff)
    }
  })
  const green = computed({
    set(value) {
      rgb.g = value / 0xff
      updateFromRGB(rgb.r, rgb.g, rgb.b)
    },
    get() {
      return ~~(rgb.g * 0xff)
    }
  })
  const blue = computed({
    set(value) {
      rgb.b = value / 0xff
      updateFromRGB(rgb.r, rgb.g, rgb.b)
    },
    get() {
      return ~~(rgb.b * 0xff)
    }
  })
  const hue = computed({
    set(value) {
      hsl.h = (value / 60) % 6
      updateFromHSL(hsl.h, hsl.s, hsl.l)
    },
    get() {
      return ~~(360 + hsl.h * 60) % 360
    }
  })
  const saturation = computed({
    set(value) {
      hsl.s = value / PERCENTAGE
      updateFromHSL(hsl.h, hsl.s, hsl.l)
    },
    get() {
      return ~~(hsl.s * PERCENTAGE)
    }
  })
  const lightness = computed({
    set(value) {
      hsl.l = value / PERCENTAGE
      updateFromHSL(hsl.h, hsl.s, hsl.l)
    },
    get() {
      return ~~(hsl.l * PERCENTAGE)
    }
  })

  const value = computed(() => max(rgb.r, rgb.g, rgb.b))
  const valueSaturation = computed(() => 1 - (min(rgb.r, rgb.g, rgb.b) / max(rgb.r, rgb.g, rgb.b)))

  const style = computed({
    set(value) {
      setFromRGB(...Color.parse(value))
    },
    get() {
      return `rgb(${red.value}, ${green.value}, ${blue.value})`
    }
  })

  return {
    style,
    red,
    green,
    blue,
    value,
    valueSaturation,
    hue,
    saturation,
    lightness
  }
}
