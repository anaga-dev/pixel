function useDrawingPoint(point, rect, width, height) {
  const x = computed(() => Math.floor(((point.x.value - rect.x.value) / rect.width.value) * width.value))
  const y = computed(() => Math.floor(((point.y.value - rect.y.value) / rect.height.value) * height.value))
  return {
    x,
    y
  }
}

export function useDrawingPointer(pointer, rect, width, height) {
  const start = useDrawingPoint(pointer.start, rect, width, height)
  const current = useDrawingPoint(pointer.current, rect, width, height)
  const previous = useDrawingPoint(pointer.previous, rect, width, height)
  const end = useDrawingPoint(pointer.end, rect, width, height)
  return {
    start,
    current,
    previous,
    end
  }
}
