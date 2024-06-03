import { v4 as uuid } from 'uuid'
import Color from '@/pixel/color/Color'
import ColorMode from '@/pixel/enums/ColorMode'
import Canvas from '@/pixel/canvas/Canvas'
import CanvasContext2D from '@/pixel/canvas/CanvasContext2D'
import ImageDataUtils from '@/pixel/imagedata/ImageDataUtils.js'
import PrecomputedCircle from '@/pixel/imagedata/PrecomputedCircle.js'
import Transform from '@/pixel/imagedata/Transform.js'
import SymmetryAxis from '@/pixel/enums/SymmetryAxis'
import Tool from '@/pixel/enums/Tool'
import PencilShape from '@/pixel/enums/PencilShape'
import ShapeType from '@/pixel/enums/ShapeType'
import FillType from '@/pixel/enums/FillType'
import PaletteTypes from '@/pixel/constants/PaletteTypes'
import ImageTypes from '@/pixel/constants/ImageTypes'
import ToolSettings from '@/pixel/constants/ToolSettings'
import Interpolation from '@/pixel/math/Interpolation'
import SelectionType from '@/pixel/selection/SelectionType'

import FilePicker from '@/pixel/io/FilePicker'

import GIMP from '@/pixel/formats/palettes/GIMP'
import ACT from '@/pixel/formats/palettes/ACT'
import PAL from '@/pixel/formats/palettes/PAL'

// import TGA from '@/pixel/formats/images/TGA.js'
// import PCX from '@/pixel/formats/images/PCX.js'
// import BMP from '@/pixel/formats/images/BMP.js'
// import Aseprite from '../pixel/formats/images/Aseprite.js'
import OpenRaster from '@/pixel/formats/images/OpenRaster.js'
import WebImage from '@/pixel/formats/images/WebImage.js'

import { reverse } from '@/pixel/generators/reverse'
import { symmetryAxis } from '@/pixel/symmetry/axis.js'
import { symmetryPoint } from '@/pixel/symmetry/point.js'

import { usePoint } from '@/composables/usePoint'
import { useRect } from '@/composables/useRect'
import { useDrawingRect } from '../composables/useDrawingRect'
import { useDrawingPointer } from '../composables/useDrawingPointer'
import { useZoom } from '@/composables/useZoom'
import useInput from '@/composables/useInput'
import { useMagicKeys } from '@vueuse/core'
import { useLayersStore } from './layers'
import { useAnimationStore } from './animation'
import { useHistoryStore } from './history'
import { useEraserStore } from './eraser'
import { usePencilStore } from './pencil'
import { useFillStore } from './fill'
import { usePaletteStore } from './palette'
import { useGridStore } from './grid'
import { useSymmetryStore } from './symmetry'
import { useOnionSkin } from './onionSkin'
import { useShapeStore } from './shape'
import { useTransformStore } from './transform'
import { useSelectionStore } from './selection'

/**
 * is the Document type that is used when
 * loading and saving a document.
 *
 * @typedef {Object} Document
 * @property {number} width
 * @property {number} height
 * @property {Array<Layer>} layers
 */

