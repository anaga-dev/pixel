export function useDrawingRect(board, position, zoom, w, h) {
  const x = computed(() => (board.value?.width || 0) / 2 + position.x.value * zoom.current.value)
  const y = computed(() => (board.value?.height || 0) / 2 + position.y.value * zoom.current.value)
  const width = computed(() => w.value * zoom.current.value)
  const height = computed(() => h.value * zoom.current.value)
  return {
    x, y, width, height
  }
}
