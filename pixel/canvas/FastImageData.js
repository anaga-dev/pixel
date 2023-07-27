export default class FastImageData {
  #imageData
  #data

  /**
   * Constructor
   *
   * @param {ImageData} imageData
   */
  constructor(imageData) {
    this.#imageData = imageData
    this.#data = new Uint32Array(this.#imageData.data.buffer)
  }

  get width() {
    return this.#imageData.width
  }

  get height() {
    return this.#imageData.height
  }

  get data() {
    return this.#data
  }

  getOffset(x, y) {
    return y * this.#imageData.width + x
  }

  putColor(x, y, color) {
    this.#data[this.getOffset(x, y)] = color
    return this
  }

  getColor(x, y) {
    return this.#data[this.getOffset(x, y)]
  }

  fill(sx, sy, ex, ey, color) {
    for (let y = sy; y < ey; y++) {
      const start = this.getOffset(sx, y)
      const end = this.getOffset(ex, y)
      this.#data.fill(color, start, end)
    }
  }
}
