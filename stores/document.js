import { v4 as uuid } from 'uuid'
import Color from '@/pixel/color/Color'
import ColorMode from '@/pixel/enums/ColorMode'
import Canvas from '@/pixel/canvas/Canvas'
import CanvasContext2D from '@/pixel/canvas/CanvasContext2D'
import ImageDataUtils from '@/pixel/canvas/ImageDataUtils'
import SymmetryAxis from '@/pixel/enums/SymmetryAxis'
import Tool from '@/pixel/enums/Tool'
import PencilShape from '@/pixel/enums/PencilShape'
import ShapeType from '@/pixel/enums/ShapeType'
import FillType from '@/pixel/enums/FillType'
import PaletteTypes from '@/pixel/constants/PaletteTypes'
import ImageTypes from '@/pixel/constants/ImageTypes'
import Interpolation from '@/pixel/math/Interpolation'

import GIMP from '@/pixel/formats/palettes/GIMP'
import ACT from '@/pixel/formats/palettes/ACT'
import PAL from '@/pixel/formats/palettes/PAL'
import FilePicker from '@/pixel/io/FilePicker'

import TGA from '@/pixel/formats/images/TGA.js'
import PCX from '@/pixel/formats/images/PCX.js'
import BMP from '@/pixel/formats/images/BMP.js'
import Aseprite from '../pixel/formats/images/Aseprite.js'
import OpenRaster from '@/pixel/formats/images/OpenRaster.js'
import WebImage from '@/pixel/formats/images/WebImage.js'

