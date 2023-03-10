import { ref, computed } from 'vue'

export function useTools({
  initial = 'draw',
  list = [],
} = {}) {
  const current = ref(initial)
  const available = ref(list)
  return {
    current,
    available,
    set(newValue) {
      if (available.includes(newValue)) {
        current.value = newValue
      }
    }
  }
}