export const useDocumentStore = defineStore('document', () => {
  const state = ref('pending')
  const name = ref(null)
  const board = ref(null)
  const keys = useMagicKeys()
  const width = ref(0)
  const height = ref(0)
  const position = usePoint()
  const zoom = useZoom()
  const canvas = ref(null)
  const canvasRect = ref(null)
  const tool = ref(Tool.PENCIL)
  const isMoving = ref(false)
  const isUsingTool = ref(false)
  const copyImageData = ref(null)
  const drawingImageData = ref(null)
  const drawingCanvas = ref(null)
  const copyCanvas = ref(null)
  const previewCanvas = ref(null)
  const modified = ref(false)
  const color = ref('#000000')
  const colorMode = ref(ColorMode.HSL)
  const colorPicker = ref(false)
  const grid = useGridStore()
  const symmetry = useSymmetryStore()
  const onionSkin = useOnionSkin()
  const pencil = usePencilStore()
  const eraser = useEraserStore()
  const fill = useFillStore()
  const shape = useShapeStore()
  const transform = useTransformStore()
  const selection = useSelectionStore()
  const dropper = ref({
    selectCompositeColor: false,
    includeReferenceLayers: true
  })
  const history = useHistoryStore()
  const layers = useLayersStore()
  const palette = usePaletteStore()
  const animation = useAnimationStore()
  const pointer = useInput()
  const drawingRect = useDrawingRect(board, position, zoom, width, height)
  const drawingPointer = useDrawingPointer(pointer, drawingRect, width, height)
  const isSelectionVisible = ref(false)

  // TODO: Esto no debería estar aquí.
  let frameId = null
  let startTime
  let drawTimeout

  function onFrame(currentTime) {
    if (startTime === undefined) {
      startTime = currentTime
    }
    if (currentTime - startTime > 33) {
      startTime = currentTime
      redrawAll()
    }
    frameId = requestAnimationFrame(onFrame)
  }

  // TODO: Meter toda esta lógica de redrawing
  // en una función o algo así y que el watcher
  // se añada también a otras acciones que
  // ahora mismo se llaman de forma no reactiva.
  watch(position.x, () => redrawAll())
  watch(position.y, () => redrawAll())
  watch(zoom.current, () => redrawAll())
  watch(isSelectionVisible, (newVisible) => {
    if (newVisible === false) {
      cancelAnimationFrame(frameId)
    } else {
      frameId = requestAnimationFrame(onFrame)
    }
  })

  // Frames that will be shown in the animation preview.
  const frames = ref([])

  const layer = computed(() => layers.current)
  const imageData = computed(() => {
    if (!layer.value) {
      return null
    }
    const frame = animation.current
    return layer.value.frames[frame]
  })

  function setName(n) {
    name.value = n
  }

  function startMoving() {
    isMoving.value = true
  }

  function stopMoving() {
    isMoving.value = false
  }

  function updateCanvasRect() {
    // We need to get client rect so we can calculate
    // the selection canvas position.
    if (!canvas.value) return

    canvasRect.value = canvas.value.getBoundingClientRect()
  }

  function toggleColorPicker() {
    colorPicker.value = !colorPicker.value
  }

  function setPencilShape(shape) {
    pencil.setShape(shape)
  }

  function setPencilSize(size) {
    pencil.setSize(size)
  }

  function setPencilDitherLevel(level) {
    pencil.dither.setLevel(level)
  }

  function setEraserShape(shape) {
    eraser.setShape(shape)
  }

  function setEraserSize(size) {
    eraser.setSize(size)
  }

  function setEraserDitherLevel(level) {
    eraser.dither.setLevel(level)
  }

  function setSelectType(type) {
    selection.type = type
  }

  function setSelectMode(mode) {
    selection.mode = mode
  }

  function toggleSelectContiguous() {
    selection.contiguous = !selection.contiguous
  }

  function deselect() {
    selection.clear()
    isSelectionVisible.value = false
  }

  function setFillType(type) {
    fill.setType(type)
  }

  function toggleFillContiguous() {
    fill.setContiguous(!fill.contiguous)
  }

  function setShapeType(type) {
    shape.setType(type)
  }

  function toggleShapeFill() {
    shape.toggleFill()
  }

  function toggleShapeLockAspectRatio() {
    shape.toggleLockAspectRatio()
  }

  function setSymmetrySettings(axis) {
    if (symmetry.axis === axis) {
      symmetry.axis = null
    } else {
      symmetry.axis = axis
    }
  }

  function setSymmetryAxis(axis) {
    symmetry.axis = axis
  }

  function setTool(newTool) {
    if (tool.value === newTool) {
      return
    }
    const oldTool = tool.value
    history.add({
      type: 'setTool',
      payload: {
        tool: newTool,
        previousTool: tool.value
      }
    })
    tool.value = newTool
  }

  function getLayerContext(composite) {
    const source = composite ? canvas.value : layer.value.canvas
    return CanvasContext2D.get(source)
  }

  function eyeDropper(x, y) {
    if (x < 0 || x > width || y < 0 || y > height) return

    const context = getLayerContext(dropper.value.selectCompositeColor)
    const sampledColor = CanvasContext2D.getColor(context, x, y)

    const alpha = parseFloat(sampledColor.match(/(\d+\.\d+|\d+)/g)[3])
    if (alpha === 0) return

    const previousColor = color
    const nextColor = sampledColor

    history.add({
      type: 'setColor',
      payload: {
        previousColor: previousColor,
        nextColor: nextColor
      }
    })
    color.value = nextColor
  }

  function toggleDropperCompositeColor() {
    dropper.value.selectCompositeColor = !dropper.value.selectCompositeColor
  }

  function doClearTemp() {
    ImageDataUtils.clear(drawingImageData.value, [0, 0, 0, 0])
    const drawingContext = CanvasContext2D.get(drawingCanvas.value)
    drawingContext.putImageData(drawingImageData.value, 0, 0)
  }

  function doTempPaintOperation(callback) {
    ImageDataUtils.clear(drawingImageData.value, [0, 0, 0, 0])
    callback(drawingImageData.value)
    const drawingContext = CanvasContext2D.get(drawingCanvas.value, {
      willReadFrequently: true
    })
    drawingContext.putImageData(drawingImageData.value, 0, 0)
  }

  const transactionalLayerPaintOperation = {
    imageData: null,
    previousImageData: null,
    nextImageData: null
  }

  function startLayerPaintOperation() {
    const currentImageData = imageData.value
    const previousImageData = ImageDataUtils.clone(currentImageData)
    transactionalLayerPaintOperation.imageData = currentImageData
    transactionalLayerPaintOperation.nextImageData = currentImageData
    transactionalLayerPaintOperation.previousImageData = previousImageData
  }

  function endLayerPaintOperation() {
    history.add({
      type: 'paintOperation',
      payload: {
        imageData: transactionalLayerPaintOperation.imageData,
        nextImageData: transactionalLayerPaintOperation.nextImageData,
        previousImageData: transactionalLayerPaintOperation.previousImageData
      }
    })
  }

  function doLayerPaintOperation(callback) {
    const currentImageData = imageData.value
    const previousImageData = ImageDataUtils.clone(currentImageData)
    callback(currentImageData)
    if (ImageDataUtils.equals(currentImageData, previousImageData)) {
      return
    }
    const nextImageData = ImageDataUtils.clone(currentImageData)
    history.add({
      type: 'paintOperation',
      payload: {
        imageData: currentImageData,
        nextImageData,
        previousImageData
      }
    })
    redrawAll()
  }

  function doPaintOperation(callback, isTemp) {
    if (isTemp) {
      doTempPaintOperation(callback)
    } else {
      doLayerPaintOperation(callback)
    }
  }

  function fillColor(color, x, y, mask) {
    // FIXME: Cuando el color es el inicial #000 por algún motivo
    // no pinta bien el alpha.
    if (!fill.contiguous) {
      doLayerPaintOperation((imageData) =>
        ImageDataUtils.replaceColorAt(
          imageData,
          x,
          y,
          Color.parseAsUint8(color),
          mask
        )
      )
    } else {
      doLayerPaintOperation((imageData) =>
        doSymmetry2Operation(
          // eslint-disable-next-line no-unused-vars
          (imageData, x, y, color, dither, mask) =>
            ImageDataUtils.fill(
              imageData,
              x,
              y,
              Color.parseAsUint8(color),
              null,
              mask
            ),
          imageData,
          x,
          y,
          color,
          null,
          mask
        )
      )
    }
  }

  function doSymmetry2Operation(
    callback,
    imageData,
    x,
    y,
    color,
    dither,
    mask
  ) {
    for (const index of symmetryAxis(symmetry.axis)) {
      const { x: sx, y: sy } = symmetryPoint(
        index,
        x,
        y,
        symmetry.position.x,
        symmetry.position.y,
        width,
        height
      )
      callback(imageData, sx, sy, color, dither, mask)
    }
  }

  function doSymmetry4Operation(
    callback,
    imageData,
    x1,
    y1,
    x2,
    y2,
    color,
    dither,
    mask
  ) {
    for (const index of symmetryAxis(symmetry.axis)) {
      const { x: sx1, y: sy1 } = symmetryPoint(
        index,
        x1,
        y1,
        symmetry.position.x,
        symmetry.position.y,
        width,
        height
      )
      const { x: sx2, y: sy2 } = symmetryPoint(
        index,
        x2,
        y2,
        symmetry.position.x,
        symmetry.position.y,
        width,
        height
      )
      callback(imageData, sx1, sy1, sx2, sy2, color, dither, mask)
    }
  }

  function putColor(x, y, color, isTemp = false, dither, mask) {
    doPaintOperation(
      (imageData) =>
        doSymmetry2Operation(
          (imageData, x, y, color, dither, mask) =>
            ImageDataUtils.putColor(
              imageData,
              x,
              y,
              Color.parseAsUint8(color),
              dither,
              mask
            ),
          imageData,
          x,
          y,
          color,
          dither,
          mask
        ),
      isTemp
    )
  }

  function line(
    x1,
    y1,
    x2,
    y2,
    color,
    isTemp = false,
    dither = null,
    mask = null
  ) {
    doPaintOperation(
      (imageData) =>
        doSymmetry4Operation(
          (imageData, x1, y1, x2, y2, color, dither, mask) =>
            ImageDataUtils.line(
              imageData,
              x1,
              y1,
              x2,
              y2,
              Color.parseAsUint8(color),
              dither,
              mask
            ),
          imageData,
          x1,
          y1,
          x2,
          y2,
          color,
          dither,
          mask
        ),
      isTemp
    )
  }

  function rectangle(
    x1,
    y1,
    x2,
    y2,
    color,
    isTemp = false,
    isFilled = shape.filled,
    lockAspectRatio = shape.lockAspectRatio,
    dither = null,
    mask = null
  ) {
    if (lockAspectRatio) {
      // FIXME: behaves in a weird way around the edges and
      // could create shapes that are not "1:1".
      const width = x2 - x1
      const height = y2 - y1
      const absWidth = Math.abs(width)
      const absHeight = Math.abs(height)
      if (width > height) {
        y2 = y1 + absWidth * Math.sign(height)
      } else {
        x2 = x1 + absHeight * Math.sign(width)
      }
    }
    doPaintOperation(
      (imageData) =>
        doSymmetry4Operation(
          (imageData, x1, y1, x2, y2, color, dither, mask) =>
            ImageDataUtils.rect(
              imageData,
              x1,
              y1,
              x2,
              y2,
              Color.parseAsUint8(color),
              dither,
              mask,
              isFilled
            ),
          imageData,
          x1,
          y1,
          x2,
          y2,
          color,
          dither,
          mask
        ),
      isTemp
    )
  }

  function ellipse(
    x1,
    y1,
    x2,
    y2,
    color,
    isTemp = false,
    isFilled = shape.filled,
    lockAspectRatio = shape.lockAspectRatio,
    dither = null,
    mask = null
  ) {
    if (lockAspectRatio) {
      // FIXME: behaves in a weird way around the edges and
      // could create shapes that are not "1:1".
      const width = x2 - x1
      const height = y2 - y1
      const absWidth = Math.abs(width)
      const absHeight = Math.abs(height)
      if (width > height) {
        y2 = y1 + absWidth * Math.sign(height)
      } else {
        x2 = x1 + absHeight * Math.sign(width)
      }
    }
    doPaintOperation(
      (imageData) =>
        doSymmetry4Operation(
          (imageData, x1, y1, x2, y2, color, dither, mask) =>
            ImageDataUtils.ellipse(
              imageData,
              x1,
              y1,
              x2,
              y2,
              Color.parseAsUint8(color),
              dither,
              mask,
              isFilled
            ),
          imageData,
          x1,
          y1,
          x2,
          y2,
          color,
          dither,
          mask
        ),
      isTemp
    )
  }

  function precomputedCircle(
    x,
    y,
    radius,
    color,
    isTemp = false,
    dither = null,
    mask = null
  ) {
    doPaintOperation(
      (imageData) =>
        doSymmetry2Operation(
          (imageData, x, y, color, dither, mask) =>
            PrecomputedCircle.circle(
              imageData,
              x,
              y,
              radius,
              Color.parseAsUint8(color),
              dither,
              mask
            ),
          imageData,
          x,
          y,
          color,
          dither,
          mask
        ),
      isTemp
    )
  }

  function transformation(x, y) {
    doLayerPaintOperation((imageData) => {
      Transform.translate(imageData, x, y, transform.tiling)
    })
  }

  function flipHorizontally() {
    doLayerPaintOperation((imageData) => {
      Transform.flipHorizontally(imageData)
    })
  }

  function flipVertically() {
    doLayerPaintOperation((imageData) => {
      Transform.flipVertically(imageData)
    })
  }

  function useToolPreview(e, pointer) {
    /* eslint-disable no-unreachable */
    const toolColor =
      tool.value === Tool.PENCIL ||
      tool.value === Tool.FILL ||
      tool.value === Tool.SHAPE
        ? color.value
        : '#f0f'
    const toolSize = tool.value === Tool.PENCIL ? pencil.size : eraser.size
    const shape = tool.value === Tool.PENCIL ? pencil.shape : eraser.shape
    const dither = tool.value === Tool.PENCIL ? pencil.dither : eraser.dither

    const mask = selection.getMaskImageData()

    if (toolSize === 1) {
      putColor(
        drawingPointer.current.x.value,
        drawingPointer.current.y.value,
        toolColor,
        'temp',
        dither,
        mask
      )
    } else {
      const sizeHalf = toolSize / 2
      const subSizeHalf = toolSize % 2 === 0 ? sizeHalf : Math.floor(sizeHalf)
      const addSizeHalf = toolSize % 2 === 0 ? sizeHalf : Math.ceil(sizeHalf)
      if (shape === PencilShape.ROUND) {
        precomputedCircle(
          drawingPointer.current.x.value,
          drawingPointer.current.y.value,
          toolSize,
          toolColor,
          'temp',
          null,
          mask
        )
      } else if (shape === PencilShape.SQUARE) {
        rectangle(
          drawingPointer.current.x.value - subSizeHalf,
          drawingPointer.current.y.value - subSizeHalf,
          drawingPointer.current.x.value + addSizeHalf,
          drawingPointer.current.y.value + addSizeHalf,
          toolColor,
          'temp',
          true,
          false,
          null,
          mask
        )
      } else if (shape === PencilShape.DITHER) {
        rectangle(
          drawingPointer.current.x.value - subSizeHalf,
          drawingPointer.current.y.value - subSizeHalf,
          drawingPointer.current.x.value + addSizeHalf,
          drawingPointer.current.y.value + addSizeHalf,
          toolColor,
          'temp',
          true,
          false,
          dither
        )
      }
    }
  }

  function useToolPencil(e) {
    const toolColor = tool.value === Tool.PENCIL ? color.value : 'rgba(0,0,0,0)'
    const toolSize = tool.value === Tool.PENCIL ? pencil.size : eraser.size
    const shape = tool.value === Tool.PENCIL ? pencil.shape : eraser.shape
    const dither = tool.value === Tool.PENCIL ? pencil.dither : eraser.dither

    const mask = selection.getMaskImageData()
    if (e.type === 'pointerdown' || e.type === 'touchstart') {
      clearTimeout(drawTimeout)
      drawTimeout = setTimeout(() => {
        if (pointer.activePointers.value === 1) {
          isUsingTool.value = true
          startLayerPaintOperation()
          if (pencil.size === 1) {
            putColor(
              drawingPointer.current.x.value,
              drawingPointer.current.y.value,
              toolColor,
              false,
              dither,
              mask
            )
          } else {
            const sizeHalf = toolSize / 2
            const subSizeHalf =
              toolSize % 2 === 0 ? sizeHalf : Math.floor(sizeHalf)
            const addSizeHalf =
              toolSize % 2 === 0 ? sizeHalf : Math.ceil(sizeHalf)
            if (shape === PencilShape.ROUND) {
              doSymmetry2Operation(
                (imageData, x, y, color, dither, mask) =>
                  PrecomputedCircle.circle(
                    imageData,
                    x,
                    y,
                    toolSize,
                    Color.parseAsUint8(color),
                    dither,
                    mask
                  ),
                imageData.value,
                drawingPointer.current.x.value,
                drawingPointer.current.y.value,
                toolColor,
                null,
                mask
              )
            } else if (shape === PencilShape.SQUARE) {
              doSymmetry4Operation(
                (imageData, x1, y1, x2, y2, color, dither, mask) =>
                  ImageDataUtils.rect(
                    imageData,
                    x1,
                    y1,
                    x2,
                    y2,
                    Color.parseAsUint8(color),
                    dither,
                    mask,
                    true
                  ),
                imageData.value,
                drawingPointer.current.x.value - subSizeHalf,
                drawingPointer.current.y.value - subSizeHalf,
                drawingPointer.current.x.value + addSizeHalf,
                drawingPointer.current.y.value + addSizeHalf,
                toolColor,
                null,
                mask
              )
            } else if (shape === PencilShape.DITHER) {
              doSymmetry4Operation(
                (imageData, x1, y1, x2, y2, color, dither, mask) =>
                  ImageDataUtils.rect(
                    imageData,
                    x1,
                    y1,
                    x2,
                    y2,
                    Color.parseAsUint8(color),
                    dither,
                    mask,
                    true
                  ),
                imageData.value,
                drawingPointer.current.x.value - subSizeHalf,
                drawingPointer.current.y.value - subSizeHalf,
                drawingPointer.current.x.value + addSizeHalf,
                drawingPointer.current.y.value + addSizeHalf,
                toolColor,
                dither,
                mask
              )
            }
          }
        }
      }, ToolSettings.DRAW_TIMEOUT)
    } else if (
      ((e.type === 'pointermove' && pointer.pressure.value > 0) ||
        e.type === 'touchmove') &&
      isUsingTool.value
    ) {
      if (toolSize === 1) {
        doSymmetry4Operation(
          (imageData, x1, y1, x2, y2, color, dither, mask) =>
            ImageDataUtils.line(
              imageData,
              x1,
              y1,
              x2,
              y2,
              Color.parseAsUint8(color),
              dither,
              mask
            ),
          imageData.value,
          drawingPointer.current.x.value,
          drawingPointer.current.y.value,
          drawingPointer.previous.x.value,
          drawingPointer.previous.y.value,
          toolColor,
          null,
          mask
        )
      } else {
        const sizeHalf = toolSize / 2
        const subSizeHalf = toolSize % 2 === 0 ? sizeHalf : Math.floor(sizeHalf)
        const addSizeHalf = toolSize % 2 === 0 ? sizeHalf : Math.ceil(sizeHalf)

        const steps = Math.hypot(
          drawingPointer.current.x.value - drawingPointer.previous.x.value,
          drawingPointer.current.y.value - drawingPointer.previous.y.value
        )

        for (let step = 0; step < steps; step++) {
          const p = step / steps
          const x = Interpolation.linear(
            p,
            drawingPointer.previous.x.value,
            drawingPointer.current.x.value
          )
          const y = Interpolation.linear(
            p,
            drawingPointer.previous.y.value,
            drawingPointer.current.y.value
          )
          if (shape === PencilShape.ROUND) {
            doSymmetry2Operation(
              (imageData, x, y, color, dither, mask) =>
                PrecomputedCircle.circle(
                  imageData,
                  x,
                  y,
                  toolSize,
                  Color.parseAsUint8(color),
                  dither,
                  mask
                ),
              imageData.value,
              x,
              y,
              toolColor,
              null,
              mask
            )
          } else if (shape === PencilShape.SQUARE) {
            doSymmetry4Operation(
              (imageData, x1, y1, x2, y2, color, dither, mask) =>
                ImageDataUtils.rect(
                  imageData,
                  x1,
                  y1,
                  x2,
                  y2,
                  Color.parseAsUint8(color),
                  dither,
                  mask,
                  true
                ),
              imageData.value,
              x - subSizeHalf,
              y - subSizeHalf,
              x + addSizeHalf,
              y + addSizeHalf,
              toolColor,
              null,
              mask
            )
          } else if (shape === PencilShape.DITHER) {
            doSymmetry4Operation(
              (imageData, x1, y1, x2, y2, color, dither, mask) =>
                ImageDataUtils.rect(
                  imageData,
                  x1,
                  y1,
                  x2,
                  y2,
                  Color.parseAsUint8(color),
                  dither,
                  mask,
                  true
                ),
              imageData.value,
              x - subSizeHalf,
              y - subSizeHalf,
              x + addSizeHalf,
              y + addSizeHalf,
              toolColor,
              dither,
              mask
            )
          }
        }
      }
    } else if (
      e.type === 'pointerup' ||
      e.type === 'pointerleave' ||
      e.pressure === 0
    ) {
      endLayerPaintOperation()
    }
  }

  function useToolFill(e) {
    if (e.type === 'pointerdown') {
      clearTimeout(drawTimeout)
      drawTimeout = setTimeout(() => {
        if (pointer.activePointers.value === 1) {
          if (fill.type === FillType.ERASE) {
            fillColor(
              'rgba(0,0,0,0)',
              drawingPointer.current.x.value,
              drawingPointer.current.y.value,
              selection.getMaskImageData()
            )
          } else if (fill.type === FillType.FILL) {
            fillColor(
              color.value,
              drawingPointer.current.x.value,
              drawingPointer.current.y.value,
              selection.getMaskImageData()
            )
          }
        }
      }, ToolSettings.DRAW_TIMEOUT)
    }
  }

  function useToolShape(e) {
    if (shape.type === ShapeType.LINE) {
      if (e.type === 'pointerdown') {
        clearTimeout(drawTimeout)
        drawTimeout = setTimeout(() => {
          if (pointer.activePointers.value === 1) {
            isUsingTool.value = true
            line(
              drawingPointer.start.x.value,
              drawingPointer.start.y.value,
              drawingPointer.current.x.value,
              drawingPointer.current.y.value,
              color.value,
              'temp',
              null,
              selection.getMaskImageData()
            )
          }
        }, ToolSettings.DRAW_TIMEOUT)
      } else if (
        ((e.type === 'pointermove' && pointer.pressure.value > 0) ||
          e.type === 'touchmove') &&
        isUsingTool.value
      ) {
        line(
          drawingPointer.start.x.value,
          drawingPointer.start.y.value,
          drawingPointer.current.x.value,
          drawingPointer.current.y.value,
          color.value,
          'temp',
          null,
          selection.getMaskImageData()
        )
      } else if (e.type === 'pointerup' && isUsingTool.value) {
        line(
          drawingPointer.start.x.value,
          drawingPointer.start.y.value,
          drawingPointer.end.x.value,
          drawingPointer.end.y.value,
          color.value,
          null,
          null,
          selection.getMaskImageData()
        )
      }
    } else if (shape.type === ShapeType.RECTANGLE) {
      if (e.type === 'pointerdown') {
        clearTimeout(drawTimeout)
        drawTimeout = setTimeout(() => {
          if (pointer.activePointers.value === 1) {
            isUsingTool.value = true
            rectangle(
              drawingPointer.start.x.value,
              drawingPointer.start.y.value,
              drawingPointer.current.x.value,
              drawingPointer.current.y.value,
              color.value,
              'temp',
              shape.filled,
              shape.lockAspectRatio,
              null,
              selection.getMaskImageData()
            )
          }
        }, ToolSettings.DRAW_TIMEOUT)
      }
      if (
        ((e.type === 'pointermove' && pointer.pressure.value > 0) ||
          e.type === 'touchmove') &&
        isUsingTool.value
      ) {
        rectangle(
          drawingPointer.start.x.value,
          drawingPointer.start.y.value,
          drawingPointer.current.x.value,
          drawingPointer.current.y.value,
          color.value,
          'temp',
          shape.filled,
          shape.lockAspectRatio,
          null,
          selection.getMaskImageData()
        )
      } else if (e.type === 'pointerup' && isUsingTool.value) {
        rectangle(
          drawingPointer.start.x.value,
          drawingPointer.start.y.value,
          drawingPointer.end.x.value,
          drawingPointer.end.y.value,
          color.value,
          null,
          shape.filled,
          shape.lockAspectRatio,
          null,
          selection.getMaskImageData()
        )
      }
    } else if (shape.type === ShapeType.ELLIPSE) {
      if (e.type === 'pointerdown') {
        clearTimeout(drawTimeout)
        drawTimeout = setTimeout(() => {
          if (pointer.activePointers.value === 1) {
            isUsingTool.value = true
            ellipse(
              drawingPointer.start.x.value,
              drawingPointer.start.y.value,
              drawingPointer.current.x.value,
              drawingPointer.current.y.value,
              color.value,
              'temp',
              shape.filled,
              shape.lockAspectRatio,
              null,
              selection.getMaskImageData()
            )
          }
        }, ToolSettings.DRAW_TIMEOUT)
      }
      if (
        ((e.type === 'pointermove' && pointer.pressure.value > 0) ||
          e.type === 'touchmove') &&
        isUsingTool.value
      ) {
        ellipse(
          drawingPointer.start.x.value,
          drawingPointer.start.y.value,
          drawingPointer.current.x.value,
          drawingPointer.current.y.value,
          color.value,
          'temp',
          shape.filled,
          shape.lockAspectRatio,
          null,
          selection.getMaskImageData()
        )
      } else if (e.type === 'pointerup' && isUsingTool.value) {
        ellipse(
          drawingPointer.start.x.value,
          drawingPointer.start.y.value,
          drawingPointer.end.x.value,
          drawingPointer.end.y.value,
          color.value,
          null,
          shape.filled,
          shape.lockAspectRatio,
          null,
          selection.getMaskImageData()
        )
      }
    }
  }

  function useToolEyedropper(e) {
    if (e.type === 'pointerdown') {
      clearTimeout(drawTimeout)
      drawTimeout = setTimeout(() => {
        if (pointer.activePointers.value === 1) {
          isUsingTool.value = true
        }
      }, ToolSettings.DRAW_TIMEOUT)
    } else if (e.type === 'pointerup' && isUsingTool.value) {
      eyeDropper(drawingPointer.current.x.value, drawingPointer.current.y.value)
    }
  }

  function useToolTransform(e) {
    if (e.type !== 'pointermove' || pointer.pressure.value === 0) {
      return
    }

    // TODO: Esto es MUY mejorable.
    const x = Math.trunc(pointer.relative.x.value / zoom.current.value)
    const y = Math.trunc(pointer.relative.y.value / zoom.current.value)
    transformation(x, y)
  }

  function useToolSelect(e) {
    const x = drawingPointer.current.x.value / width.value
    const y = drawingPointer.current.y.value / height.value

    if (e.type === 'pointerdown') {
      clearTimeout(drawTimeout)
      drawTimeout = setTimeout(() => {
        if (pointer.activePointers.value === 1) {
          isUsingTool.value = true
          if (selection.type.value !== SelectionType.COLOR) {
            selection.start(x, y)
          }
        }
      }, ToolSettings.DRAW_TIMEOUT)
    } else if (
      ((e.type === 'pointermove' && pointer.pressure.value > 0) ||
        e.type === 'touchmove') &&
      isUsingTool.value
    ) {
      selection.update(x, y)
    } else if (e.type === 'pointerup' && isUsingTool.value) {
      selection.end(x, y)
      isSelectionVisible.value = true
    }
  }

  function useTool(e) {
    if (tool.value === Tool.PENCIL || tool.value === Tool.ERASER) {
      useToolPreview(e)
    }
    // We need to check if we're moving
    // the canvas.
    if (isMoving.value || pointer.buttons.value === 4) {
      moveBy(pointer.movement.x.value, pointer.movement.y.value)
      return
    }

    /*     if (e.type === 'pointerup' && pointer.pointerId.value === 1) {
      return
    } */

    // We need to set the modified flag to true
    // to track changes.
    modified.value = true

    // We need to check if the current layer is visible.
    // If it's not visible we should not allow any drawing.
    if (layers.current.visible.value === false) {
      return
    }

    if (tool.value === Tool.PENCIL || tool.value === Tool.ERASER) {
      useToolPencil(e)
    } else if (tool.value === Tool.FILL) {
      useToolFill(e)
    } else if (tool.value === Tool.SHAPE) {
      useToolShape(e)
    } else if (tool.value === Tool.EYEDROPPER) {
      useToolEyedropper(e)
    } else if (tool.value === Tool.TRANSFORM) {
      useToolTransform(e)
    } else if (tool.value === Tool.SELECT) {
      useToolSelect(e)
    }
    if (
      e.type === 'pointerup' ||
      e.type === 'touchend' ||
      e.type === 'pointerleave'
    ) {
      isUsingTool.value = false
      clearTimeout(drawTimeout)
      doClearTemp()
    }
    redrawAll()
  }

  function redrawTransparentBackground() {
    const context = CanvasContext2D.get(canvas.value)
    const tileSize = 8 // Adjust the size of each tile as needed
    const numTilesX = Math.ceil(context.canvas.width / tileSize)
    const numTilesY = Math.ceil(context.canvas.height / tileSize)

    for (let i = 0; i < numTilesX; i++) {
      for (let j = 0; j < numTilesY; j++) {
        const isEvenTile = (i + j) % 2 === 0
        const tileX = i * tileSize
        const tileY = j * tileSize

        // Meter esto en algún lugar que sea configurable.
        context.fillStyle = isEvenTile ? '#cccccc' : '#999999'
        context.fillRect(tileX, tileY, tileSize, tileSize)
      }
    }
  }

  function redraw() {
    const context = CanvasContext2D.get(canvas.value)
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    const frame = animation.current
    redrawTransparentBackground()
    for (const layer of reverse(layers.list)) {
      if (!layer.visible.value) {
        continue
      }
      context.save()
      context.globalAlpha = layer.opacity.value
      context.globalCompositeOperation = layer.blendMode.value
      layer.context.putImageData(layer.frames[frame], 0, 0)
      context.drawImage(layer.canvas, 0, 0)
      context.restore()
    }
  }

  function redrawPreview() {
    const context = CanvasContext2D.get(previewCanvas.value)
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.drawImage(canvas.value, 0, 0)
  }

  /**
   * Redraws all the frames in the animation preview.
   */
  function redrawFrames() {
    for (let index = 0; index < frames.value.length; index++) {
      const frame = frames.value[index]
      const context = CanvasContext2D.get(frame.canvas)
      context.clearRect(0, 0, frame.canvas.width, frame.canvas.height)
      for (const layer of layers.list) {
        if (!layer.visible.value) continue
        context.save()
        context.globalAlpha = layer.opacity.value
        context.globalCompositeOperation = layer.blendMode.value
        layer.context.putImageData(layer.frames[index], 0, 0)
        context.drawImage(layer.canvas, 0, 0)
        context.restore()
      }
    }
  }

  /**
   * Redraws pixel grid.
   */
  function redrawGrid() {
    if (zoom.current.value > 12) {
      const context = CanvasContext2D.get(board.value, '2d')
      context.globalCompositeOperation = 'difference'
      context.beginPath()
      for (let x = 0; x < width.value; x++) {
        context.moveTo(x * zoom.current.value, 0)
        context.lineTo(
          x * zoom.current.value,
          height.value * zoom.current.value
        )
      }
      for (let y = 0; y < height.value; y++) {
        context.moveTo(0, y * zoom.current.value)
        context.lineTo(width.value * zoom.current.value, y * zoom.current.value)
      }
      // TODO: Meter esto en algún lugar donde se pueda configurar.
      context.strokeStyle = 'rgba(256, 256, 256, 0.25 )'
      context.stroke()
      context.globalCompositeOperation = 'source-over'
    }
  }

  // TODO: El cursor se pinta utilizando useToolPreview
  function redrawCursor() {
    if (tool.value === Tool.FILL || tool.value === Tool.SHAPE) {
      const context = CanvasContext2D.get(board.value, '2d')

      context.fillStyle = color.value
      context.fillRect(
        (drawingPointer.current.x.value / width.value) *
          drawingRect.width.value +
          drawingRect.x.value,
        (drawingPointer.current.y.value / height.value) *
          drawingRect.height.value +
          drawingRect.y.value,
        drawingRect.width.value / width.value,
        drawingRect.height.value / height.value
      )
    }
  }

  /**
   * Redraw selection.
   *
   * TODO: Necesitamos una forma de repintar la selección
   * sin repintar todo lo demás.
   */
  function redrawSelection() {
    selection.render(drawingRect.width.value, drawingRect.height.value)
    const context = CanvasContext2D.get(board.value, '2d')
    const canvas = selection.getCanvas()
    if (canvas) {
      context.drawImage(canvas, 0, 0)
    }
  }

  /**
   * Redraws everything.
   */
  function redrawAll() {
    resizeBoard()
    redraw()
    redrawPreview()
    redrawFrames()

    if (!board.value) {
      console.warn('Board not set')
      return
    }
    const context = CanvasContext2D.get(board.value, '2d')
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.save()
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    context.scale(zoom.current.value, zoom.current.value)
    context.translate(position.x.value, position.y.value)
    context.drawImage(canvas.value, 0, 0)
    context.drawImage(drawingCanvas.value, 0, 0)
    context.restore()

    // Draw the grid and other similar elements that are
    // drawn OVER the pixel artwork.
    context.save()
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    context.translate(
      position.x.value * zoom.current.value,
      position.y.value * zoom.current.value
    )

    // TODO: Convertir esto en una constante o en un parámetro
    // configurable.
    redrawGrid()
    redrawSelection()

    context.restore()

    // TODO: Borrar esto en algún momento porque sólo sirve
    // para debuggear.
    /*
    context.strokeStyle = '#f0f'
    context.strokeRect(
      drawingRect.x.value,
      drawingRect.y.value,
      drawingRect.width.value,
      drawingRect.height.value
    )
    */

    // for (const index of symmetryAxis(symmetry.axis)) {
    redrawCursor()
    // }
  }

  /**
   * Initializes the document.
   */
  function init() {
    // Drawing
    isUsingTool.value = false
    // TODO: We should completely remake so it uses putImageData
    // instead of drawImage.
    drawingCanvas.value = Canvas.createOrGet(
      drawingCanvas.value,
      width.value,
      height.value
    )
    drawingImageData.value = new ImageData(width.value, height.value)
    copyCanvas.value = Canvas.createOrGet(
      copyCanvas.value,
      width.value,
      height.value
    )
    copyImageData.value = new ImageData(width.value, height.value)
    previewCanvas.value = Canvas.createOrGetWithClasses(
      previewCanvas.value,
      width.value,
      height.value,
      'preview-canvas'
    )
    canvas.value = Canvas.createOrGetWithClasses(
      canvas.value,
      width.value,
      height.value,
      'pixel-canvas'
    )
    canvasRect.value = null

    // Selection
    PrecomputedCircle.init()
    selection.init(width.value, height.value)
    redrawAll()
  }

  function createFromDocument(document) {
    create({
      name: document.name ?? name.value,
      width: document.width,
      height: document.height,
      palette: document.palette,
      layers: document.layers
    })
    redrawAll()
  }

  function isValidSize(size) {
    return Number.isInteger(size) && size > 0
  }

  /**
   * Creates a new document.
   *
   * @param {Object} options
   */
  function create(options) {
    if (!isValidSize(options.width) || !isValidSize(options.height)) {
      throw new Error('Invalid size')
    }
    name.value = options.name
    width.value = options.width
    height.value = options.height
    palette.set(options.palette)
    symmetry.position.set(unref(width.value) / 2, unref(height.value) / 2)

    const newLayers = options.layers ?? [
      { name: 'Background', width: width.value, height: height.value }
    ]

    // We need to pass document width and height to the layers
    layers.set(newLayers)

    const id = uuid()
    const canvas = Canvas.createWith(width.value, height.value, {
      id: id,
      className: 'preview-canvas'
    })
    position.set(-width.value / 2, -height.value / 2)
    zoom.reset()

    frames.value = [
      {
        id,
        canvas
      }
    ]
    tool.value = Tool.PENCIL
    init()
  }

  /**
   * Destroys everything and allows the resources to be
   * garbage collected.
   */
  function destroy() {
    name.value = ''
    width.value = 0
    height.value = 0
    palette.clear()
    symmetry.position.set(0, 0)
    layers.clear()
    frames.value.splice(0, frames.value.length)
    tool.value = Tool.PENCIL
    isUsingTool.value = false
    drawingCanvas.value = null
    drawingImageData.value = null
    copyCanvas.value = null
    copyImageData.value = null
    previewCanvas.value = null
    canvas.value = null
    canvasRect.value = null
  }

  /***************************************************************************
   * Layers
   ***************************************************************************/
  function updateLayers(list) {
    layers.set(list)
    redrawAll()
  }

  /*
  function mergeDown() {
    // TODO: We need to get all layers below the selected one and blend them together
    // in a single layer.
    const index = layers.list.findIndex(
      (currentLayer) => currentLayer.id === layer.value.id
    )
    const mergedLayer = createNewLayer({
      name: 'Merged'
    })
    const removedLayers = layers.list.splice(0, index, mergedLayer)
    for (const layer of removedLayers) {
      // TODO: We paint all the layers in the new layer.
    }
  }

  function mergeBy(mode = 'all') {
    // 'visible', 'all'
    // TODO: We have to get all the layers and blend them into a single one
    // using only visible layers.
  }
  */

  function setLayer(layer) {
    layers.current = layer
  }

  function setLayerBlendMode(layer, blendMode) {
    layer.blendMode.value = blendMode
    redrawAll()
  }

  function setLayerOpacity(layer, opacity) {
    layer.opacityPercentage.value = opacity
    redrawAll()
  }

  function hideLayerSettings() {
    layers.settings = null
  }

  function showLayerSettings(layer) {
    if (layers.settings === layer) {
      hideLayerSettings()
      return
    }
    layers.settings = layer
  }

  function moveLayerUp() {
    layers.moveUp()
    redrawAll()
  }

  function moveLayerDown() {
    layers.moveDown()
    redrawAll()
  }

  function addLayer() {
    const { index, layer } = layers.add({
      width: width.value,
      height: height.value
    })
    history.add({
      type: 'addLayer',
      payload: { index, layer }
    })
  }

  function duplicateLayer(layer) {
    const { index, layer: duplicatedLayer } = layers.duplicate(layer)
    history.add({
      type: 'duplicateLayer',
      payload: { index, layer: duplicatedLayer }
    })
    redrawAll()
  }

  function toggleLayer(layer) {
    layers.toggle(layer)
    redrawAll()
  }

  function removeLayer(layer) {
    if (layer === layers.current) {
      const layerIndex = layers.list.findIndex(
        (item) => item.id === layers.current.id
      )
      layers.current =
        layerIndex === layers.list.length - 1
          ? layers.list[layerIndex - 1]
          : layers.list[layerIndex + 1]
    }
    const { index, layer: removedLayer } = layers.remove(layer)
    redrawAll()
    history.add({
      type: 'removeLayer',
      payload: { index, layer: removedLayer }
    })
  }

  function swapLayers(fromIndex, toIndex) {
    layers.swap(fromIndex, toIndex)
    history.add({
      type: 'swapLayers',
      payload: { from: fromIndex, toIndex: toIndex }
    })
    redrawAll()
  }

  function changeLayerName(layer, name) {
    const previousName = layer.name.value
    layer.name.value = name
    history.add({
      type: 'changeLayerName',
      payload: { layer, name, previousName }
    })
  }

  /***************************************************************************
   * Movement and zoom
   ***************************************************************************/
  function center() {
    position.reset()
  }

  function moveAndZoom(x, y, z) {
    moveBy(x, y)
    zoom.relative(z)
  }

  function moveTo(x, y) {
    position.set(x, y)
  }

  function moveBy(x, y) {
    position.add(x / zoom.current.value, y / zoom.current.value)
  }

  /***************************************************************************
   * Color
   ***************************************************************************/

  /**
   * Sets a new color.
   *
   * @param {string} newColor CSS Color string
   */
  function setColor(newColor) {
    history.add({
      type: 'setColor',
      payload: {
        color: unref(newColor),
        previousColor: color.value
      }
    })
    color.value = newColor
    if (colorPicker.value) {
      colorPicker.value = false
    }
  }

  /**
   * Sets the current color mode.
   *
   * @param {ColorMode} newColorMode
   */
  function setColorMode(newColorMode) {
    colorMode.value = newColorMode
  }

  /***************************************************************************
   * Palette
   ***************************************************************************/
  /**
   * Load palette
   */
  async function loadPalette() {
    const file = await FilePicker.showOpen({
      types: PaletteTypes,
      excludeAcceptAllOption: true,
      multiple: false
    })
    if (/.*\.gpl$/i.test(file.name)) {
      const newPalette = await GIMP.load(file)
      palette.set(newPalette)
    } else if (/.*\.pal$/i.test(file.name)) {
      const newPalette = await PAL.load(file)
      palette.set(newPalette)
    } else if (/.*\.act$/i.test(file.name)) {
      const newPalette = await ACT.load(file)
      palette.set(newPalette)
    }
  }

  /**
   * Save palette
   */
  async function savePaletteAs() {
    const suggestedFileName = 'untitled'
    const fileExtension = '.gpl'
    FilePicker.showSave(
      (fileHandle) => {
        const extension = fileHandle.name.slice(
          fileHandle.name.lastIndexOf('.')
        )
        if (extension === '.gpl') {
          return GIMP.save(palette.colors)
        } else if (extension === '.pal') {
          return PAL.save(palette.colors)
        } else if (extension === '.act') {
          return ACT.save(palette.colors)
        } else {
          throw new Error('Invalid extension')
        }
      },
      {
        defaultFileName: suggestedFileName + fileExtension,
        types: PaletteTypes,
        excludeAcceptAllOption: true
      }
    )
  }

  /**
   * Clear palette
   */
  async function clearPalette() {
    palette.clear()
  }

  /**
   * Swap palette colors
   */
  function swapPaletteColors(fromIndex, toIndex) {
    palette.swap(fromIndex, toIndex)
  }

  /**
   * Add color to palette
   */
  function addPaletteColor() {
    history.add({
      type: 'addPaletteColor',
      payload: { color: color }
    })
    palette.add(color.value)
  }

  /**
   * Remove color from palette
   *
   * @param {number} index
   */
  function removePaletteColor(index) {
    const color = palette.removeAt(index)
    history.add({
      type: 'removePaletteColor',
      payload: { color, index }
    })
  }

  /***************************************************************************
   * Frames
   ***************************************************************************/

  /**
   * Adds a new frame to the animation.
   */
  function addFrame() {
    for (const layer of layers.list) {
      if (!layer.isStatic) {
        layer.frames.push(new ImageData(width.value, height.value))
      }
    }
    const id = uuid()
    const canvas = Canvas.createWith(width.value, height.value, {
      id: id,
      className: 'preview-canvas'
    })
    frames.value.push({
      id,
      canvas
    })
    animation.add()
    redrawAll()
  }

  /**
   * Duplicates the current frame.
   */
  function duplicateFrame() {
    const frame = animation.current
    for (const layer of layers.list) {
      if (!layer.isStatic) {
        const currentImageData = layer.frames[frame]
        const duplicatedImageData = new ImageData(
          currentImageData.data.slice(),
          currentImageData.width,
          currentImageData.height
        )
        layer.frames.push(duplicatedImageData)
      }
    }
    const id = uuid()
    const canvas = Canvas.createWith(width.value, height.value, {
      id: id,
      className: 'preview-canvas'
    })
    frames.value.push({
      id,
      canvas
    })
    animation.add()
    redrawAll()
  }

  /**
   * Removes the current frame.
   */
  function removeFrame() {
    const frame = animation.current
    for (const layer of layers) {
      if (!layer.isStatic) {
        const [removedFrame] = layer.frames.splice(frame, 1)
        return removedFrame
      }
    }
    const [removedFrame] = frames.value.splice(frame, 1)
    animation.remove()
    redrawAll()
    return removedFrame
  }

  /**
   * Plays or pauses the animation
   */
  function toggle() {
    animation.toggle()
  }

  /**
   * Pauses the animation
   */
  function pause() {
    animation.pause()
  }

  /**
   * Plays the animation.
   */
  function play() {
    animation.play()
  }

  /**
   * Sets the current frame.
   *
   * @param {number} currentFrame
   */
  function setCurrentFrame(currentFrame) {
    if (!Number.isInteger(currentFrame) || currentFrame < 0) {
      throw new Error('Invalid frame value')
    }
    animation.go(currentFrame)
    redrawAll()
  }

  /**
   * Goes to the first frame.
   */
  function goToFirstFrame() {
    if (animation.canGoFirst) {
      animation.first()
      redrawAll()
    }
  }

  /**
   * Goes to the last frame.
   */
  function goToLastFrame() {
    if (animation.canGoLast) {
      animation.last()
      redrawAll()
    }
  }

  /**
   * Goes to the next frame.
   */
  function goToNextFrame() {
    if (animation.canGoNext) {
      animation.next()
      redrawAll()
    }
  }

  /**
   * Goes to the previous frame.
   */
  function goToPreviousFrame() {
    if (animation.canGoPrevious) {
      animation.previous()
      redrawAll()
    }
  }

  /*******************************************************************
   * FILES
   ******************************************************************/
  function newFile() {
    canvas.value = null
  }

  /**
   * Open file
   */
  async function openFile() {
    const file = await FilePicker.showOpen({
      types: ImageTypes,
      excludeAcceptAllOption: true,
      multiple: false
    })
    let document
    if (/(.*)\.ora$/i.test(file.name)) {
      document = await OpenRaster.load(file)
    } else if (/(.*)\.(png|gif|jpeg|jpg|webp)$/i.test(file.name)) {
      document = await WebImage.load(file)
    }
    /*
      TODO: We need to return a valid Document object.
    else if (/(.*)\.pcx$/i.test(file.name)) {
      document = await PCX.load(file)
    } else if (/(.*)\.tga$/i.test(file.name)) {
      document = await TGA.load(file)
    } else if (/(.*)\.aseprite$/i.test(file.name)) {
      document = await Aseprite.load(file)
    }
    */
    if (!document) {
      // TODO: We should show an error.
      // showError('Invalid file')
    }
    createFromDocument(document)
  }

  /**
   * Save file
   */
  async function saveFileAs() {
    const suggestedFileName = name.value
    const fileExtension = '.ora'
    await FilePicker.showSave(
      () =>
        OpenRaster.save({
          canvas: canvas.value,
          width: width.value,
          height: height.value,
          palette: palette,
          layers: layers
        }),
      {
        types: ImageTypes,
        defaultFileName: suggestedFileName + fileExtension,
        excludeAcceptAllOption: true,
        multiple: false
      }
    )
    modified.value = false
  }

  /**
   * Export file
   *
   * @param {string} name
   * @param {string} format
   * @param {number} scale
   * @param {number} quality
   */
  async function exportFileAs(name, format, scale, quality) {
    const transformedQuality = quality / 100

    // Calculate new size
    const originalWidth = canvas.value.width
    const originalHeight = canvas.value.height

    const newWidth = Math.floor(originalWidth * scale)
    const newHeight = Math.floor(originalHeight * scale)

    // Create new canvas with modified size
    const scaledCanvas = Canvas.createOffscreen(newWidth, newHeight)
    scaledCanvas.width = newWidth
    scaledCanvas.height = newHeight

    const scaledCtx = CanvasContext2D.get(scaledCanvas)

    // Copy original image to new canvas with modified size
    scaledCtx.imageSmoothingEnabled = false
    scaledCtx.drawImage(canvas.value, 0, 0, newWidth, newHeight)

    const blob = Canvas.createBlob(
      scaledCanvas,
      `image/${format}`,
      transformedQuality
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.${format}`
    a.click()
  }

  /**
   * History
   */
  function undo() {
    const actionToUndo = history.undo()
    if (!actionToUndo) {
      return
    }
    switch (actionToUndo.type) {
      case 'addPaletteColor':
        palette.removeLast()
        break
      case 'removePaletteColor':
        palette.addAt(actionToUndo.payload.index, actionToUndo.payload.color)
        break
      case 'setColor':
        color.value = actionToUndo.payload.previousColor
        break
      case 'setTool':
        tool.value = actionToUndo.payload.previousTool
        break
      case 'paintOperation':
        ImageDataUtils.copy(
          actionToUndo.payload.imageData,
          actionToUndo.payload.previousImageData
        )
        redrawAll()
        break
      case 'duplicateLayer':
      case 'addLayer':
        layers.removeAt(actionToUndo.payload.index)
        break
      case 'removeLayer':
        layers.addAt(actionToUndo.payload.index, actionToUndo.payload.layer)
        break
      case 'swapLayers':
        layers.swap(
          actionToUndo.payload.toIndex,
          actionToUndo.payload.fromIndex
        )
        break
      case 'changeLayerName':
        actionToUndo.payload.layer.name.value =
          actionToUndo.payload.previousName
        break
      default:
        console.log('To implement', actionToUndo)
    }
  }

  function redo() {
    const actionToRedo = history.redo()
    if (!actionToRedo) {
      return
    }
    switch (actionToRedo.type) {
      case 'addPaletteColor':
        palette.add(actionToRedo.payload.color)
        break
      case 'removePaletteColor':
        palette.removeAt(actionToRedo.payload.index)
        break
      case 'setColor':
        color.value = actionToRedo.payload.color
        break
      case 'setTool':
        tool.value = actionToRedo.payload.tool
        break
      case 'paintOperation':
        ImageDataUtils.copy(
          actionToRedo.payload.imageData,
          actionToRedo.payload.nextImageData
        )
        redrawAll()
        break
      case 'duplicateLayer':
      case 'addLayer':
        layers.addAt(actionToRedo.payload.index, actionToRedo.payload.layer)
        break
      case 'removeLayer':
        layers.removeAt(actionToRedo.payload.index)
        break
      case 'swapLayers':
        layers.swap(
          actionToRedo.payload.fromIndex,
          actionToRedo.payload.toIndex
        )
        break
      case 'changeLayerName':
        actionToRedo.payload.layer.name.value = actionToRedo.payload.name
        break
      default:
        console.log('To implement', actionToRedo)
    }
  }

  function resizeBoard() {
    if (!board.value) return
    Canvas.resize(board.value)
  }

  function setBoard(newBoard) {
    board.value = newBoard
    pointer.listen(useTool, board.value)
  }

  function unsetBoard() {
    board.value = null
    pointer.unlisten()
  }

  async function getFile() {
    const blob = await OpenRaster.save({
      canvas: canvas.value,
      width: width.value,
      height: height.value,
      palette: palette,
      layers: layers
    })
    return new File([blob], 'artwork.ora', {
      type: 'image/openraster'
    })
  }

  async function setFile(file) {
    if (file === null) {
      destroy()
    } else {
      const document = await OpenRaster.load(file)
      createFromDocument(document)
    }
  }

  return {
    state,
    name,
    animation,
    board,
    canvas,
    canvasRect,
    color,
    colorMode,
    colorPicker,
    copyCanvas,
    copyImageData,
    isUsingTool,
    drawingCanvas,
    drawingImageData,
    dropper,
    eraser,
    fill,
    frames,
    grid,
    height,
    history,
    keys,
    layers,
    modified,
    isMoving,
    onionSkin,
    palette,
    pencil,
    position,
    pointer,
    previewCanvas,
    selection,
    shape,
    symmetry,
    tool,
    transform,
    width,
    zoom,
    isSelectionVisible,
    addFrame,
    addLayer,
    addPaletteColor,
    center,
    changeLayerName,
    clearPalette,
    create,
    deselect,
    duplicateFrame,
    duplicateLayer,
    exportFileAs,
    flipHorizontally,
    flipVertically,
    goToFirstFrame,
    goToLastFrame,
    goToNextFrame,
    goToPreviousFrame,
    loadPalette,
    // mergeBy,
    // mergeDown,
    moveAndZoom,
    moveBy,
    moveLayerDown,
    moveLayerUp,
    moveTo,
    newFile,
    openFile,
    pause,
    play,
    redo,
    redrawAll,
    removeFrame,
    removeLayer,
    removePaletteColor,
    resizeBoard,
    saveFileAs,
    savePaletteAs,
    setBoard,
    setColor,
    setColorMode,
    setCurrentFrame,
    setEraserDitherLevel,
    setEraserShape,
    setEraserSize,
    setFillType,
    setLayer,
    setLayerBlendMode,
    setLayerOpacity,
    setPencilDitherLevel,
    setPencilShape,
    setPencilSize,
    setSelectMode,
    setSelectType,
    setShapeType,
    setSymmetryAxis,
    setSymmetrySettings,
    setTool,
    showLayerSettings,
    startMoving,
    stopMoving,
    swapLayers,
    swapPaletteColors,
    toggle,
    toggleColorPicker,
    toggleDropperCompositeColor,
    toggleFillContiguous,
    toggleLayer,
    hideLayerSettings,
    toggleSelectContiguous,
    toggleShapeFill,
    toggleShapeLockAspectRatio,
    undo,
    unsetBoard,
    updateCanvasRect,
    updateLayers,
    useTool,
    getFile,
    setFile,
    setName
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDocumentStore, import.meta.hot))
}
