import FillType from '@/pixel/enums/FillType.js'

export const useFillStore = defineStore('fill', () => {
  const type = ref(FillType.FILL)
  const contiguous = ref(true)
  return {
    type,
    contiguous,
    setType(value) {
      if (!Object.values(FillType).includes(value)) {
        throw new Error(`Invalid fill type: ${value}`)
      }
      type.value = value
    },
    setContiguous(value) {
      if (typeof value !== 'boolean') {
        throw new Error(`Invalid contiguous value: ${value}`)
      }
      contiguous.value = value
    }
  }
})
