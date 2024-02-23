export function useRect(options) {
  const x = ref(options?.x || 0)
  const y = ref(options?.y || 0)
  const width = ref(options?.width || 0)
  const height = ref(options?.height || 0)
  return {
    x, y, width, height
  }
}
