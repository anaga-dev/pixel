import Canvas from '@/pixel/canvas/Canvas'
import SelectionType from '@/pixel/selection/SelectionType'
import Selection from '@/pixel/selection/Selection'

export const useSelectionStore = defineStore('selection', () => {
  const selection = new Selection()

  const type = ref(selection.type)
  const mode = ref(selection.mode)

  // sólo válido en el modo de color
  const contiguous = ref(true)
  const visible = ref(false)

  watch(type, (newType) => selection.type = newType)
  watch(mode, (newMode) => selection.mode = newMode)
  watch(contiguous, (newContiguous) => selection.contiguous = newContiguous)
  watch(visible, (newVisible) => selection.visible = newVisible)

  return {
    type,
    mode,
    visible,
    contiguous,
    getCanvas() {
      return selection.canvas
    },
    getMaskImageData() {
      return selection.mask?.imageData
    },
    clear() {
      visible.value = false
      return selection.clear()
    },
    init(width, height) {
      selection.setup(width, height)
    },
    start(x, y) {
      return selection.start(x, y)
    },
    update(x, y) {
      return selection.update(x, y)
    },
    end(x, y) {
      visible.value = true
      return selection.end(x, y)
    },
    render(width, height) {
      return selection.render(width, height)
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSelectionStore, import.meta.hot))
}
