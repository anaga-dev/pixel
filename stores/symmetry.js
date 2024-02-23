import { usePoint } from '@/composables/usePoint'

export const useSymmetryStore = defineStore('symmetry', () => {
  const axis = ref(null)
  const position = usePoint()
  const lock = ref(false)

  function createSymmetryFunction(coords, callback) {
    if (coords !== 2 && coords !== 4) {
      throw new Error('Invalid number of coordinates')
    }
    if (coords === 2) {
      return function symmetry2(imageData, x, y, options) {
        callback(imageData, x, y, options)
        if (axis.value === null) {
          return
        }
        if (axis.value === SymmetryAxis.HORIZONTAL) {
          callback(imageData, imageData.width - 1 - x, y, options)
        } else if (axis.value === SymmetryAxis.VERTICAL) {
          callback(imageData, x, imageData.height - 1 - y, options)
        } else if (axis.value === SymmetryAxis.BOTH) {
          callback(imageData, imageData.width - 1 - x, y, options)
          callback(imageData, x, imageData.height - 1 - y, options)
          callback(
            imageData,
            imageData.width - 1 - x,
            imageData.height - 1 - y,
            options
          )
        }
      }
    } else if (coords === 4) {
      return function symmetry4(imageData, x1, y1, x2, y2, options) {
        callback(imageData, x1, y1, x2, y2, options)
        if (axis.value === null) {
          return
        }
        if (axis.value === SymmetryAxis.HORIZONTAL) {
          callback(
            imageData,
            width.value - 1 - x1,
            y1,
            width.value - 1 - x2,
            y2,
            options
          )
        } else if (axis.value === SymmetryAxis.VERTICAL) {
          callback(
            imageData,
            x1,
            imageData.height - 1 - y1,
            x2,
            imageData.height - 1 - y2,
            options
          )
        } else if (axis.value === SymmetryAxis.BOTH) {
          callback(
            imageData,
            width.value - 1 - x1,
            y1,
            width.value - 1 - x2,
            y2,
            options
          )
          callback(
            imageData,
            x1,
            imageData.height - 1 - y1,
            x2,
            imageData.height - 1 - y2,
            options
          )
          callback(
            imageData,
            width.value - 1 - x1,
            imageData.height - 1 - y1,
            width.value - 1 - x2,
            imageData.height - 1 - y2,
            options
          )
        }
      }
    }
  }

  return {
    axis,
    position,
    lock,
    createSymmetryFunction,
  }
})

export default useSymmetryStore
