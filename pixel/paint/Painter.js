import IndexedImageData from './IndexedImageData'
import FastImageData from './FastImageData'
import FillStack from './FillStack'
import Dither from './Dither'

export default class Painter {
  #imageData = null
  #maskImageData = null
  #fastImageData = null
  #dither = new Dither()

  /**
   * Constructor
   *
   * @param {ImageData} initialImageData
   */
  constructor(initialImageData = null) {
    if (initialImageData) {
      // IMPORTANT! This is calling the `imageData`
      // setter method, not the property directly.
      this.imageData = initialImageData
    }
  }

  /**
   * Image data
   *
   * @type {ImageData}
   */
  set imageData(imageData) {
    if (!(imageData instanceof ImageData)) {
      throw new Error('Invalid image data')
    }
    this.#imageData = imageData
    if (this.#fastImageData) {
      this.#fastImageData.dispose()
    }
    this.#fastImageData = new FastImageData(imageData)
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
   * Dithering
   *
   * @type {Dither}
   */
  get dither() {
    return this.#dither
  }

  /**
   * Returns if the specified x is valid and inside the image data.
   *
   * @param {number} x
   * @returns {boolean}
   */
  #isValidX(x) {
    return Number.isInteger(x) && x >= 0 && x < this.#imageData.width
  }

