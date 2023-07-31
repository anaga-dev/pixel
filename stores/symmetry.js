import { usePoint } from '@/composables/usePoint'

export const useSymmetryStore = defineStore('symmetry', () => {
  const axis = ref(null)
  const position = usePoint()
  const lock = ref(false)

  return {
    axis,
    position,
    lock
  }
})

export default useSymmetryStore
