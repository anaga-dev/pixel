import TransformMode from '@/pixel/enums/TransformMode'

export const useTransformStore = defineStore('transform', () => {
  const mode = ref(TransformMode.REPEAT)
  return {
    mode
  }
})

export default useTransformStore
