import { isSize } from '@/pixel/validation/isSize.js'
import { getOffset, isInside } from '@/pixel/math/Array.js'

/**
 *
 */
export class FastImageData {
  /**
   * @type {ImageData}
   */
  #imageData = null

  /**
   * @type {Uint32Array}
   */
  #data = null

  /**
   * Constructor
   *
   * @param {ImageData} imageData
   */
  constructor(imageData) {
    this.#imageData = imageData
    this.#data = new Uint32Array(imageData.data.buffer)
  }

  /**
   * Horizontal size
   *
   * @type {number}
   */
  get width() {
    return this.#imageData.width
  }

  /**
   * Vertical size
   *
   * @type {number}
   */
  get height() {
    return this.#imageData.height
  }

  /**
   * Image data
   *
   * @type {Uint32Array}
   */
  get data() {
    return this.#data
  }

  /**
   * Image data
   *
   * @type {ImageData}
   */
  get imageData() {
    return this.#imageData
  }

  /**
   * Clears the image data.
   *
   * @param {number} color
   * @returns {FastImageData}
   */
  clear(color = 0) {
    this.#data.fill(color)
    return this
  }

  /**
   * Returns the color of the specified
   * coordinates
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  get(x, y) {
    const offset = getOffset(x, y, this.width, this.height)
    return this.#data[offset]
  }

  /**
   * Puts a color at the specified
   * coordinates.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} color
   * @returns {FastImageData}
   */
  put(x, y, color) {
    const offset = getOffset(x, y, this.width, this.height)
    this.#data[offset] = color
    return this
  }

  /**
   * Disposes all references
   */
  dispose() {
    this.#imageData = null
    this.#data = null
  }
}

export default FastImageData
