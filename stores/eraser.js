import { EraserShape } from '@/pixel/enums/EraserShape'

export const useEraserStore = defineStore('eraser', () => {
  const shape = ref(EraserShape.ROUND)
  const size = ref(1)
  const sizeHalf = computed(() => size / 2)
  const dither = useDither()

  return {
    shape,
    size,
    sizeHalf,
    dither,
    setShape(value) {
      if (!Object.values(EraserShape).includes(value)) {
        throw new Error(`Invalid eraser shape: ${value}`)
      }
      shape.value = value
      if (shape.value !== EraserShape.DITHER) {
        dither.level = 0
        dither.reset()
      }
    },
    setSize(value) {
      if (typeof value !== 'number' || value < 1 || !Number.isInteger(value)) {
        throw new Error(`Invalid eraser size: ${value}`)
      }
      size.value = value
    }
  }
})
