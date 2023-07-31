import Canvas from '@/pixel/canvas/Canvas'
import CanvasContext2D from '@/pixel/canvas/CanvasContext2D'
import SelectType from '@/pixel/enums/SelectType'
import SelectMode from '@/pixel/enums/SelectMode'

export const useSelectionStore = defineStore('selection', () => {
  const type = ref(SelectType.FREEHAND) // freehand, rectangular, color
  const mode = ref(SelectMode.ADD) // add, subtract, transform
  const contiguous = ref(true) // sólo válido en el modo de color

  const polygon = []

  let canvas = null
  let context = null
  let maskCanvas = null
  let maskContext = null
  let maskImageData = null
  let patternCanvas = null
  let patternMatrix = null
  let pattern = null

  function init(target, width, height) {
    polygon.length = 0

    canvas = Canvas.createOrGet(canvas, width, height)
    context = CanvasContext2D.get(canvas)

    // FIXME: Esto debería hacerse en alguna otra parte, no me gusta
    // que se haga aquí, hace el código más farragoso y difícil de leer.
    const onPointer = (e) => {
      const { top, left, width, height } = target.getBoundingClientRect()
      const x = (e.clientX - left) / width
      const y = (e.clientY - top) / height

      if (e.type === 'pointerdown') {
        polygon.length = 0
        if (type.value === SelectType.RECTANGULAR) {
          polygon.push([x, y], [x, y], [x, y], [x, y])
        } else if (type.value === SelectType.COLOR) {
          // TODO: Esto debería hacerse en el setter de
          // selectionMaskImageData
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

        // TODO: Si el modo de selección de polígonos no es Freehand
        // y es "rectangular", entonces lo que hacemos es dibujar un polígono
        // rectangular que se redimensiona según el movimiento del ratón.

        if (type.value !== SelectType.COLOR) {
          window.addEventListener('pointermove', onPointer)
          window.addEventListener('pointerup', onPointer)
        } else {
          return
        }
      } else if (e.type === 'pointerup') {
        window.removeEventListener('pointermove', onPointer)
        window.removeEventListener('pointerup', onPointer)
      }

      if (e.type !== 'pointerup') {
        // TODO: Esto debería ir a una especie de
        // composable que podría ser algo como
        // selection.closePolygon()
        if (type.value === SelectType.FREEHAND) {
          polygon.push([x, y])
        } else if (type.value === SelectType.RECTANGULAR) {
          polygon[1][0] = x
          polygon[2][0] = x
          polygon[2][1] = y
          polygon[3][1] = y
        }
      } else {
        // Aquí convertimos el área del polígono en la máscara de selección
        // es decir, rasterizamos el path en píxeles.
        const path = new Path2D()
        for (let index = 0; index < polygon.length; index++) {
          const [x, y] = polygon[index]
          const tx = x * canvas.width
          const ty = y * canvas.height
          if (index === 0) {
            path.moveTo(tx, ty)
          } else {
            path.lineTo(tx, ty)
          }
        }
        path.closePath()

        // TODO: Aquí habría que hacer un fill de la máscara de selección
        //       y obtener esa máscara en un ImageData donde cualquier pixel
        //       con alpha > 0 es parte de la máscara.
        maskContext = CanvasContext2D.get(maskCanvas, {
          willReadFrequently: true
        })
        // maskContext.clearRect(0,0,maskCanvas.width,maskCanvas.height)
        if (mode.value === SelectMode.ADD) {
          maskContext.globalCompositeOperation = 'source-over'
        } else if (mode.value === SelectMode.SUBTRACT) {
          maskContext.globalCompositeOperation = 'destination-out'
        }
        maskContext.fillStyle = '#f00'
        maskContext.fill(path)

        // Obtenemos el ImageData.
        maskImageData = maskContext.getImageData(
          0,
          0,
          maskCanvas.width,
          maskCanvas.height
        )
        for (
          let index = 0;
          index < maskImageData.data.length;
          index += 4
        ) {
          const alpha = maskImageData.data[index + 3]
          if (alpha > 0) {
            maskImageData.data[index + 3] = 255
          }
        }
        maskContext.putImageData(maskImageData, 0, 0)
        polygon.length = 0
      }
    }

    canvas.addEventListener('pointerdown', onPointer)

    maskCanvas = Canvas.createOrGet(maskCanvas, width, height)
    maskImageData = null

    function createMatrix() {
      return new DOMMatrix()
    }

    const SIZE = 8
    const SIZE_HALF = SIZE >> 1

    patternCanvas = Canvas.createOffscreen(SIZE, SIZE)
    const patternCx = CanvasContext2D.get(patternCanvas)
    patternCx.fillStyle = '#fff'
    patternCx.fillRect(0, 0, SIZE, SIZE)
    patternCx.fillStyle = '#000'
    patternCx.fillRect(0, 0, SIZE_HALF, SIZE_HALF)
    patternCx.fillRect(SIZE_HALF, SIZE_HALF, SIZE_HALF, SIZE_HALF)
    patternMatrix = createMatrix()
    pattern = context.createPattern(patternCanvas, 'repeat')
  }

  return {
    type,
    mode,
    contiguous,
    getPolygon() {
      return polygon
    },
    getCanvas() {
      return canvas
    },
    getMaskCanvas() {
      return maskCanvas
    },
    getMaskImageData() {
      return maskImageData
    },
    getPattern() {
      return pattern
    },
    getPatternMatrix() {
      return patternMatrix
    },
    init
  }
})
