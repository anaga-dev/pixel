/**
 *
 */
export default class IndexedImageData {
  #width = 0
  #height = 0
  #data = null

  /**
   * Create IndexedImageData from ImageData
   *
   * @param {ImageData} imageData
   * @returns {IndexedImageData}
   */
  static fromImageData(imageData) {
    return new IndexedImageData(imageData.width, imageData.height)
  }

  /**
   * Constructor
   *
   * @param {number} width
   * @param {number} height
   * @param {Uint8ClampedArray} [data]
   */
  constructor(width, height, data) {
    if (!Number.isFinite(width)) {
      throw new Error('Non finite width')
    }
    if (!Number.isFinite(height)) {
      throw new Error('Non finite height')
    }
    if (!Number.isInteger(width)) {
      throw new Error('Non integer width')
    }
    if (!Number.isInteger(height)) {
      throw new Error('Non integer height')
    }
    if (data && data.length !== width * height) {
      throw new Error('Data length is not equal to width by height')
    }
    this.#width = width
    this.#height = height
    this.#data = data ?? new Uint8ClampedArray(width * height)
  }

  get width() {
    return this.#width
  }

  get height() {
    return this.#height
  }

  get data() {
    return this.#data
  }

  getOffset(x, y) {
    if (!Number.isFinite(x) || !Number.isInteger(x)) {
      throw new Error('x is not finite or integer')
    }
    if (!Number.isFinite(y) || !Number.isInteger(y)) {
      throw new Error('x is not finite or integer')
    }
    return y * this.#width + x
  }

  isInside(x, y) {
    return x >= 0 && x <= this.#width - 1 && y >= 0 && y <= this.#height - 1
  }

  putColor(x, y, color) {
    const offset = this.getOffset(x, y)
    this.#data[offset] = color
    return this
  }

  getColor(x, y) {
    const offset = this.getOffset(x, y)
    return this.#data[offset]
  }

  clone() {
    return new IndexedImageData(this.#width, this.#height, this.#data.slice())
  }

  toString() {
    return `IndexedImageData(${this.#width}, ${this.#height})`
  }
}
