import Canvas from '@/pixel/canvas/Canvas'
import CanvasContext2D from '@/pixel/canvas/CanvasContext2D'
import ImageDataUtils from '@/pixel/imagedata/ImageDataUtils'
import SelectionMaskRasterizeMode from './SelectionMaskRasterizeMode'
import SelectionMode from './SelectionMode'

export class SelectionMask {
  #canvas = null
  #context = null
  #imageData = null

  /**
   * Creates a new SelectionMask
   *
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.#canvas = Canvas.createOffscreen(width, height)
    this.#context = CanvasContext2D.get(this.#canvas, {
      willReadFrequently: true
    })
  }

  /**
   * @type {OffscreenCanvas|HTMLCanvasElement}
   */
  get canvas() {
    return this.#canvas
  }

  /**
   * @type {CanvasRenderingContext2D}
   */
  get context() {
    return this.#context
  }

  /**
   * @type {ImageData}
   */
  get imageData() {
    return this.#imageData
  }

  /**
   * Clears the selection mask
   */
  clear() {
    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
    this.#imageData = null
  }

  /**
   * Selects the pixel at the given coordinates
   *
   * @param {number} x
   * @param {number} y
   * @param {ImageData} sourceImageData
   * @param {boolean} contiguous
   */
  selectAt(x, y, sourceImageData, contiguous = true) {
    if (this.#imageData === null) {
      this.#imageData = this.#context.getImageData(
        0,
        0,
        this.#canvas.width,
        this.#canvas.height
      )
    }
    if (contiguous) {
      return this.#context.putImageData(ImageDataUtils.copyContiguousSelectedAt(this.#imageData, sourceImageData, x, y, [0xFF, 0x00, 0x00, 0xFF]), 0, 0)
    }
    return this.#context.putImageData(ImageDataUtils.copySelectedAt(this.#imageData, sourceImageData, x, y, [0xFF, 0x00, 0x00, 0xFF]), 0, 0)
  }

  /**
   * Rasterizes the selection path
   *
   * @param {SelectionPath} selectionPath
   */
  rasterize(selectionPath, mode = SelectionMode.ADD, rasterizeMode = SelectionMaskRasterizeMode.CEIL) {
    if (mode === SelectionMode.ADD) {
      this.#context.globalCompositeOperation = 'source-over'
    } else if (mode === SelectionMode.SUBTRACT) {
      this.#context.globalCompositeOperation = 'destination-out'
    }
    this.#context.fillStyle = '#f00'
    this.#context.fill(
      selectionPath.getPath2D(this.#canvas.width, this.#canvas.height)
    )
    this.#imageData = this.#context.getImageData(
      0,
      0,
      this.#canvas.width,
      this.#canvas.height
    )
    if (rasterizeMode === SelectionMaskRasterizeMode.FLOOR) ImageDataUtils.alphaFloor(this.#imageData)
    else if (rasterizeMode === SelectionMaskRasterizeMode.CEIL) ImageDataUtils.alphaCeil(this.#imageData)
    else if (rasterizeMode === SelectionMaskRasterizeMode.ROUND) ImageDataUtils.alphaRound(this.#imageData)
    this.#context.putImageData(this.#imageData, 0, 0)
  }
}

export default SelectionMask
