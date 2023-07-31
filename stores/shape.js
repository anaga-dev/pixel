import ShapeType from '@/pixel/enums/ShapeType'

export const useShapeStore = defineStore('shape', () => {
  const type = ref(ShapeType.LINE)
  const filled = ref(false)
  const lockAspectRatio = ref(false)
  return {
    type,
    filled,
    lockAspectRatio
  }
})

export default useShapeStore
