import PencilShape from '@/pixel/enums/PencilShape'

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
    pixelPerfect
  }
})
