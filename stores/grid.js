import { defineStore } from "pinia";

export const useGridStore = defineStore('grid', () => {
  const enabled = ref(false)
  const size = ref(32)
  const color = ref('#00ffff')
  return {
    enabled,
    size,
    color
  }
})

export default useGridStore
