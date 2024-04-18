import { defineStore } from "pinia";

export const useGridStore = defineStore('grid', () => {
  const enabled = ref(false)
  const size = ref(32)
  const color = ref('#00ffff')
  return {
    enabled,
    size,
    color,
    toggle() {
      enabled.value = !enabled.value
    },
    setSize(value) {
      if (typeof value !== 'number' || value < 1 || !Number.isInteger(value)) {
        throw new Error(`Invalid grid size: ${value}`)
      }
      size.value = value
    },
    setColor(value) {
      if (typeof value !== 'string') {
        throw new Error(`Invalid grid color: ${value}`)
      }
      color.value = value
    }
  }
})

export default useGridStore
