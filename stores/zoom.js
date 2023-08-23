export const useZoomStore = defineStore('zoom', () => {
  const Zoom = {
    DEFAULT: 1,
    MAX: 64,
    MIN: 1
  }

  const current = ref(Zoom.DEFAULT)
  const percentage = computed(() => `${Math.round(current.value * 100)}%`)

  function reset() {
    current.value = Zoom.DEFAULT
  }

  function half() {
    if (current.value > Zoom.MIN) {
      current.value *= 0.5
    }
  }

  function double() {
    if (current.value < Zoom.MAX) {
      current.value *= 2
    }
  }

  function increase() {
    if (current.value < Zoom.MAX) {
      current.value *= 2
    }
  }

  function decrease() {
    if (current.value > Zoom.MIN) {
      current.value *= 0.5
    }
  }

  function relative(value) {
    if (current.value * value < Zoom.MAX && current.value * value > Zoom.MIN) {
      current.value *= value
    } else if (current.value * value >= Zoom.MAX) {
      current.value = Zoom.MAX
    } else if (current.value * value <= Zoom.MIN) {
      current.value = Zoom.MIN
    }
  }

  function deltaMultiplier(delta, deltaMode) {
    switch (deltaMode) {
      case 0: // PIXEL
        return delta * 0.01
      case 1: // LINE
      case 2: // PAGE
      default:
        return delta * 0.01
    }
  }

  function delta(delta, deltaMode = 0) {
    const value = -deltaMultiplier(delta, deltaMode)
    if (
      current.value + value >= Zoom.MIN &&
      current.value + value <= Zoom.MAX
    ) {
      current.value += value
    } else if (current.value * value >= Zoom.MAX) {
      current.value = Zoom.MAX
    } else if (current.value * value <= Zoom.MIN) {
      current.value = Zoom.MIN
    }
  }

  function fromEvent(e) {
    delta(e.deltaY, e.deltaMode)
  }

  function set(zoom) {
    current.value = zoom >= 1 ? zoom * 0.1 : 1
  }

  return {
    current,
    percentage,
    reset,
    half,
    double,
    increase,
    decrease,
    relative,
    delta,
    fromEvent,
    set
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useZoomStore, import.meta.hot))
}
