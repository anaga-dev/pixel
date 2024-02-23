/**
 * @readonly
 */
export const Zoom = {
  /** Default zoom */
  DEFAULT: 1,
  /** Max zoom */
  MAX: 64,
  /** Min zoom */
  MIN: 1
}

/**
 * @readonly
 * @enum {number}
 */
export const ZoomDeltaMode = {
  /** Pixel */
  PIXEL: 0,
  /** Line */
  LINE: 1,
  /** Page */
  PAGE: 2
}

/**
 *
 *
 * @param {ZoomComposableOptions} options
 * @returns {ZoomComposable}
 */
export function useZoom(options) {
  const current = ref(options?.initial ?? Zoom.DEFAULT)
  const percentage = computed(() => `${Math.round(current.value * 100)}%`)

  /**
   * Reset zoom to default
   */
  function reset() {
    current.value = Zoom.DEFAULT
  }

  /**
   * Increase zoom (x2)
   */
  function increase() {
    if (current.value < Zoom.MAX) {
      current.value *= 2
    }
  }

  /**
   * Decrease zoom (x0.5)
   */
  function decrease() {
    if (current.value > Zoom.MIN) {
      current.value *= 0.5
    }
  }

  /**
   * Increase or decrease zoom by a relative value
   *
   * @param {number} value
   */
  function relative(value) {
    if (current.value * value < Zoom.MAX && current.value * value > Zoom.MIN) {
      current.value *= value
    } else if (current.value * value >= Zoom.MAX) {
      current.value = Zoom.MAX
    } else if (current.value * value <= Zoom.MIN) {
      current.value = Zoom.MIN
    }
  }

  /**
   * Return a multiplier value based on delta and deltaMode
   *
   * TODO: See what are useful multipliers for LINE and PAGE
   *
   * @param {number} delta
   * @param {ZoomDeltaMode} deltaMode
   * @returns {number}
   */
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

  /**
   * Increase or decrease zoom by a delta value
   *
   * @param {number} delta
   * @param {ZoomDeltaMode} deltaMode
   */
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

  /**
   * Sets zoom using a wheel event.
   *
   * @param {WheelEvent} e
   */
  function fromEvent(e) {
    delta(e.deltaY, e.deltaMode)
  }

  /**
   * Set zoom to a specific value
   *
   * @param {number} zoom
   */
  function set(zoom) {
    current.value = zoom >= 1 ? zoom * 0.1 : 1
  }

  return {
    current,
    percentage,
    reset,
    increase,
    decrease,
    relative,
    delta,
    fromEvent,
    set
  }
}
