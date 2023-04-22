import { defineStore, acceptHMRUpdate } from 'pinia'
import { v4 as uuid } from 'uuid'
import { usePointer } from '../composables/usePointer'
import { useZoom } from '../composables/useZoom'
import { useHistory } from '../composables/useHistory'
import { useLayers } from '../composables/useLayers'
import { useAnimation } from '../composables/useAnimation'
import Vec2 from '../math/Vec2'
import Color from '../color/Color'
import Canvas from '../canvas/Canvas'
import CanvasContext2D from '../canvas/CanvasContext2D'
import ImageDataUtils from '../canvas/ImageDataUtils'
import OpenRaster from '../formats/OpenRaster'
import Zoom from '../constants/Zoom'
import SymmetryAxis from '../enums/SymmetryAxis'
import BlendMode from '../enums/BlendMode'
import Tool from '../enums/Tool'
import PencilShape from '../enums/PencilShape'
import EraserShape from '../enums/EraserShape'
import ShapeType from '../enums/ShapeType'
import FillType from '../enums/FillType'
import DitherAlignment from '../enums/DitherAlignment'
import SelectType from '../enums/SelectType'
import SelectMode from '../enums/SelectMode'
import AnimationState from '../enums/AnimationState'
import Layer from '../composables/Layer'
import PixelLayer from '../composables/Layer'
import TransformMode from '../enums/TransformMode'
import PaletteTypes from '../constants/PaletteTypes'
import GIMP from '../formats/palettes/GIMP'

// TODO: Creo que una buena cantidad de este código se podrían convertir
// en composables que más tarde utilicemos en las stores.

