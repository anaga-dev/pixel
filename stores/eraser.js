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
    dither
  }
})