  /**
   * Returns if the specified y is valid and inside the image data.
   *
   * @param {number} y
   * @returns {boolean}
   */
  #isValidY(y) {
    return Number.isInteger(y) && y >= 0 && y < this.#imageData.height
  }

  /**
   * Returns if the specified coordinates are valid and inside the image data.
   *
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  #areValidCoordinates(x, y) {
    return this.#isValidX(x) && this.#isValidY(y)
  }

  /**
   * Returns if the specified `ImageData` is compatible with this `ImageData`.
   *
   * To be compatible, an ImageData must have the same width and height.
   *
   * @param {ImageData} imageData
   * @returns {boolean}
   */
  #isValidImageData(imageData) {
    return imageData instanceof ImageData
        && imageData.width === this.#imageData.width
        && imageData.height === this.#imageData.height
  }

  /**
   * Returns the offset of the specified coordinates.
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  #getFastOffset(x, y) {
    if (!this.#areValidCoordinates(x, y)) {
      throw new Error('The x coordinate must be a finite integer number')
    }
    return (y * this.#imageData.width + x)
  }

  /**
   * Returns the offset of the specified coordinates (slower).
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  #getSlowOffset(x, y) {
    return this.#getFastOffset(x, y) * 4
  }

  /**
   * Returns if the specified coordinates are inside the image data.
   *
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  isInside(x, y) {
    return x >= 0
        && x < this.#imageData.width
        && y >= 0
        && y < this.#imageData.height
  }

  /**
   * Returns if the specified coordinates are outside the image data.
   *
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  isOutside(x, y) {
    return !this.isInside(x, y)
  }

  /**
   * Returns if this ImageData is equal to the specified ImageData.
   *
   * @param {ImageData} imageData
   * @returns {boolean}
   */
  isEqualTo(imageData) {
    if (!this.#isValidImageData(imageData)) {
      return false
    }
    const fastImageData = new Uint32Array(imageData.data.buffer)
    for (let offset = 0; offset < this.#fastImageData.length; offset++) {
      if (this.#fastImageData[offset] !== fastImageData[offset]) {
        return false
      }
    }
    return true
  }

  /**
   * Clears the color of the image data.
   *
   * @returns {Painter}
   */
  clearColor(color) {
    this.#fastImageData.clear(color)
    return this
  }

  /**
   * Returns the color of the specified coordinates.
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  getColor(x, y) {
    return this.#fastImageData.get(x, y)
  }

  /**
   * Puts the specified color in the specified coordinates.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} color
   * @returns {Painter}
   */
  putColor(x, y, color) {
    const offset = this.#getFastOffset(x, y)
    if (this.#dither
     && this.#dither.level > 0
     && !this.#dither.shouldPaint(x, y)) {
      return this
    }
    if (this.#maskImageData) {
      const mask = this.#maskImageData[offset]
      if (mask !== 0xff) {
        return this
      }
    }
    this.#fastImageData[offset] = color
    return this
  }

  /**
   * Replaces the specified color with the new color.
   *
   * @param {number} fromColor
   * @param {number} toColor
   * @returns {Painter}
   */
  replaceColor(fromColor, toColor) {
    for (let offset = 0; offset < this.#fastImageData.length; offset ++) {
      if (this.#maskImageData && this.#maskImageData[offset] !== 0xff) {
        continue
      }
      const current = this.#fastImageData[offset]
      if (current === fromColor) {
        this.#fastImageData[offset] = toColor
      }
    }
    return this
  }

  /**
   * Replaces the color in the specified coordinates with the new color.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} toColor
   * @returns {Painter}
   */
  replaceColorAt(x, y, toColor) {
    const offset = this.#getFastOffset(x, y)
    if (this.#maskImageData && this.#maskImageData[offset] !== 0xff) {
      return this
    }
    const fromColor = this.#fastImageData[offset]
    return this.replaceColor(fromColor, toColor)
  }

  /**
   * Copies the selected color into ImageData
   *
   * @param {ImageData} imageData
   * @param {number} color
   * @param {number} maskColor
   * @returns {Painter}
   */
  copyColor(imageData, color, maskColor = null) {
    if (!this.#isValidImageData(imageData)) {
      throw new Error('Invalid image data')
    }
    const fastImageData = new Uint32Array(imageData.data.buffer)
    for (let offset = 0; offset < this.#fastImageData.length; offset++) {
      if (this.#fastImageData[offset] === color) {
        if (maskColor) {
          fastImageData[offset] = maskColor
        } else {
          fastImageData[offset] = color
        }
      }
    }
    return this
  }

  /**
   * Copies the selected color at the specified coordinates.
   *
   * @param {ImageData} imageData
   * @param {number} x
   * @param {number} y
   * @param {number} maskColor
   * @returns {Painter}
   */
  copyColorAt(imageData, x, y, maskColor = null) {
    const color = this.getColor(sourceImageData, x, y)
    return this.copySelected(imageData, color, maskColor)
  }

  /**
   * Copy contiguous color into ImageData
   *
   * @param {ImageData} imageData
   * @param {number} x
   * @param {number} y
   * @param {number} [maskColor=null]
   * @param {Array<[number, number]>} [directions=[[-1,0],[1,0],[0,-1],[0,1]]]
   * @returns {Painter}
   */
  copyContiguousColorAt(imageData, x, y, maskColor = null, directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ]) {
    const fastImageData = new Uint32Array(imageData.data.buffer)
    const color = this.getColor(x, y)
    const visited = IndexedImageData.fromImageData(this.#imageData)
    const fillStack = new FillStack(
      this.#imageData.width,
      this.#imageData.height
    )
    fillStack.push(x, y)
    while (!fillStack.isEmpty) {
      const [x, y, offset] = fillStack.pop()
      visited.putColor(x, y, 0xff)
      const currentColor = this.#fastImageData[offset]
      if (maskColor) {
        fastImageData[offset] = maskColor
      } else {
        fastImageData[offset] = currentColor
      }
      for (const [dx, dy] of directions) {
        const nextColor = this.getColor(x + dx, y + dy)
        if (nextColor !== color) {
          continue
        }
        const nx = x + dx
        const ny = y + dy
        if (visited.isInside(nx, ny) && visited.getColor(nx, ny) !== 0xff) {
          fillStack.push(x + dx, y + dy)
        }
      }
    }
    return this
  }

  /**
   * Copies the content of an ImageData into this ImageData.
   *
   * @param {ImageData} imageData
   * @returns {Painter}
   */
  copyFromImageData(imageData) {
    const fastImageData = new Uint32Array(imageData.data.buffer)
    this.#fastImageData.set(fastImageData, 0)
    return this
  }

  /**
   * Copies the content of this ImageData into an ImageData.
   *
   * @param {ImageData} imageData
   * @returns {Painter}
   */
  copyToImageData(imageData) {
    const fastImageData = new Uint32Array(imageData.data.buffer)
    fastImageData.set(this.#fastImageData, 0)
    return this
  }

  /**
   * Copies the content of a canvas into this ImageData.
   *
   * @param {HTMLCanvasElement|OffscreenCanvas} canvas
   * @returns {Painter}
   */
  copyFromCanvas(canvas) {
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Invalid canvas')
    }
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    this.copy(imageData)
    return this
  }

  /**
   * Copies the content of this ImageData into a canvas.
   *
   * @param {HTMLCanvasElement|OffscreenCanvas} canvas
   * @returns {Painter}
   */
  copyToCanvas(canvas) {
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Invalid canvas')
    }
    context.putImageData(this.#imageData, 0, 0)
    return this
  }

  /**
   * Fills a rectangle with the specified color from the
   * specified coordinates.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} color
   * @returns {Painter}
   */
  fillRect(x, y, width, height, color) {
    for (let dx = x; dx < x + width; dx ++) {
      for (let dy = y; dy < y + height; dy ++) {
        this.putColor(dx, dy, color)
      }
    }
    return this
  }

  /**
   * Strokes a rectangle with the specified color from the
   * specified coordinates.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} color
   * @returns {Painter}
   */
  strokeRect(x, y, width, height, color) {
    for (let dx = x; dx < x + width; dx ++) {
      this.putColor(dx, y, color)
      this.putColor(dx, y + height - 1, color)
    }
    for (let dy = y; dy < y + height; dy ++) {
      this.putColor(x, dy, color)
      this.putColor(x + width - 1, dy, color)
    }
    return this
  }

  /**
   * Draws a rectangle with the specified color from the
   * specified coordinates.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} color
   * @param {RectOptions} options
   * @returns {Painter}
   */
  rect(x, y, width, height, color, options) {
    if (options?.filled) {
      return this.fillRect(x, y, width, height, color)
    }
    return this.strokeRect(x, y, width, height, color)
  }

  /**
   * Fills the image data with the specified color from the
   * specified coordinates.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} color
   * @param {Array<[number,number]>} directions
   * @returns {Painter}
   */
  floodFill(x, y, color, directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ]) {
    const VISITED_COLOR = 0xff
    const fromColor = this.getColor(x, y)
    if (fromColor === color) {
      return this
    }
    const visited = IndexedImageData.fromImageData(this.#imageData)
    const fillStack = new FillStack(this.#imageData.width, this.#imageData.height)
    fillStack.push(x, y)

    while (!fillStack.isEmpty) {
      const [x, y] = fillStack.pop()
      visited.putColor(x, y, VISITED_COLOR)

      if (this.#maskImageData) {
        const offset = this.#getFastOffset(x, y)
        if (this.#maskImageData[offset] !== 0xff) {
          continue
        }
      }

      const currentColor = this.getColor(x, y)
      if (currentColor !== fromColor) {
        continue
      }

      this.putColor(x, y, color)
      for (const [dx, dy] of directions) {
        const nx = x + dx
        const ny = y + dy

        if (this.#maskImageData) {
          const offset = this.#getFastOffset(nx, ny)
          if (this.#maskImageData[offset] !== 0xff) {
            continue
          }
        }

        if (
          !visited.isInside(nx, ny) ||
          visited.getColor(nx, ny) === VISITED_COLOR
        ) {
          continue
        }
        fillStack.push(nx, ny)
      }
    }
    return this
  }
}
