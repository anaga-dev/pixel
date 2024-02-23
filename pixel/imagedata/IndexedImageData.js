/**
 *
 */
export default class IndexedImageData {
  #width = 0
  #height = 0
  #data = null

  /**
   * Creates an IndexedImageData from an ImageData
   *
   * @param {ImageData} imageData
   * @returns {IndexedImageData}
   */
  static fromImageData(imageData) {
    return new IndexedImageData(imageData.width, imageData.height)
  }

  /**
   * Constructor
   */
  constructor(...args) {
    if (args.length === 2) {
      return this.#constructFromSize(...args)
    } else if (args.length === 3) {
      return this.#constructFromData(...args)
    }
  }

  /**
   * Checks if the specified size is valid.
   *
   * @param {number} size
   * @returns {boolean}
   */
  #isValidSize(size) {
    return Number.isInteger(size) && size > 0
  }

  /**
   * Checks if the specified data, width and height are valid.
   *
   * @param {Uint8ClampedArray} data
   * @param {number} width
   * @param {number} height
   * @returns {boolean}
   */
  #isValidData(data, width, height) {
    return data instanceof Uint8ClampedArray
        && data.length > 0
        && data.length === width * height
  }

  /**
   * Constructs an IndexedImageData from the specified size.
   *
   * @param {number} width
   * @param {number} height
   */
  #constructFromSize(width, height) {
    if (!this.#isValidSize(width)) {
      throw new Error('Invalid width')
    }
    if (!this.#isValidSize(height)) {
      throw new Error('Invalid height')
    }
    this.#width = width
    this.#height = height
    this.#data = new Uint8ClampedArray(width * height)
  }

  /**
   * Constructs an IndexedImageData from the specified data.
   *
   * @param {Uint8ClampedArray} data
   * @param {number} width
   * @param {number} height
   */
  #constructFromData(data, width, height) {
    if (!this.#isValidSize(width)) {
      throw new Error('Invalid width')
    }
    if (!this.#isValidSize(height)) {
      throw new Error('Invalid height')
    }
    if (!this.#isValidData(data, width, height)) {
      throw new Error('Invalid data')
    }
    this.#width = width
    this.#height = height
    this.#data = data
  }

  /**
   * Horizontal dimension
   *
   * @type {number}
   */
  get width() {
    return this.#width
  }

  /**
   * Vertical dimension
   *
   * @type {number}
   */
  get height() {
    return this.#height
  }

  /**
   * Data
   *
   * @type {Uint8ClampedArray}
   */
  get data() {
    return this.#data
  }

  /**
   * Returns the offset of the specified coordinates.
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  #getOffset(x, y) {
    if (!Number.isFinite(x) || !Number.isInteger(x)) {
      throw new Error('x is not finite or integer')
    }
    if (!Number.isFinite(y) || !Number.isInteger(y)) {
      throw new Error('x is not finite or integer')
    }
    return y * this.#width + x
  }

  /**
   * Returns if the specified coordinates are inside this
   * IndexedImageData.
   *
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  isInside(x, y) {
    return x >= 0 && x <= this.#width - 1 && y >= 0 && y <= this.#height - 1
  }

  /**
   * Puts color at the specified coordinates.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} color
   * @returns {IndexedImageData}
   */
  putColor(x, y, color) {
    const offset = this.#getOffset(x, y)
    this.#data[offset] = color
    return this
  }

  /**
   * Returns the value of the pixel at the specified coordinates.
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  getColor(x, y) {
    const offset = this.#getOffset(x, y)
    return this.#data[offset]
  }

  /**
   * Clones this IndexedImageData.
   *
   * @returns {IndexedImageData}
   */
  clone() {
    return new IndexedImageData(this.#width, this.#height, this.#data.slice())
  }

  /**
   * Returns a string representation of this IndexedImageData.
   *
   * @returns {string}
   */
  toString() {
    return `IndexedImageData(${this.#width}, ${this.#height})`
  }

  /**
   * Returns a string representation of this IndexedImageData.
   *
   * @returns {string}
   */
  [Symbol.toStringTag]() {
    return `IndexedImageData(${this.#width}, ${this.#height})`
  }
}
