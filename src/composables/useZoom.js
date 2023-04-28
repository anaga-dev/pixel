import { ref, computed } from 'vue'

export function useZoom({ initial = 1, max = 64, min = 1, defaultStep = 1 } = {}) {
  const current = ref(initial)
  const percentage = computed(() => `${Math.round(current.value * 100)}%`)
  return {
    current,
    percentage,
    reset() {
      current.value = initial
    },
    half() {
      current.value *= 0.5
    },
    double() {
      current.value *= 2
    },
    increase(step = defaultStep) {
      if (current.value < max) {
        current.value += step
      }
    },
    decrease(step = defaultStep) {
      if (current.value > min) {
        current.value -= step
      }
    },
    relative(value) {
      if (current.value * value < max && current.value * value > min) {
        current.value *= value
      } else if (current.value * value >= max) {
        current.value = max
      } else if (current.value * value <= min) {
        current.value = min
      }
    },
    setZoom(zoom) {
      current.value = zoom >= 1 ? zoom * 0.1 : 1
    }
  }
}
