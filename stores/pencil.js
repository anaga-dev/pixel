import PencilShape from '@/pixel/enums/PencilShape'
import { useDither } from '@/composables/useDither'

export const usePencilStore = defineStore('pencil', () => {
  const shape = ref(PencilShape.ROUND)
  const size = ref(1)
  const sizeHalf = computed(() => size / 2)
  const dither = useDither()
  const pixelPerfect = ref(false)
  return {
    shape,
    size,
    sizeHalf,
    dither,
    pixelPerfect,
    setShape(value) {
      if (!Object.values(PencilShape).includes(value)) {
        throw new Error(`Invalid pencil shape: ${value}`)
      }
      shape.value = value
      if (shape.value !== PencilShape.DITHER) {
        dither.level = 0
        dither.reset()
      }
    },
    setSize(value) {
      if (typeof value !== 'number' || value < 1 || !Number.isInteger(value)) {
        throw new Error(`Invalid pencil size: ${value}`)
      }
      size.value = value
    },
  }
})
