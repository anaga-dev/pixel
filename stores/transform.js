import TransformMode from '@/pixel/enums/TransformMode'
import { useLayersStore } from '@/stores/layers'

export const useTransformStore = defineStore('transform', () => {
  const layersStore = useLayersStore()

  const mode = ref(TransformMode.REPEAT)
  const tiling = ref(false)
  const boundaries = ref(null)

  function getLayerBoundaries() {
    const canvas = layersStore.current.canvas
    let ctx = canvas.getContext('2d')
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let data = imageData.data

    let minX = canvas.width
    let minY = canvas.height
    let maxX = 0
    let maxY = 0

    for (let y = 0; y < canvas.height; y++) {
      let rowHasPaint = false
      for (let x = 0; x < canvas.width; x++) {
        let alpha = data[(y * canvas.width + x) * 4 + 3]
        if (alpha > 0) {
          rowHasPaint = true
          minX = Math.min(minX, x)
          maxX = Math.max(maxX, x)
        }
      }
      if (rowHasPaint) {
        minY = Math.min(minY, y)
        maxY = y // maxY can always be set to the current row, as rows are scanned in order
      }
    }

    if (minX <= maxX && minY <= maxY) {
      return {
        x: minX,
        y: minY,
        width: maxX - minX + 1,
        height: maxY - minY + 1
      }
    } else {
      return null
    }
  }
  function toggleTiling() {
    tiling.value = !tiling.value
  }

  return {
    mode,
    tiling,
    boundaries,
    toggleTiling,
    getLayerBoundaries
  }
})
