import ShapeType from '@/pixel/enums/ShapeType'

export const useShapeStore = defineStore('shape', () => {
  const type = ref(ShapeType.LINE)
  const filled = ref(false)
  const lockAspectRatio = ref(false)

  function setType(shapeType) {
    type.value = shapeType
  }

  function toggleFill() {
    filled.value = !filled.value
  }

  function toggleLockAspectRatio() {
    lockAspectRatio.value = !lockAspectRatio.value
  }

  return {
    type,
    filled,
    lockAspectRatio,
    setType,
    toggleFill,
    toggleLockAspectRatio
  }
})

export default useShapeStore
