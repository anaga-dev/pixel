import FillType from '@/pixel/enums/FillType.js'

export const useFillStore = defineStore('fill', () => {
  const type = ref(FillType.FILL)
  const contiguous = ref(true)
  return {
    type,
    contiguous
  }
})