export const useDocumentStore = defineStore('pixelDocument', {
  state: () => ({
    modal: '',
    width: 0,
    height: 0,
    position: Vec2.create(),
    zoom: useZoom({ initial: Zoom.DEFAULT, min: Zoom.MIN, max: Zoom.MAX }),
    zoomPreview: false,
    canvas: null,
    tool: Tool.PENCIL,
    drawing: false,
    copyImageData: null,
    drawingImageData: null,
    drawingCanvas: null,
    copyCanvas: null,
    previewCanvas: null,
    color: '#000000',
    colorPicker: false,
    grid: {
      enabled: false,
      size: 32,
      color: '#00ffff'
    },
    symmetrySettings: false,
    symmetry: {
      axis: null, // horizontal, vertical, both, null
      position: Vec2.create(),
      lock: false
      // NOTA: Esto tiene una opción de recenter que mueve la simetria al centro.
    },
    onionSkin: {
      opacity: 0.5,
      color: 'original', // original, tint, silhouette
      loop: true,
      keyFramesBefore: 2,
      keyFramesAfter: 2
    },
    animation: null,
    pencil: {
      shape: PencilShape.ROUND, // round, square, matrix-dither
      size: 1, // min: 1, max: 32px
      pixelPerfect: false
    },
    eraser: {
      shape: EraserShape.ROUND, // round, square, matrix-dither
      size: 1,
      dither: 7,
      alignment: DitherAlignment.CANVAS
    },
    fill: {
      type: FillType.FILL, // fill, erase
      contiguous: true
    },
    shape: {
      type: ShapeType.LINE, // line, rectangle, ellipse
      filled: false,
      lockAspectRatio: false
    },
    transform: {
      mode: TransformMode.REPEAT // repeat, clamp, edge
    },
    select: {
      type: SelectType.FREEHAND, // freehand, rectangular, color
      mode: SelectMode.ADD, // add, subtract, transform
      contiguous: true // sólo válido en el modo de color
    },
    selectionCanvas: null,
    selectionMaskImageData: null,
    dropper: {
      includeReferenceLayers: true
    },
    history: useHistory(),
    layers: useLayers({ Layer }),
    palette: []
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
      if (this.history.index >= 0) return this.history.list[this.history.index]
      return undefined
    },
    totalFrames() {
      if (!this.animation) return 0
      return this.animation.total
    },
    frames() {
      const frames = []
      for (let frame = 0; frame < this.totalFrames; frame++) {
        const frameCanvas = Canvas.createWithClasses(
          this.width,
          this.height,
          'preview-canvas'
        )
        const frameContext = frameCanvas.getContext('2d')
        for (const layer of this.layers.list) {
          if (!layer.visible) continue
          frameContext.clearRect(0, 0, frameCanvas.width, frameCanvas.height)
          frameContext.save()
          frameContext.globalAlpha = layer.opacity
          frameContext.globalCompositeOperation = layer.blendMode
          layer.context.putImageData(layer.frames[frame], 0, 0)
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
      return this.layer.frames[this.animation.current]
    }
  },
  actions: {
    toggleSymmetrySettings() {
      this.symmetrySettings = !this.symmetrySettings
    },
    toggleColorPicker() {
      this.colorPicker = !this.colorPicker
    },
    setPencilShape(shape) {
      this.pencil.shape = shape
    },
    setPencilSize(size) {
      this.pencil.size = size
    },
    setEraserShape(shape) {
      this.eraser.shape = shape
    },
    setEraserSize(size) {
      this.eraser.size = size
    },
    setSelectType(type) {
      this.select.type = type
    },
    setSelectMode(mode) {
      this.select.mode = mode
    },
    toggleSelectContiguous() {
      this.select.contiguous = !this.select.contiguous
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
      this.symmetrySettings = false
    },
    setSymmetryAxis(axis) {
      this.symmetry.axis = axis
    },
    setTool(tool) {
      // NOTA: no tengo muy claro si esto debería ser una acción de Ctrl+z
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
      const context = this.layer.canvas.getContext('2d')
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
    fillColor(color, x, y) {
      // FIXME: Esto tiene mala pinta, aquí hay algo que falla bastante.
      if (!this.fill.contiguous) {
        this.doLayerPaintOperation((imageData) =>
          ImageDataUtils.replaceColorAt(imageData, x, y, Color.toUint8(color))
        )
      } else {
        this.doLayerPaintOperation((imageData) =>
          this.doSymmetry2Operation(
            (imageData, x, y, color) =>
              ImageDataUtils.fill(imageData, x, y, Color.toUint8(color)),
            imageData,
            x,
            y,
            color
          )
        )
      }
    },
    getLayerPaintSignature(payload) {
      return window.btoa(JSON.stringify({ layer: this.layer.id, payload }))
    },
    doSymmetry2Operation(callback, imageData, x, y, color) {
      callback(imageData, x, y, color)
      if (this.symmetry.axis === null) {
        return
      }
      if (this.symmetry.axis === SymmetryAxis.HORIZONTAL) {
        callback(imageData, this.width - 1 - x, y, color)
      } else if (this.symmetry.axis === SymmetryAxis.VERTICAL) {
        callback(imageData, x, this.height - 1 - y, color)
      } else if (this.symmetry.axis === SymmetryAxis.BOTH) {
        callback(imageData, this.width - 1 - x, y, color)
        callback(imageData, x, this.height - 1 - y, color)
        callback(imageData, this.width - 1 - x, this.height - 1 - y, color)
      }
    },
    doSymmetry4Operation(callback, imageData, x1, y1, x2, y2, color) {
      callback(imageData, x1, y1, x2, y2, color)
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
          color
        )
      } else if (this.symmetry.axis === SymmetryAxis.VERTICAL) {
        callback(
          imageData,
          x1,
          this.height - 1 - y1,
          x2,
          this.height - 1 - y2,
          color
        )
      } else if (this.symmetry.axis === SymmetryAxis.BOTH) {
        callback(
          imageData,
          this.width - 1 - x1,
          y1,
          this.width - 1 - x2,
          y2,
          color
        )
        callback(
          imageData,
          x1,
          this.height - 1 - y1,
          x2,
          this.height - 1 - y2,
          color
        )
        callback(
          imageData,
          this.width - 1 - x1,
          this.height - 1 - y1,
          this.width - 1 - x2,
          this.height - 1 - y2,
          color
        )
      }
    },
    putColor(color, x, y) {
      this.doLayerPaintOperation((imageData) =>
        this.doSymmetry2Operation(
          (imageData, x, y, color) =>
            ImageDataUtils.putColor(imageData, x, y, Color.toUint8(color)),
          imageData,
          x,
          y,
          color
        )
      )
    },
    line(color, x1, y1, x2, y2, isTemp) {
      if (isTemp) {
        this.doTempPaintOperation((imageData) =>
          this.doSymmetry4Operation(
            (imageData, x1, y1, x2, y2, color) =>
              ImageDataUtils.line(
                imageData,
                x1,
                y1,
                x2,
                y2,
                Color.toUint8(color)
              ),
            imageData,
            x1,
            y1,
            x2,
            y2,
            color
          )
        )
      } else {
        this.doLayerPaintOperation((imageData) =>
          this.doSymmetry4Operation(
            (imageData, x1, y1, x2, y2, color) =>
              ImageDataUtils.line(
                imageData,
                x1,
                y1,
                x2,
                y2,
                Color.toUint8(color)
              ),
            imageData,
            x1,
            y1,
            x2,
            y2,
            color
          )
        )
      }
    },
    rectangle(color, x1, y1, x2, y2, isTemp) {
      if (this.shape.lockAspectRatio) {
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
            (imageData, x1, y1, x2, y2, color) =>
              ImageDataUtils.rect(
                imageData,
                x1,
                y1,
                x2,
                y2,
                Color.toUint8(color),
                this.shape.filled
              ),
            imageData,
            x1,
            y1,
            x2,
            y2,
            color
          )
        )
      } else {
        this.doLayerPaintOperation((imageData) =>
          this.doSymmetry4Operation(
            (imageData, x1, y1, x2, y2, color) =>
              ImageDataUtils.rect(
                imageData,
                x1,
                y1,
                x2,
                y2,
                Color.toUint8(color),
                this.shape.filled
              ),
            imageData,
            x1,
            y1,
            x2,
            y2,
            color
          )
        )
      }
    },
    ellipse(color, x1, y1, x2, y2, isTemp) {
      if (this.shape.lockAspectRatio) {
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
            (imageData, x1, y1, x2, y2, color) =>
              ImageDataUtils.ellipse(
                imageData,
                x1,
                y1,
                x2,
                y2,
                Color.toUint8(color),
                this.shape.filled
              ),
            imageData,
            x1,
            y1,
            x2,
            y2,
            color
          )
        )
      } else {
        this.doLayerPaintOperation((imageData) =>
          this.doSymmetry4Operation(
            (imageData, x1, y1, x2, y2, color) =>
              ImageDataUtils.ellipse(
                imageData,
                x1,
                y1,
                x2,
                y2,
                Color.toUint8(color),
                this.shape.filled
              ),
            imageData,
            x1,
            y1,
            x2,
            y2,
            color
          )
        )
      }
    },
    transformation(x, y) {
      this.doLayerPaintOperation((imageData) => {
        ImageDataUtils.translate(imageData, x, y, this.transform.mode)
      })
    },
    useTool(e) {
      // TODO: Todo este comportamiento es MUY mejorable, tengo que ver cómo
      // implementar todo esto de otra forma.
      if (e.ctrlKey || e.buttons === 4) {
        if (this.pointer.pressure > 0) {
          this.moveBy(e.movementX, e.movementY)
        }
        return
      }
      if (this.tool === Tool.PENCIL && this.pointer.pressure > 0) {
        if (e.type === 'pointerdown') {
          this.putColor(
            this.color,
            this.pointer.current.x,
            this.pointer.current.y
          )
        } else if (e.type === 'pointermove') {
          this.line(
            this.color,
            this.pointer.current.x,
            this.pointer.current.y,
            this.pointer.previous.x,
            this.pointer.previous.y
          )
        }
      } else if (this.tool === Tool.ERASER && this.pointer.pressure > 0) {
        if (e.type === 'pointerdown') {
          this.putColor(
            'rgba(0,0,0,0)',
            this.pointer.current.x,
            this.pointer.current.y
          )
        } else if (e.type === 'pointermove') {
          this.line(
            'rgba(0,0,0,0)',
            this.pointer.current.x,
            this.pointer.current.y,
            this.pointer.previous.x,
            this.pointer.previous.y
          )
        }
      } else if (this.tool === Tool.FILL && this.pointer.pressure > 0) {
        if (this.fill.type === FillType.ERASE) {
          this.fillColor(
            'rgba(0,0,0,0)',
            this.pointer.current.x,
            this.pointer.current.y
          )
        } else if (this.fill.type === FillType.FILL) {
          this.fillColor(
            this.color,
            this.pointer.current.x,
            this.pointer.current.y
          )
        }
      } else if (this.tool === Tool.SHAPE) {
        if (e.type === 'pointerdown') {
          this.saveCopyBuffer()
        }
        if (this.shape.type === ShapeType.LINE) {
          if (
            e.type === 'pointerdown' ||
            (e.type === 'pointermove' && this.pointer.pressure > 0)
          ) {
            this.line(
              this.color,
              this.pointer.start.x,
              this.pointer.start.y,
              this.pointer.current.x,
              this.pointer.current.y,
              'temp'
            )
          } else if (e.type === 'pointerup') {
            this.line(
              this.color,
              this.pointer.start.x,
              this.pointer.start.y,
              this.pointer.end.x,
              this.pointer.end.y
            )
          }
        } else if (this.shape.type === ShapeType.RECTANGLE) {
          if (
            e.type === 'pointerdown' ||
            (e.type === 'pointermove' && this.pointer.pressure > 0)
          ) {
            this.rectangle(
              this.color,
              this.pointer.start.x,
              this.pointer.start.y,
              this.pointer.current.x,
              this.pointer.current.y,
              'temp'
            )
          } else if (e.type === 'pointerup') {
            this.rectangle(
              this.color,
              this.pointer.start.x,
              this.pointer.start.y,
              this.pointer.end.x,
              this.pointer.end.y
            )
          }
        } else if (this.shape.type === ShapeType.ELLIPSE) {
          if (
            e.type === 'pointerdown' ||
            (e.type === 'pointermove' && this.pointer.pressure > 0)
          ) {
            this.ellipse(
              this.color,
              this.pointer.start.x,
              this.pointer.start.y,
              this.pointer.current.x,
              this.pointer.current.y,
              'temp'
            )
          } else if (e.type === 'pointerup') {
            this.ellipse(
              this.color,
              this.pointer.start.x,
              this.pointer.start.y,
              this.pointer.end.x,
              this.pointer.end.y
            )
          }
        }
      } else if (this.tool === Tool.DROPPER && this.pointer.pressure > 0) {
        this.eyeDropper(this.pointer.current.x, this.pointer.current.y)
      } else if (this.tool === Tool.TRANSFORM && this.pointer.pressure > 0) {
        // TODO: Esto es MUY mejorable.
        const x = this.pointer.relative.x
        const y = this.pointer.relative.y
        this.transformation(x, y)
      } else if (this.tool === Tool.SELECT && this.pointer.pressure > 0) {
        const x = this.pointer.current.x
        const y = this.pointer.current.y
        ImageDataUtils.putColor(
          this.selectionMaskImageData,
          x,
          y,
          Color.fromRGBA(1, 1, 1, 1)
        )
      }
    },
    /**
     * Copia lo que haya en el <canvas> principal
     * a un <canvas> secundario utilizado como "copia".
     */
    saveCopyBuffer() {
      Canvas.swap(this.copyCanvas, this.canvas)
      ImageDataUtils.copyFromCanvas(this.copyImageData, this.canvas)
    },
    /**
     * Dibuja lo que haya en el <canvas> "copia" en
     * el <canvas> principal.
     */
    restoreCopyBuffer() {
      Canvas.swap(this.canvas, this.copyCanvas)
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
        const context = canvas.getContext('2d')
        const drawingContext = drawingCanvas.getContext('2d')
        drawingContext.putImageData(drawingImageData, 0, 0)
        context.drawImage(drawingCanvas, 0, 0)
      })
    },
    redraw() {
      const context = this.canvas.getContext('2d')
      context.clearRect(0, 0, context.canvas.width, context.canvas.height)
      for (const layer of this.layers.list) {
        if (!layer.visible) continue
        context.save()
        context.globalAlpha = layer.opacity
        context.globalCompositeOperation = layer.blendMode
        layer.context.putImageData(
          layer.frames[this.animation.current],
          0,
          0
        )
        context.drawImage(layer.canvas, 0, 0)
        context.restore()
      }
    },
    redrawPreview() {
      const context = this.previewCanvas.getContext('2d')
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
        const context = frame.canvas.getContext('2d')
        for (const layer of this.layers.list) {
          if (!layer.visible) continue
          context.clearRect(0, 0, layer.canvas.width, layer.canvas.height)
          context.save()
          context.globalAlpha = layer.opacity
          context.globalCompositeOperation = layer.blendMode
          layer.context.putImageData(
            layer.frames[frame.frame],
            0,
            0
          )
          context.drawImage(layer.canvas, 0, 0)
          context.restore()
        }
      }
    },
    create(width, height, palette) {
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
      Vec2.set(this.symmetry.position, this.width >> 1, this.height >> 1)
      this.layers.add({
        name: 'Background',
        width,
        height
      })
      this.drawing = false
      // TODO: Esto habría que rehacerlo todo para que no utilice drawImage
      // si no putImageData.
      this.drawingCanvas = Canvas.create(this.width, this.height)
      this.drawingImageData = new ImageData(this.width, this.height)
      this.copyCanvas = Canvas.create(this.width, this.height)
      this.copyImageData = new ImageData(this.width, this.height)
      this.previewCanvas = Canvas.createWithClasses(
        this.width,
        this.height,
        'preview-canvas'
      )
      this.canvas = Canvas.createWithClasses(
        this.width,
        this.height,
        'pixel-canvas'
      )
      this.pointer = usePointer(this.canvas, this.useTool)
      this.pointer.startListening()
      this.animation = useAnimation({
        callback: () => this.redrawAll()
      })
      this.tool = Tool.PENCIL
    },
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
      layer.blendMode = blendMode
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
    center() {
      Vec2.set(this.position, 0, 0)
    },
    moveTo(x, y) {
      Vec2.set(this.position, x, y)
    },
    moveBy(x, y) {
      Vec2.add(this.position, this.position, [
        x / this.zoom.current,
        y / this.zoom.current
      ])
    },
    setColor(color) {
      this.history.add({
        type: 'setColor',
        payload: { color: color, previousColor: this.color }
      })
      this.color = color
    },
    async loadPalette() {
      const [fileHandle] = await window.showOpenFilePicker({
        types: PaletteTypes,
        excludeAcceptAllOption: true,
        multiple: false
      })
      if (fileHandle.kind === 'file')
      {
        const file = await fileHandle.getFile()
        if (/(.*)\.gpl$/i.test(file.name))
        {
          const palette = await GIMP.load(file)
          this.palette.splice(0, this.palette.length, ...palette)
        }
      }
      console.log(fileHandle)
    },
    async savePalette() {
      const fileHandle = await window.showSaveFilePicker({
        types: PaletteTypes,
        excludeAcceptAllOption: true,
        multiple: false
      })
      console.log(fileHandle)
      const writable = await fileHandle.createWritable()
      console.log(writable)
      await writable.write(await GIMP.save(this.palette))
      await writable.close()
    },
    addPaletteColor() {
      this.history.add({
        type: 'addPaletteColor',
        payload: { color: this.color }
      })
      this.palette.push(this.color)
    },
    removePaletteColor(index) {
      const [removedColor] = this.palette.splice(index, 1)
      console.log(removedColor)
    },
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
      for (const layer of this.layers.list) {
        if (!layer.isStatic) {
          const currentImageData = layer.frames[this.animation.current]
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
      for (const layer of this.layers) {
        if (!layer.isStatic) {
          const [removedFrame] = layer.frames.splice(
            this.animation.current,
            1
          )
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
    async exportAs() {
      const zip = await OpenRaster.save(this)
      const a = document.createElement('a')
      a.href = URL.createObjectURL(zip)
      a.download = 'test.ora'
      a.click()
    },
    undo() {
      const actionToUndo = this.history.undo()
      if (!actionToUndo) {
        return
      }
      switch (actionToUndo.type) {
        case 'addPaletteColor':
          this.palette.pop()
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
          this.palette.push(actionToRedo.payload.color)
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
