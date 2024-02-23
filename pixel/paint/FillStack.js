/**
 * FillStack
 */
export default class FillStack {
  #data = null
  #width = 0
  #height = 0
  #index = 0

  /**
   * Constructor
   *
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.#data = new Uint32Array(width * height * 4)
    this.#width = width
    this.#height = height
    this.#index = 0
  }

  /**
   * Returns if the stack is empty.
   *
   * @readonly
   * @type {boolean}
   */
  get isEmpty() {
    return this.#index === 0
  }

  /**
   * Returns if the stack is full.
   *
   * @readonly
   * @type {boolean}
   */
  get isFull() {
    return this.#index === this.#data.length / 4
  }

  /**
   * Pushes the given coordinates to the stack.
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  push(x, y) {
    if (x < 0 || y < 0 || x >= this.#width || y >= this.#height) {
      throw new Error('Invalid coordinates')
    }
    const offset = (y * this.#width + x) * 4
    const dataOffset = this.#index * 4
    this.#data[dataOffset + 0] = x
    this.#data[dataOffset + 1] = y
    this.#data[dataOffset + 2] = offset
    this.#index++
    return this.#index
  }

  /**
   * Retrieves the last pushed coordinates (and the calculated offset)
   *
   * @returns {[number, number, number]}
   */
  pop() {
    if (this.#index < 0) {
      throw new Error('FillStack is empty')
    }
    this.#index--
    const dataOffset = this.#index * 4
    return [
      this.#data[dataOffset + 0],
      this.#data[dataOffset + 1],
      this.#data[dataOffset + 2]
    ]
  }
}
