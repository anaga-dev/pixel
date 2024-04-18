import SymmetryAxis from '@/pixel/enums/SymmetryAxis.js'
import { usePoint } from '@/composables/usePoint'

export const useSymmetryStore = defineStore('symmetry', () => {
  const axis = ref(null)
  const position = usePoint()
  const lock = ref(false)

  return {
    axis,
    position,
    lock,
    setAxis(value) {
      if (!Object.values(SymmetryAxis).includes(value)) {
        throw new Error(`Invalid symmetry axis: ${value}`)
      }
      axis.value = value
    },
    setLock(value) {
      if (typeof value !== 'boolean') {
        throw new Error(`Invalid lock value: ${value}`)
      }
      lock.value = value
    },
    setPositionFromCoords(x, y) {
      if (!Number.isFinite(x)
       || !Number.isFinite(y)
       || !Number.isInteger(x)
       || !Number.isInteger(y)) {
        throw new Error(`Invalid position: ${x}, ${y}`)
      }
      position.set(x, y)
    }
  }
})

export default useSymmetryStore
