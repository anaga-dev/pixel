import { useDither } from '@/composables/useDither'
import { usePoint } from '@/composables/usePoint'
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

import OpenRaster from '@/pixel/formats/images/OpenRaster'
import PNG from '@/pixel/formats/images/PNG'

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
 * This is the Document type that is used when
 * loading and saving a document.
 *
 * @typedef {Object} Document
 * @property {number} width
 * @property {number} height
 * @property {Array<Layer>} layers
 */

export const useDocumentStore = defineStore('document', {
  state: () => ({
    modal: '',
    width: 0, // document width
    height: 0, // document height
    position: usePoint(), // current position
    zoom: useZoomStore(), // current zoom
    zoomPreview: false,
    canvas: null,
    canvasRect: null,
    tool: Tool.PENCIL,
    drawing: false,
    copyImageData: null,
    drawingImageData: null,
    drawingCanvas: null,
    copyCanvas: null,
    previewCanvas: null,
    color: '#000000',
    colorMode: ColorMode.PALETTE,
    colorPicker: false,
    grid: useGridStore(),
    symmetry: useSymmetryStore(),
    onionSkin: useOnionSkin(),
    animation: null,
    pencil: usePencilStore(),
    eraser: useEraserStore(),
    fill: useFillStore(),
    shape: useShapeStore(),
    transform: useTransformStore(),
    selection: useSelectionStore(),
    dropper: {
      includeReferenceLayers: true
    },
    history: useHistoryStore(),
    layers: useLayersStore(),
    palette: usePaletteStore(),
    animation: useAnimationStore()
  }),
  getters: {
    isPaused() {
      if (!this.animation) return false
      return this.animation.isPaused
    },
    isPlaying() {
      if (!this.animation) return false
      return this.animation.isPlaying
    },
    canPlayAnimation() {
      if (!this.animation) return false
      return this.animation.canPlay
    },
    canGoToFirstFrame() {
      if (!this.animation) return false
      return this.animation.canGoFirst
    },
    canGoToPreviousFrame() {
      if (!this.animation) return false
      return this.animation.canGoPrevious
    },
    canGoToNextFrame() {
      if (!this.animation) return false
      return this.animation.canGoNext
    },
    canGoToLastFrame() {
      if (!this.animation) return false
      return this.animation.canGoLast
    },
    lastHistoryAction() {
      if (this.history.index >= 0) {
        return this.history.list[this.history.index]
      }
      return undefined
    },
    totalFrames() {
      if (!this.animation) return 0
      return this.animation.total
    },
    frames() {
      // FIXME: Esto no es NADA óptimo.
      const frames = []
      for (let frame = 0; frame < this.totalFrames; frame++) {
        const frameCanvas = Canvas.createWithClasses(
          this.width,
          this.height,
          'preview-canvas'
        )
        const frameContext = CanvasContext2D.get(frameCanvas)
        frameContext.clearRect(0, 0, frameCanvas.width, frameCanvas.height)
        for (const layer of this.layers.list) {
          if (!layer.visible.value) {
            continue
          }
          frameContext.save()
          frameContext.globalAlpha = layer.opacity.value
          frameContext.globalCompositeOperation = layer.blendMode.value
          // layer.context.putImageData(layer.frames[frame], 0, 0)
          frameContext.drawImage(layer.canvas, 0, 0)
          frameContext.restore()
        }
        // TODO: Aquí deberíamos poder renderizar en el <canvas>
        // el fotograma indicado.
        frames.push({
          frame,
          canvas: frameCanvas
        })
      }
      return frames
    },
    layer() {
      return this.layers.current
    },
    imageData() {
      if (!this.layer) {
        return null
      }
      const frame = this.animation.current
      return this.layer.frames[frame]
    }
  },
  actions: {
    updateCanvasRect() {
      // Necesitamos obtener el client rect para poder calcular
      // donde irá el canvas de selección.
      this.canvasRect = this.canvas.getBoundingClientRect()
    },
    toggleColorPicker() {
      this.colorPicker = !this.colorPicker
    },
    setPencilShape(shape) {
      this.pencil.shape = shape
    },
    setPencilSize(size) {
      this.pencil.size = size
      this.pencil.sizeHalf = size / 2
    },
    setPencilDitherLevel(level) {
      this.pencil.dither.level = level
    },
    setEraserShape(shape) {
      this.eraser.shape = shape
    },
    setEraserSize(size) {
      this.eraser.size = size
    },
    setEraserDitherLevel(level) {
      this.eraser.dither.level = level
    },
    setSelectType(type) {
      this.selection.type = type
    },
    setSelectMode(mode) {
      this.selection.mode = mode
    },
    toggleSelectContiguous() {
      this.selection.contiguous = !this.selection.contiguous
    },
    deselect() {
      this.selection.clear()
    },
    setFillType(type) {
      this.fill.type = type
    },
    toggleFillContiguous() {
      this.fill.contiguous = !this.fill.contiguous
    },
    setShapeType(type) {
      this.shape.type = type
    },
    toggleShapeFill() {
      this.shape.filled = !this.shape.filled
    },
    toggleShapeLockAspectRatio() {
      this.shape.lockAspectRatio = !this.shape.lockAspectRatio
    },
    setSymmetrySettings(axis) {
      console.log('Axis', axis)
      if (this.symmetry.axis === axis) {
        console.log('Symmetry off!!!')
        this.symmetry.axis = null
      } else {
        console.log('Symmetry set to:', axis)
        this.symmetry.axis = axis
      }
    },
    setSymmetryAxis(axis) {
      this.symmetry.axis = axis
    },
    setTool(tool) {
      this.history.add({
        type: 'setTool',
        payload: {
          tool,
          previousTool: this.tool
        }
      })
      this.tool = tool
    },
    eyeDropper(x, y) {
      const context = CanvasContext2D.get(this.layer.canvas)
      const previousColor = this.color
      const nextColor = CanvasContext2D.getColor(context, x, y)
      this.history.add({
        type: 'setColor',
        payload: {
          previousColor: previousColor,
          nextColor: nextColor
        }
      })
      this.color = nextColor
    },
    doTempPaintOperation(callback) {
      ImageDataUtils.clear(this.drawingImageData, [0, 0, 0, 0])
      callback(this.drawingImageData)
      this.drawDrawingBuffer()
    },
    doLayerPaintOperation(callback) {
      const imageData = this.imageData
      const previousImageData = ImageDataUtils.clone(imageData)
      callback(imageData)
      if (ImageDataUtils.equals(imageData, previousImageData)) {
        return
      }
      const nextImageData = ImageDataUtils.clone(imageData)
      this.history.add({
        type: 'paintOperation',
        payload: {
          imageData,
          nextImageData,
          previousImageData
        }
      })
      this.redrawAll()
    },
    fillColor(color, x, y, mask) {
      // FIXME: Cuando el color es el inicial #000 por algún motivo
      // no pinta bien el alpha.
      if (!this.fill.contiguous) {
        this.doLayerPaintOperation((imageData) =>
          ImageDataUtils.replaceColorAt(imageData, x, y, Color.toUint8(color), mask)
        )
      } else {
        this.doLayerPaintOperation((imageData) =>
          this.doSymmetry2Operation(
            (imageData, x, y, color, dither) =>
              ImageDataUtils.fill(imageData, x, y, Color.toUint8(color), mask),
            imageData,
            x,
            y,
            color
          )
        )
      }
    },
    doSymmetry2Operation(callback, imageData, x, y, color, dither, mask) {
      callback(imageData, x, y, color, dither, mask)
      if (this.symmetry.axis === null) {
        return
      }
      if (this.symmetry.axis === SymmetryAxis.HORIZONTAL) {
        callback(imageData, this.width - 1 - x, y, color, dither, mask)
      } else if (this.symmetry.axis === SymmetryAxis.VERTICAL) {
        callback(imageData, x, this.height - 1 - y, color, dither, mask)
      } else if (this.symmetry.axis === SymmetryAxis.BOTH) {
        callback(imageData, this.width - 1 - x, y, color, dither, mask)
        callback(imageData, x, this.height - 1 - y, color, dither, mask)
        callback(
          imageData,
          this.width - 1 - x,
          this.height - 1 - y,
          color,
          dither,
          mask
        )
      }
    },
    doSymmetry4Operation(callback, imageData, x1, y1, x2, y2, color, dither, mask) {
      callback(imageData, x1, y1, x2, y2, color, dither, mask)
      if (this.symmetry.axis === null) {
        return
      }
      if (this.symmetry.axis === SymmetryAxis.HORIZONTAL) {
        callback(
          imageData,
          this.width - 1 - x1,
          y1,
          this.width - 1 - x2,
          y2,
          color,
          dither,
          mask
        )
      } else if (this.symmetry.axis === SymmetryAxis.VERTICAL) {
        callback(
          imageData,
          x1,
          this.height - 1 - y1,
          x2,
          this.height - 1 - y2,
          color,
          dither,
          mask
        )
      } else if (this.symmetry.axis === SymmetryAxis.BOTH) {
        callback(
          imageData,
          this.width - 1 - x1,
          y1,
          this.width - 1 - x2,
          y2,
          color,
          dither,
          mask
        )
        callback(
          imageData,
          x1,
          this.height - 1 - y1,
          x2,
          this.height - 1 - y2,
          color,
          dither,
          mask
        )
        callback(
          imageData,
          this.width - 1 - x1,
          this.height - 1 - y1,
          this.width - 1 - x2,
          this.height - 1 - y2,
          color,
          dither,
          mask
        )
      }
    },
    putColor(x, y, color, dither, mask) {
      this.doLayerPaintOperation((imageData) =>
        this.doSymmetry2Operation(
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
    },
    line(x1, y1, x2, y2, color, isTemp = false, dither = null, mask = null) {
      if (isTemp) {
        this.doTempPaintOperation((imageData) =>
          this.doSymmetry4Operation(
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
        this.doLayerPaintOperation((imageData) =>
          this.doSymmetry4Operation(
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
    },
    rectangle(
      x1,
      y1,
      x2,
      y2,
      color,
      isTemp = false,
      isFilled = this.shape.filled,
      lockAspectRatio = this.shape.lockAspectRatio,
      dither = null,
      mask = null
    ) {
      if (lockAspectRatio) {
        // FIXME: En los bordes esto se comporta de forma bastante rara
        // y puede crear formas que no son "1:1".
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
        this.doTempPaintOperation((imageData) =>
          this.doSymmetry4Operation(
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
        this.doLayerPaintOperation((imageData) =>
          this.doSymmetry4Operation(
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
    },
    ellipse(
      x1,
      y1,
      x2,
      y2,
      color,
      isTemp = false,
      isFilled = this.shape.filled,
      lockAspectRatio = this.shape.lockAspectRatio,
      dither = null,
      mask = null
    ) {
      if (lockAspectRatio) {
        // FIXME: En los bordes esto se comporta de forma bastante rara
        // y puede crear formas que no son "1:1".
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
        this.doTempPaintOperation((imageData) =>
          this.doSymmetry4Operation(
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
        this.doLayerPaintOperation((imageData) =>
          this.doSymmetry4Operation(
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
    },
    transformation(x, y) {
      this.doLayerPaintOperation((imageData) => {
        ImageDataUtils.translate(imageData, x, y, this.transform.mode)
      })
    },
    flipHorizontally() {
      this.doLayerPaintOperation((imageData) => {
        ImageDataUtils.flipHorizontally(imageData)
      })
    },
    flipVertically() {
      this.doLayerPaintOperation((imageData) => {
        ImageDataUtils.flipVertically(imageData)
      })
    },
    useTool(e, pointer) {
      // TODO: Todo este comportamiento es MUY mejorable, tengo que ver cómo
      // implementar todo esto de otra forma.
      if (e.ctrlKey || e.buttons === 4) {
        if (pointer.pressure > 0) {
          this.moveBy(e.movementX, e.movementY)
        }
        return
      }
      if (
        (this.tool === Tool.PENCIL || this.tool === Tool.ERASER) &&
        pointer.pressure > 0
      ) {
        const color = this.tool === Tool.PENCIL ? this.color : 'rgba(0,0,0,0)'

        const size =
          this.tool === Tool.PENCIL ? this.pencil.size : this.eraser.size

        const shape =
          this.tool === Tool.PENCIL ? this.pencil.shape : this.eraser.shape

        const dither =
          this.tool === Tool.PENCIL ? this.pencil.dither : this.eraser.dither

        const mask = this.selection.getMaskImageData()

        if (e.type === 'pointerdown') {
          if (this.pencil.size === 1) {
            this.putColor(pointer.current.x, pointer.current.y, color, dither, mask)
          } else {
            const sizeHalf = size / 2
            const subSizeHalf = size % 2 === 0 ? sizeHalf : Math.floor(sizeHalf)
            const addSizeHalf = size % 2 === 0 ? sizeHalf : Math.ceil(sizeHalf)
            if (shape === PencilShape.ROUND) {
              this.ellipse(
                pointer.current.x - subSizeHalf,
                pointer.current.y - subSizeHalf,
                pointer.current.x + addSizeHalf,
                pointer.current.y + addSizeHalf,
                color,
                false,
                true,
                false,
                null,
                mask
              )
            } else if (shape === PencilShape.SQUARE) {
              this.rectangle(
                pointer.current.x - subSizeHalf,
                pointer.current.y - subSizeHalf,
                pointer.current.x + addSizeHalf,
                pointer.current.y + addSizeHalf,
                color,
                false,
                true,
                false,
                null,
                mask
              )
            } else if (shape === PencilShape.DITHER) {
              this.rectangle(
                pointer.current.x - subSizeHalf,
                pointer.current.y - subSizeHalf,
                pointer.current.x + addSizeHalf,
                pointer.current.y + addSizeHalf,
                color,
                false,
                true,
                false,
                dither
              )
            }
          }
        } else if (e.type === 'pointermove') {
          if (size === 1) {
            this.line(
              pointer.current.x,
              pointer.current.y,
              pointer.previous.x,
              pointer.previous.y,
              color,
              false,
              dither,
              mask
            )
          } else {
            const sizeHalf = size / 2

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
                this.ellipse(
                  x - sizeHalf,
                  y - sizeHalf,
                  x + sizeHalf,
                  y + sizeHalf,
                  color,
                  false,
                  true,
                  false,
                  null,
                  mask
                )
              } else if (shape === PencilShape.SQUARE) {
                this.rectangle(
                  x - sizeHalf,
                  y - sizeHalf,
                  x + sizeHalf,
                  y + sizeHalf,
                  color,
                  false,
                  true,
                  false,
                  null,
                  mask
                )
              } else if (shape === PencilShape.DITHER) {
                this.rectangle(
                  x - sizeHalf,
                  y - sizeHalf,
                  x + sizeHalf,
                  y + sizeHalf,
                  color,
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
      } else if (this.tool === Tool.FILL && pointer.pressure > 0) {
        if (this.fill.type === FillType.ERASE) {
          this.fillColor('rgba(0,0,0,0)', pointer.current.x, pointer.current.y, this.selection.getMaskImageData())
        } else if (this.fill.type === FillType.FILL) {
          this.fillColor(this.color, pointer.current.x, pointer.current.y, this.selection.getMaskImageData())
        }
      } else if (this.tool === Tool.SHAPE) {
        if (e.type === 'pointerdown') {
          this.saveCopyBuffer()
        }
        if (this.shape.type === ShapeType.LINE) {
          if (
            e.type === 'pointerdown' ||
            (e.type === 'pointermove' && pointer.pressure > 0)
          ) {
            this.line(
              pointer.start.x,
              pointer.start.y,
              pointer.current.x,
              pointer.current.y,
              this.color,
              'temp',
              null,
              this.selection.getMaskImageData()
            )
          } else if (e.type === 'pointerup') {
            this.line(
              pointer.start.x,
              pointer.start.y,
              pointer.end.x,
              pointer.end.y,
              this.color,
              null,
              null,
              this.selection.getMaskImageData()
            )
          }
        } else if (this.shape.type === ShapeType.RECTANGLE) {
          if (
            e.type === 'pointerdown' ||
            (e.type === 'pointermove' && pointer.pressure > 0)
          ) {
            this.rectangle(
              pointer.start.x,
              pointer.start.y,
              pointer.current.x,
              pointer.current.y,
              this.color,
              'temp'
            )
          } else if (e.type === 'pointerup') {
            this.rectangle(
              pointer.start.x,
              pointer.start.y,
              pointer.end.x,
              pointer.end.y,
              this.color
            )
          }
        } else if (this.shape.type === ShapeType.ELLIPSE) {
          if (
            e.type === 'pointerdown' ||
            (e.type === 'pointermove' && pointer.pressure > 0)
          ) {
            this.ellipse(
              pointer.start.x,
              pointer.start.y,
              pointer.current.x,
              pointer.current.y,
              this.color,
              'temp'
            )
          } else if (e.type === 'pointerup') {
            this.ellipse(
              pointer.start.x,
              pointer.start.y,
              pointer.end.x,
              pointer.end.y,
              this.color
            )
          }
        }
      } else if (this.tool === Tool.DROPPER && pointer.pressure > 0) {
        this.eyeDropper(pointer.current.x, pointer.current.y)
      } else if (this.tool === Tool.TRANSFORM && pointer.pressure > 0) {
        // TODO: Esto es MUY mejorable.
        const x = pointer.relative.x
        const y = pointer.relative.y
        this.transformation(x, y)
      }
      /*
      else if (this.tool === Tool.SELECT && pointer.pressure > 0) {
        const x = pointer.current.x
        const y = pointer.current.y
        ImageDataUtils.putColor(
          this.selection.getMaskImageData(),
          x,
          y,
          Color.fromRGBA(1, 1, 1, 1)
        )
      }
      */
    },
    /**
     * Copia lo que haya en el <canvas> principal
     * a un <canvas> secundario utilizado como "copia".
     */
    saveCopyBuffer() {
      Canvas.copy(this.copyCanvas, this.canvas)
      ImageDataUtils.copyFromCanvas(this.copyImageData, this.canvas)
    },
    /**
     * Dibuja lo que haya en el <canvas> "copia" en
     * el <canvas> principal.
     */
    restoreCopyBuffer() {
      Canvas.copy(this.canvas, this.copyCanvas)
      ImageDataUtils.copyToCanvas(this.copyImageData, this.canvas)
    },
    /**
     * Dibuja lo que haya en el <canvas> "dibujo"
     * en el <canvas> principal.
     */
    drawDrawingBuffer() {
      requestAnimationFrame(() => {
        this.restoreCopyBuffer()
        const { canvas, drawingCanvas, drawingImageData } = this
        const context = CanvasContext2D.get(canvas)
        const drawingContext = CanvasContext2D.get(drawingCanvas)
        drawingContext.putImageData(drawingImageData, 0, 0)
        context.drawImage(drawingCanvas, 0, 0)
      })
    },
    redraw() {
      const context = CanvasContext2D.get(this.canvas)
      context.clearRect(0, 0, context.canvas.width, context.canvas.height)
      const frame = this.animation.current
      for (const layer of this.layers.list) {
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
    },
    redrawPreview() {
      const context = CanvasContext2D.get(this.previewCanvas)
      context.clearRect(0, 0, context.canvas.width, context.canvas.height)
      context.drawImage(this.canvas, 0, 0)
    },
    redrawAll() {
      this.redraw()
      this.redrawPreview()
      this.redrawFrames()
    },
    redrawFrames() {
      for (const frame of this.frames) {
        const context = CanvasContext2D.get(frame.canvas)
        context.clearRect(0, 0, frame.canvas.width, frame.canvas.height)
        for (const layer of this.layers.list) {
          if (!layer.visible.value) continue
          context.save()
          context.globalAlpha = layer.opacity.value
          context.globalCompositeOperation = layer.blendMode.value
          // layer.context.putImageData(layer.frames[frame.frame], 0, 0)
          context.drawImage(layer.canvas, 0, 0)
          context.restore()
        }
      }
    },
    initDrawing() {
      this.drawing = false
      // TODO: Esto habría que rehacerlo todo para que no utilice drawImage
      // si no putImageData.
      this.drawingCanvas = Canvas.createOrGet(
        this.drawingCanvas,
        this.width,
        this.height
      )
      this.drawingImageData = new ImageData(this.width, this.height)
      this.copyCanvas = Canvas.createOrGet(
        this.copyCanvas,
        this.width,
        this.height
      )
      this.copyImageData = new ImageData(this.width, this.height)
      this.previewCanvas = Canvas.createOrGetWithClasses(
        this.previewCanvas,
        this.width,
        this.height,
        'preview-canvas'
      )
      this.canvas = Canvas.createOrGetWithClasses(
        this.canvas,
        this.width,
        this.height,
        'pixel-canvas'
      )
      this.canvasRect = null
    },
    initSelection() {
      this.selection.init(this.canvas, this.width, this.height)
    },
    initPattern() {},
    init() {
      this.initDrawing()
      this.initSelection()
      this.initPattern()
    },
    createFromDocument(document) {
      this.create(
        document.width,
        document.height,
        document.palette,
        document.layers
      )
      this.redrawAll()
    },
    create(
      width,
      height,
      palette = [],
      layers = [{ name: 'Background', width, height }]
    ) {
      if (!Number.isInteger(width) && width < 0) {
        throw new Error('Invalid width value')
      }
      if (!Number.isInteger(height) && height < 0) {
        throw new Error('Invalid width value')
      }
      this.modal = ''
      this.width = width
      this.height = height
      this.palette = palette
      this.symmetry.position.set(this.width / 2, this.height / 2)
      this.layers.set(layers)
      this.tool = Tool.PENCIL
      this.init()
    },
    /***************************************************************************
     * Layers
     ***************************************************************************/
    mergeDown() {
      // TODO: Cogemos todas las capaz "inferiores" a la capa seleccionada y las mezclamos en una
      // única capa.
      const index = this.layers.list.findIndex(
        (currentLayer) => currentLayer.id === this.layer.id
      )
      const mergedLayer = this.createNewLayer({
        name: 'Merged'
      })
      const removedLayers = this.layers.list.splice(0, index, mergedLayer)
      for (const layer of removedLayers) {
        // pintamos todas las capas en la capa nueva.
      }
    },
    mergeBy(mode = 'all') {
      // 'visible', 'all'
      // TODO: Cogemos todas las capas y las mezclamos en una única capa
      // utilizando sólo las capas visibles.
    },
    setLayer(layer) {
      this.layers.current = layer
    },
    setLayerBlendMode(layer, blendMode) {
      console.log('blend mode', blendMode)
      layer.blendMode.value = blendMode
      this.redrawAll()
    },
    setLayerOpacity(layer, opacity) {
      console.log('opacity changed to', opacity)
      layer.opacityPercentage.value = opacity
      this.redrawAll()
    },
    hideLayerSettings() {
      this.layers.settings = null
    },
    showLayerSettings(layer) {
      if (this.layers.settings === layer) {
        this.hideLayerSettings()
        return
      }
      this.layers.settings = layer
    },
    moveLayerUp() {
      this.layers.moveUp()
      this.redrawAll()
    },
    moveLayerDown() {
      this.layers.moveDown()
      this.redrawAll()
    },
    addLayer() {
      this.layers.add({
        width: this.width,
        height: this.height
      })
    },
    duplicateLayer(layer) {
      this.layers.duplicate(layer)
      this.redrawAll()
    },
    toggleLayer(layer) {
      this.layers.toggle(layer)
      this.redrawAll()
    },
    removeLayer(layer) {
      this.layers.remove(layer)
      this.redrawAll()
    },
    swapLayers(fromIndex, toIndex) {
      this.layers.swap(fromIndex, toIndex)
      this.redrawAll()
    },
    changeLayerName(layer, name) {
      layer.name.value = name
    },
    /***************************************************************************
     * Movement and zoom
     ***************************************************************************/
    center() {
      this.position.reset()
    },
    moveAndZoom(x, y, z) {
      this.moveBy(x, y)
      this.zoom.relative(z)
    },
    moveTo(x, y) {
      this.position.set(x, y)
    },
    moveBy(x, y) {
      this.position.add(x / this.zoom.current, y / this.zoom.current)
    },
    /***************************************************************************
     * Color
     ***************************************************************************/
    setColor(color) {
      this.history.add({
        type: 'setColor',
        payload: { color: color, previousColor: this.color }
      })
      this.color = color
      if (this.colorPicker) {
        this.colorPicker = false
      }
    },
    setColorMode(colorMode) {
      this.colorMode = colorMode
    },
    /***************************************************************************
     * Palette
     ***************************************************************************/
    /**
     * Load palette
     */
    async loadPalette() {
      // FIXME: Ni firefox, ni Safari lo soportan
      const [fileHandle] = await window.showOpenFilePicker({
        types: PaletteTypes,
        excludeAcceptAllOption: true,
        multiple: false
      })
      if (fileHandle.kind === 'file') {
        const file = await fileHandle.getFile()
        if (/(.*)\.gpl$/i.test(file.name)) {
          const palette = await GIMP.load(file)
          this.palette.set(palette)
        }
      }
      console.log(fileHandle)
    },
    /**
     * Save palette
     */
    async savePalette() {
      // FIXME: Ni firefox, ni Safari lo soportan
      const fileHandle = await window.showSaveFilePicker({
        types: PaletteTypes,
        excludeAcceptAllOption: true
      })
      // TODO: ¿Deberíamos lanzar una excepción?
      if (fileHandle.kind !== 'file') return

      console.log(fileHandle)
      const writable = await fileHandle.createWritable()
      console.log(writable)
      const extension = fileHandle.name.slice(fileHandle.name.lastIndexOf('.'))
      if (extension === '.gpl') {
        await writable.write(await GIMP.save(this.palette.colors))
      } else if (extension === '.pal') {
        await writable.write(await PAL.save(this.palette.colors))
      } else if (extension === '.act') {
        await writable.write(await ACT.save(this.palette.colors))
      }
      await writable.close()
    },
    /**
     * Add color to palette
     */
    addPaletteColor() {
      this.history.add({
        type: 'addPaletteColor',
        payload: { color: this.color }
      })
      this.palette.add(this.color)
    },
    /**
     * Remove color from palette
     *
     * @param {number} index
     */
    removePaletteColor(index) {
      const color = this.palette.removeAt(index)
      this.history.add({
        type: 'removePaletteColor',
        payload: { color, index }
      })
    },
    /***************************************************************************
     * Frames
     ***************************************************************************/
    addFrame() {
      if (!this.animation) return
      for (const layer of this.layers.list) {
        if (!layer.isStatic) {
          layer.frames.push(new ImageData(this.width, this.height))
        }
      }
      this.animation.add()
    },
    duplicateFrame() {
      if (!this.animation) return
      const frame = this.animation.current
      for (const layer of this.layers.list) {
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
      this.animation.add()
    },
    removeFrame() {
      if (!this.animation) return
      const frame = this.animation.current
      for (const layer of this.layers) {
        if (!layer.isStatic) {
          const [removedFrame] = layer.frames.splice(frame, 1)
          console.log('Frame', removedFrame, 'removed')
        }
      }
      this.animation.remove()
    },
    toggleAnimation() {
      if (!this.animation) return
      this.animation.toggle()
    },
    pauseAnimation() {
      if (!this.animation) return
      this.animation.pause()
    },
    playAnimation() {
      if (!this.animation) return
      this.animation.play()
    },
    setCurrentFrame(currentFrame) {
      if (!this.animation) return

      this.animation.go(currentFrame)
      this.redrawAll()
    },
    goToFirstFrame() {
      if (!this.animation) return

      if (this.animation.canGoFirst) {
        this.animation.first()
        this.redrawAll()
      }
    },
    goToLastFrame() {
      if (!this.animation) return

      if (this.animation.canGoLast) {
        this.animation.last()
        this.redrawAll()
      }
    },
    goToNextFrame() {
      if (!this.animation) return
      if (this.animation.canGoNext) {
        this.animation.next()
        this.redrawAll()
      }
    },
    goToPreviousFrame() {
      if (!this.animation) return
      if (this.animation.canGoPrevious) {
        this.animation.previous()
        this.redrawAll()
      }
    },
    newFile() {
      console.info('TO BE IMPLEMENTED!')
    },
    /**
     * Open file
     */
    async openFile() {
      if ('showOpenFilePicker' in window) {
        const [fileHandle] = await window.showOpenFilePicker({
          types: ImageTypes,
          excludeAcceptAllOption: true,
          multiple: false
        })
        if (fileHandle.kind === 'file') {
          const file = await fileHandle.getFile()
          console.log(file)
          let document
          if (/(.*)\.ora$/i.test(file.name)) {
            document = await OpenRaster.load(file)
            console.log(document)
          } else if (/(.*)\.png$/i.test(file.name)) {
            document = await PNG.load(file)
            console.log(document)
          }
          if (!document) {
          }
          this.createFromDocument(document)
        }
        console.log(fileHandle)
      } else {
        // TODO: Ver cómo implementar esto
        // los navegadores que no lo soportan.
        // Safari y Firefox
      }
    },
    /**
     * Save file
     */
    async saveFileAs() {
      if ('showSaveFilePicker' in window) {
        const fileHandle = await window.showSaveFilePicker({
          types: ImageTypes,
          excludeAcceptAllOption: true,
          multiple: false
        })
        const writable = await fileHandle.createWritable()
        await writable.write(await OpenRaster.save(this))
        await writable.close()
      } else {
        const zip = await OpenRaster.save(this)
        const a = document.createElement('a')
        a.href = URL.createObjectURL(zip)
        a.download = 'test.ora'
        a.click()
      }
    },
    /**
     * History
     */
    undo() {
      const actionToUndo = this.history.undo()
      if (!actionToUndo) {
        return
      }
      switch (actionToUndo.type) {
        case 'addPaletteColor':
          this.palette.removeLast()
          break
        case 'removePaletteColor':
          this.palette.addAt(
            actionToUndo.payload.index,
            actionToUndo.payload.color
          )
          break
        case 'setColor':
          this.color = actionToUndo.payload.previousColor
          break
        case 'setTool':
          this.tool = actionToUndo.payload.previousTool
          break
        case 'paintOperation':
          ImageDataUtils.copy(
            actionToUndo.payload.imageData,
            actionToUndo.payload.previousImageData
          )
          this.redrawAll()
          break
        default:
          console.log('To implement', actionToUndo)
      }
    },
    redo() {
      const actionToRedo = this.history.redo()
      if (!actionToRedo) {
        return
      }
      switch (actionToRedo.type) {
        case 'addPaletteColor':
          this.palette.add(actionToRedo.payload.color)
          break
        case 'removePaletteColor':
          this.palette.removeAt(actionToRedo.payload.index)
          break
        case 'setColor':
          this.color = actionToRedo.payload.color
          break
        case 'setTool':
          this.tool = actionToRedo.payload.tool
          break
        case 'paintOperation':
          ImageDataUtils.copy(
            actionToRedo.payload.imageData,
            actionToRedo.payload.nextImageData
          )
          this.redrawAll()
          break
        default:
          console.log('To implement', actionToRedo)
      }
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDocumentStore, import.meta.hot))
}
