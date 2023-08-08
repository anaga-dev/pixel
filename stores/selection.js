import Canvas from '@/pixel/canvas/Canvas'
import CanvasContext2D from '@/pixel/canvas/CanvasContext2D'
import SelectionType from '@/pixel/selection/SelectionType'
import Selection from '@/pixel/selection/Selection'

export const useSelectionStore = defineStore('selection', () => {
  const selection = new Selection()

  const typeRef = ref(selection.type)
  const modeRef = ref(selection.mode)

  // freehand, rectangular, color
  const type = computed({
    set(newType) {
      selection.type = newType
      typeRef.value = newType
    },
    get() {
      return typeRef.value
    }
  })

  // add, subtract, transform
  const mode = computed({
    set(newMode) {
      selection.mode = newMode
      modeRef.value = newMode
    },
    get() {
      return modeRef.value
    }
  })

  // sólo válido en el modo de color
  const contiguous = ref(true)
  const visible = ref(false)

  let canvas = null
  let context = null

  function init(target, width, height) {
    selection.setup(width, height)

    canvas = Canvas.createOrGet(canvas, width, height)
    context = CanvasContext2D.get(canvas)

    const onPointer = (e) => {
      // Set the selection as visible
      visible.value = true

      // Get the relative coordinates of the pointer
      const { top, left, width, height } = target.getBoundingClientRect()
      const x = (e.clientX - left) / width
      const y = (e.clientY - top) / height

      if (e.type === 'pointerdown') {
        polygon.length = 0
        if (type.value === SelectType.RECTANGULAR) {
          polygon.push([x, y], [x, y], [x, y], [x, y])
        } else if (type.value === SelectType.COLOR) {
          // TODO: This should be in selectionMaskImageData setter.
          maskContext = CanvasContext2D.get(maskCanvas, {
            willReadFrequently: true
          })

          // Si ya existía un MaskImageData lo utilizamos
          // si no, creamos uno nuevo utilizando el contexto
          // del canvas de selección.
          const selectionMaskImageData = !maskImageData
            ? maskContext.createImageData(width, height)
            : maskImageData

          // Dependiendo de si estamos añadiendo o sustrayendo
          // usamos una máscara u otra.
          const maskColor =
            mode.value === SelectMode.ADD ? [0xff, 0, 0, 0xff] : [0, 0, 0, 0]

          if (!contiguous.value) {
            ImageDataUtils.copySelectedAt(
              selectionMaskImageData,
              imageData,
              Math.floor(x * width),
              Math.floor(y * height),
              maskColor
            )
          } else {
            ImageDataUtils.copyContiguousSelectedAt(
              selectionMaskImageData,
              imageData,
              Math.floor(x * width),
              Math.floor(y * height),
              maskColor
            )
          }
          maskImageData = selectionMaskImageData
          maskContext.putImageData(maskImageData, 0, 0)
        }

        // TODO: When polygon selection mode isn't Freehand but rectangular,
        // we need to draw a rectangular polygon that resizes according to 
        // the mouse movement.

        if (type.value !== SelectType.COLOR) {
          window.addEventListener('pointermove', onPointer)
          window.addEventListener('pointerup', onPointer)
        }
      } else if (e.type === 'pointermove') {
        selection.update(x, y)
      } else if (e.type === 'pointerup') {
        selection.end(x, y)
        window.removeEventListener('pointermove', onPointer)
        window.removeEventListener('pointerup', onPointer)
      }
    }

    canvas.addEventListener('pointerdown', onPointer)
  }

  return {
    type,
    mode,
    visible,
    contiguous,
    getCanvas() {
      return canvas
    },
    getMaskCanvas() {
      return selection.mask?.canvas ?? null
    },
    getMaskImageData() {
      return selection.mask?.imageData ?? null
    },
    getPattern() {
      return selection.pattern
    },
    getPath2D(width, height) {
      return selection.getPath2D(width, height)
    },
    clear() {
      visible.value = false
      return selection.clear()
    },
    init
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSelectionStore, import.meta.hot))
}