import { usePoint } from '@/composables/usePoint'
import { useMagicKeys } from '@vueuse/core'
import { useLayersStore } from './layers'
import { useAnimationStore } from './animation'
import { useHistoryStore } from './history'
import { useEraserStore } from './eraser'
import { usePencilStore } from './pencil'
import { useZoomStore } from './zoom'
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
  const title = ref('Untitled')
  const board = ref(null)
  const keys = useMagicKeys()
  const width = ref(0)
  const height = ref(0)
  const position = usePoint()
  const zoom = useZoomStore()
  const zoomPreview = ref(false)
  const canvas = ref(null)
  const canvasRect = ref(null)
  const tool = ref(Tool.PENCIL)
  const moving = ref(false)
  const drawing = ref(false)
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

  // Frames that will be shown in the animation preview.
  const frames = ref([])

  // FIXME: I don't like this approach.
  if (!ImageDataUtils.isPrecomputedCircleInitialized()) {
    ImageDataUtils.initializePrecomputedCircle()
  }

  /*
  const frames = computed(() => {
    const frames = []
    for (let frame = 0; frame < animation.total.value; frame++) {
      const frameCanvas = Canvas.createWithClasses(
        width.value,
        height.value,
        'preview-canvas'
      )
      const frameContext = CanvasContext2D.get(frameCanvas)
      frameContext.clearRect(0, 0, frameCanvas.width, frameCanvas.height)
      for (const layer of layers.list) {
        if (!layer.visible.value) {
          continue
        }
        frameContext.save()
        frameContext.globalAlpha = layer.opacity.value
        frameContext.globalCompositeOperation = layer.blendMode.value
        layer.context.putImageData(layer.frames[frame], 0, 0)
        frameContext.drawImage(layer.canvas, 0, 0)
        frameContext.restore()
      }
      // TODO: We should be able to render the selected frame
      //  in the <canvas> element.
      frames.push({
        frame,
        canvas: frameCanvas
      })
    }
    return frames
  })
  */

  const layer = computed(() => layers.current)
  const imageData = computed(() => {
    if (!layer.value) {
      return null
    }
    const frame = animation.current
    return layer.value.frames[frame]
  })

  function startMoving() {
    moving.value = true
  }

  function stopMoving() {
    moving.value = false
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
    pencil.shape = shape
    if (pencil.shape !== PencilShape.DITHER) {
      pencil.dither.level = 0
      pencil.dither.reset()
    }
  }

  function setPencilSize(size) {
    pencil.size = size
  }

  function setPencilDitherLevel(level) {
    pencil.dither.level = level
  }

  function setEraserShape(shape) {
    eraser.shape = shape
  }

  function setEraserSize(size) {
    eraser.size = size
  }

  function setEraserDitherLevel(level) {
    eraser.dither.level = level
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
  }

  function setFillType(type) {
    fill.type = type
  }

  function toggleFillContiguous() {
    fill.contiguous = !fill.contiguous
  }

  function setShapeType(type) {
    shape.type = type
  }
  function toggleShapeFill() {
    shape.filled = !shape.filled
  }
  function toggleShapeLockAspectRatio() {
    shape.lockAspectRatio = !shape.lockAspectRatio
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
    const context = getLayerContext(dropper.selectCompositeColor)
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
    dropper.selectCompositeColor = !dropper.selectCompositeColor
  }

  function doTempPaintOperation(callback) {
    ImageDataUtils.clear(drawingImageData.value, [0, 0, 0, 0])
    callback(drawingImageData.value)
    drawDrawingBuffer()
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

  function fillColor(color, x, y, mask) {
    // FIXME: Cuando el color es el inicial #000 por algún motivo
    // no pinta bien el alpha.
    if (!fill.contiguous) {
      doLayerPaintOperation((imageData) =>
        ImageDataUtils.replaceColorAt(
          imageData,
          x,
          y,
          Color.toUint8(color),
          mask
        )
      )
    } else {
      doLayerPaintOperation((imageData) =>
        doSymmetry2Operation(
          (imageData, x, y, color, dither) =>
            ImageDataUtils.fill(imageData, x, y, Color.toUint8(color), mask),
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
    callback(imageData, x, y, color, dither, mask)
    if (symmetry.axis === null) {
      return
    }
    if (symmetry.axis === SymmetryAxis.HORIZONTAL) {
      callback(imageData, width - 1 - x, y, color, dither, mask)
    } else if (symmetry.axis === SymmetryAxis.VERTICAL) {
      callback(imageData, x, height - 1 - y, color, dither, mask)
    } else if (symmetry.axis === SymmetryAxis.BOTH) {
      callback(imageData, width - 1 - x, y, color, dither, mask)
      callback(imageData, x, height - 1 - y, color, dither, mask)
      callback(imageData, width - 1 - x, height - 1 - y, color, dither, mask)
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
    callback(imageData, x1, y1, x2, y2, color, dither, mask)
    if (symmetry.axis === null) {
      return
    }
    if (symmetry.axis === SymmetryAxis.HORIZONTAL) {
      callback(
        imageData,
        width - 1 - x1,
        y1,
        width - 1 - x2,
        y2,
        color,
        dither,
        mask
      )
    } else if (symmetry.axis === SymmetryAxis.VERTICAL) {
      callback(
        imageData,
        x1,
        height - 1 - y1,
        x2,
        height - 1 - y2,
        color,
        dither,
        mask
      )
    } else if (symmetry.axis === SymmetryAxis.BOTH) {
      callback(
        imageData,
        width - 1 - x1,
        y1,
        width - 1 - x2,
        y2,
        color,
        dither,
        mask
      )
      callback(
        imageData,
        x1,
        height - 1 - y1,
        x2,
        height - 1 - y2,
        color,
        dither,
        mask
      )
      callback(
        imageData,
        width - 1 - x1,
        height - 1 - y1,
        width - 1 - x2,
        height - 1 - y2,
        color,
        dither,
        mask
      )
    }
  }

  function putColor(x, y, color, dither, mask) {
    doLayerPaintOperation((imageData) =>
      doSymmetry2Operation(
        (imageData, x, y, color, dither, mask) =>
          ImageDataUtils.putColor(
            imageData,
            x,
            y,
            Color.toUint8(color),
            dither,
            mask
          ),
        imageData,
        x,
        y,
        color,
        dither,
        mask
      )
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
    if (isTemp) {
      doTempPaintOperation((imageData) =>
        doSymmetry4Operation(
          (imageData, x1, y1, x2, y2, color, dither, mask) =>
            ImageDataUtils.line(
              imageData,
              x1,
              y1,
              x2,
              y2,
              Color.toUint8(color),
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
        )
      )
    } else {
      doLayerPaintOperation((imageData) =>
        doSymmetry4Operation(
          (imageData, x1, y1, x2, y2, color, dither, mask) =>
            ImageDataUtils.line(
              imageData,
              x1,
              y1,
              x2,
              y2,
              Color.toUint8(color),
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
        )
      )
    }
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
    if (isTemp) {
      doTempPaintOperation((imageData) =>
        doSymmetry4Operation(
          (imageData, x1, y1, x2, y2, color, dither, mask) =>
            ImageDataUtils.rect(
              imageData,
              x1,
              y1,
              x2,
              y2,
              Color.toUint8(color),
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
        )
      )
    } else {
      doLayerPaintOperation((imageData) =>
        doSymmetry4Operation(
          (imageData, x1, y1, x2, y2, color, dither, mask) =>
            ImageDataUtils.rect(
              imageData,
              x1,
              y1,
              x2,
              y2,
              Color.toUint8(color),
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
        )
      )
    }
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
    if (isTemp) {
      doTempPaintOperation((imageData) =>
        doSymmetry4Operation(
          (imageData, x1, y1, x2, y2, color, dither, mask) =>
            ImageDataUtils.ellipse(
              imageData,
              x1,
              y1,
              x2,
              y2,
              Color.toUint8(color),
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
        )
      )
    } else {
      doLayerPaintOperation((imageData) =>
        doSymmetry4Operation(
          (imageData, x1, y1, x2, y2, color, dither, mask) =>
            ImageDataUtils.ellipse(
              imageData,
              x1,
              y1,
              x2,
              y2,
              Color.toUint8(color),
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
        )
      )
    }
  }

  function precomputedCircle(
    x,
    y,
    radius,
    color,
    dither = null,
    mask = null
  ) {
    doLayerPaintOperation((imageData) =>
      doSymmetry2Operation(
        (imageData, x, y, color, dither, mask) =>
          ImageDataUtils.precomputedCircle(
            imageData,
            x,
            y,
            radius,
            Color.toUint8(color),
            dither,
            mask
          ),
        imageData,
        x,
        y,
        color,
        dither,
        mask
      )
    )
  }

  function transformation(x, y) {
    doLayerPaintOperation((imageData) => {
      ImageDataUtils.translate(imageData, x, y, transform.tiling)
    })
  }

  function flipHorizontally() {
    doLayerPaintOperation((imageData) => {
      ImageDataUtils.flipHorizontally(imageData)
    })
  }

  function flipVertically() {
    doLayerPaintOperation((imageData) => {
      ImageDataUtils.flipVertically(imageData)
    })
  }

  function useTool(e, pointer) {
    // TODO: All behavior can be vastly improved.
    if (moving.value) {
      return
    }
    modified.value = true
    if (e.buttons === 4 || keys.current.has(' ')) {
      if (pointer.pressure > 0) {
        moveBy(e.movementX, e.movementY)
      }
      return
    }

    if (
      (tool.value === Tool.PENCIL || tool.value === Tool.ERASER) &&
      pointer.pressure > 0
    ) {
      const toolColor =
        tool.value === Tool.PENCIL ? color.value : 'rgba(0,0,0,0)'
      const toolSize = tool.value === Tool.PENCIL ? pencil.size : eraser.size
      const shape = tool.value === Tool.PENCIL ? pencil.shape : eraser.shape
      const dither = tool.value === Tool.PENCIL ? pencil.dither : eraser.dither

      const mask = selection.getMaskImageData()

      if (e.type === 'pointerdown') {
        if (pencil.size === 1) {
          putColor(
            pointer.current.x,
            pointer.current.y,
            toolColor,
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
            precomputedCircle(
              pointer.current.x,
              pointer.current.y,
              toolSize,
              toolColor,
              null,
              mask
            )
          } else if (shape === PencilShape.SQUARE) {
            rectangle(
              pointer.current.x - subSizeHalf,
              pointer.current.y - subSizeHalf,
              pointer.current.x + addSizeHalf,
              pointer.current.y + addSizeHalf,
              toolColor,
              false,
              true,
              false,
              null,
              mask
            )
          } else if (shape === PencilShape.DITHER) {
            rectangle(
              pointer.current.x - subSizeHalf,
              pointer.current.y - subSizeHalf,
              pointer.current.x + addSizeHalf,
              pointer.current.y + addSizeHalf,
              toolColor,
              false,
              true,
              false,
              dither
            )
          }
        }
      } else if (e.type === 'pointermove') {
        if (toolSize === 1) {
          line(
            pointer.current.x,
            pointer.current.y,
            pointer.previous.x,
            pointer.previous.y,
            toolColor,
            false,
            dither,
            mask
          )
        } else {
          const sizeHalf = toolSize / 2

          const steps = Math.hypot(
            pointer.current.x - pointer.previous.x,
            pointer.current.y - pointer.previous.y
          )

          for (let step = 0; step < steps; step++) {
            const p = step / steps
            const x = Interpolation.linear(
              p,
              pointer.previous.x,
              pointer.current.x
            )
            const y = Interpolation.linear(
              p,
              pointer.previous.y,
              pointer.current.y
            )
            if (shape === PencilShape.ROUND) {
              precomputedCircle(
                x,
                y,
                toolSize,
                toolColor,
                null,
                mask
              )
            } else if (shape === PencilShape.SQUARE) {
              rectangle(
                x - sizeHalf,
                y - sizeHalf,
                x + sizeHalf,
                y + sizeHalf,
                toolColor,
                false,
                true,
                false,
                null,
                mask
              )
            } else if (shape === PencilShape.DITHER) {
              rectangle(
                x - sizeHalf,
                y - sizeHalf,
                x + sizeHalf,
                y + sizeHalf,
                toolColor,
                false,
                true,
                false,
                dither,
                mask
              )
            }
          }
        }
      }
    } else if (tool.value === Tool.FILL && pointer.pressure > 0) {
      if (fill.type === FillType.ERASE) {
        fillColor(
          'rgba(0,0,0,0)',
          pointer.current.x,
          pointer.current.y,
          selection.getMaskImageData()
        )
      } else if (fill.type === FillType.FILL) {
        fillColor(
          color.value,
          pointer.current.x,
          pointer.current.y,
          selection.getMaskImageData()
        )
      }
    } else if (tool.value === Tool.SHAPE) {
      if (e.type === 'pointerdown') {
        saveCopyBuffer()
      }
      if (shape.type === ShapeType.LINE) {
        if (
          e.type === 'pointerdown' ||
          (e.type === 'pointermove' && pointer.pressure > 0)
        ) {
          line(
            pointer.start.x,
            pointer.start.y,
            pointer.current.x,
            pointer.current.y,
            color.value,
            'temp',
            null,
            selection.getMaskImageData()
          )
        } else if (e.type === 'pointerup') {
          line(
            pointer.start.x,
            pointer.start.y,
            pointer.end.x,
            pointer.end.y,
            color.value,
            null,
            null,
            selection.getMaskImageData()
          )
        }
      } else if (shape.type === ShapeType.RECTANGLE) {
        if (
          e.type === 'pointerdown' ||
          (e.type === 'pointermove' && pointer.pressure > 0)
        ) {
          rectangle(
            pointer.start.x,
            pointer.start.y,
            pointer.current.x,
            pointer.current.y,
            color.value,
            'temp',
            shape.filled,
            shape.lockAspectRatio,
            null,
            selection.getMaskImageData()
          )
        } else if (e.type === 'pointerup') {
          rectangle(
            pointer.start.x,
            pointer.start.y,
            pointer.end.x,
            pointer.end.y,
            color.value,
            null,
            shape.filled,
            shape.lockAspectRatio,
            null,
            selection.getMaskImageData()
          )
        }
      } else if (shape.type === ShapeType.ELLIPSE) {
        if (
          e.type === 'pointerdown' ||
          (e.type === 'pointermove' && pointer.pressure > 0)
        ) {
          ellipse(
            pointer.start.x,
            pointer.start.y,
            pointer.current.x,
            pointer.current.y,
            color.value,
            'temp',
            shape.filled,
            shape.lockAspectRatio,
            null,
            selection.getMaskImageData()
          )
        } else if (e.type === 'pointerup') {
          ellipse(
            pointer.start.x,
            pointer.start.y,
            pointer.end.x,
            pointer.end.y,
            color.value,
            null,
            shape.filled,
            shape.lockAspectRatio,
            null,
            selection.getMaskImageData()
          )
        }
      }
    } else if (tool.value === Tool.DROPPER && pointer.pressure > 0) {
      eyeDropper(pointer.current.x, pointer.current.y)
    } else if (tool.value === Tool.TRANSFORM && pointer.pressure > 0) {
      // TODO: Esto es MUY mejorable.
      const x = pointer.relative.x
      const y = pointer.relative.y
      transformation(x, y)
    }
    /*
    else if (tool.value === Tool.SELECT && pointer.pressure > 0) {
      const x = pointer.current.x
      const y = pointer.current.y
      ImageDataUtils.putColor(
        selection.getMaskImageData(),
        x,
        y,
        Color.fromRGBA(1, 1, 1, 1)
      )
    }
    */
  }

  /**
   * Copies main <canvas> content to a secondary <canvas> (copyCanvas) used as a copy.
   */
  function saveCopyBuffer() {
    Canvas.copy(copyCanvas.value, canvas.value)
    ImageDataUtils.copyFromCanvas(copyImageData.value, canvas.value)
  }

  /**
   * Draws the secondary canvas (copyCanvas) content into the main canvas.
   */
  function restoreCopyBuffer() {
    Canvas.copy(canvas.value, copyCanvas.value)
    ImageDataUtils.copyToCanvas(copyImageData.value, canvas.value)
  }

  /**
   * Draws the drawing <canvas> (drawingCanvas) content into the main canvas.
   */
  function drawDrawingBuffer() {
    requestAnimationFrame(() => {
      restoreCopyBuffer()
      const context = CanvasContext2D.get(canvas.value)
      const drawingContext = CanvasContext2D.get(drawingCanvas.value)
      drawingContext.putImageData(drawingImageData.value, 0, 0)
      context.drawImage(drawingCanvas.value, 0, 0)
    })
  }

  function drawGrid() {
    const context = CanvasContext2D.get(canvas.value)
    context.beginPath()
    context.lineWidth = 1 / zoom // Ancho de línea en función del zoom
    context.strokeStyle = '#ccc'

    // Dibujar líneas horizontales
    for (let y = 0; y <= context.canvas.height; y++) {
      const yPos = y * zoom
      context.moveTo(0, yPos)
      context.lineTo(context.canvas.width, yPos)
    }

    // Dibujar líneas verticales
    for (let x = 0; x <= context.canvas.width; x++) {
      const xPos = x * zoom
      context.moveTo(xPos, 0)
      context.lineTo(xPos, context.canvas.height)
    }

    context.stroke()
  }

  function * reverse(list) {
    for (let index = list.length - 1; index >= 0; --index) {
      yield list[index]
    }
  }

  function redraw() {
    const context = CanvasContext2D.get(canvas.value)
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    // createPattern --> fillRect
    // context.drawImage(el fondo transparente)
    const frame = animation.current
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

  function redrawAll() {
    redraw()
    redrawPreview()
    redrawFrames()
    drawGrid()
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
   * Initializes the document.
   */
  function init() {
    // Drawing
    drawing.value = false
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
    selection.init(canvas.value, width.value, height.value)
  }

  function createFromDocument(document) {
    create(document.width, document.height, document.palette, document.layers)
    redrawAll()
  }

  /**
   * Creates a new document.
   *
   * @param {number} width
   * @param {number} height
   * @param {Array<Color>} palette
   * @param {Array<Layer>} layers
   */
  function create(newWidth, newHeight, newPalette = [], newLayers = []) {
    if (!Number.isInteger(width) && width < 0) {
      throw new Error('Invalid width value')
    }
    if (!Number.isInteger(height) && height < 0) {
      throw new Error('Invalid width value')
    }
    width.value = newWidth
    height.value = newHeight
    palette.set(newPalette)
    symmetry.position.set(unref(newWidth) / 2, unref(newHeight) / 2)
    if (newLayers.length === 0) {
      newLayers.push({ name: 'Background', width: newWidth, height: newHeight })
    }
    layers.set(newLayers)
    const id = uuid()
    const canvas = Canvas.createWith(width.value, height.value, {
      id: id,
      className: 'preview-canvas'
    })
    frames.value.push({
      id,
      canvas
    })
    tool.value = Tool.PENCIL
    init()
  }

  /**
   * Destroys everything and allows the resources to be
   * garbage collected.
   */
  function destroy() {
    width.value = 0
    height.value = 0
    palette.clear()
    symmetry.position.set(0, 0)
    layers.clear()
    frames.value.splice(0, frames.value.length)
    tool.value = Tool.PENCIL
    drawing.value = false
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
      const layerIndex = layers.list.findIndex((item) => item.id === layers.current.id)
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
    position.add(x / zoom.current, y / zoom.current)
  }

  /***************************************************************************
   * Color
   ***************************************************************************/
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
      const palette = await GIMP.load(file)
      palette.set(palette)
    } else if (/.*\.pal$/i.test(file.name)) {
      const palette = await PAL.load(file)
      palette.set(palette)
    } else if (/.*\.act$/i.test(file.name)) {
      const palette = await ACT.load(file)
      palette.set(palette)
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
      }
    }
    const [removedFrame] = frames.value.splice(frame, 1)
    animation.remove()
    redrawAll()
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
    }
    createFromDocument(document)
  }

  /**
   * Save file
   */
  async function saveFileAs() {
    const suggestedFileName = 'untitled'
    const fileExtension = '.ora'
    await FilePicker.showSave((fileHandle) => OpenRaster.save(fileHandle), {
      types: ImageTypes,
      defaultFileName: suggestedFileName + fileExtension,
      excludeAcceptAllOption: true,
      multiple: false
    })
    modified.value = false
  }

  /**
   * Export file
   */
  async function exportFileAs(title, format, scale, quality) {
    const fileExtension = `.${format}`
    const transformedQuality = quality / 100

    // Calculate new size
    const originalWidth = canvas.width
    const originalHeight = canvas.height

    const newWidth = originalWidth * scale
    const newHeight = originalHeight * scale

    // Create new canvas with modified size
    const scaledCanvas = document.createElement('canvas')
    scaledCanvas.width = newWidth
    scaledCanvas.height = newHeight

    const scaledCtx = scaledCanvas.getContext('2d')

    // Copy original image to new canvas with modified size
    scaledCtx.imageSmoothingEnabled = false
    scaledCtx.drawImage(canvas, 0, 0, newWidth, newHeight)

    const dataURL = scaledCanvas.toDataURL(
      `image/${format}`,
      transformedQuality
    )
    const a = document.createElement('a')
    a.href = dataURL
    a.download = title + fileExtension
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
        color = actionToUndo.payload.previousColor
        break
      case 'setTool':
        tool = actionToUndo.payload.previousTool
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
        color = actionToRedo.payload.color
        break
      case 'setTool':
        tool = actionToRedo.payload.tool
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

  function setBoard(newBoard) {
    board.value = newBoard
  }

  function unsetBoard() {
    board.value = null
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
    title,
    animation,
    board,
    canvas,
    canvasRect,
    color,
    colorMode,
    colorPicker,
    copyCanvas,
    copyImageData,
    drawing,
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
    moving,
    onionSkin,
    palette,
    pencil,
    position,
    previewCanvas,
    selection,
    shape,
    symmetry,
    tool,
    transform,
    width,
    zoom,
    zoomPreview,
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
    mergeBy,
    mergeDown,
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
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDocumentStore, import.meta.hot))
}
