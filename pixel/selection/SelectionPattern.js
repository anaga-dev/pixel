import Canvas from '@/pixel/canvas/Canvas'
import CanvasContext2D from '@/pixel/canvas/CanvasContext2D'

const SIZE = 8
const SIZE_HALF = SIZE / 2

/**
 * Selection Pattern
 */
export class SelectionPattern {
  #canvas = null
  #context = null
  #matrix = null
  #pattern = null

  #backgroundColor = '#000'
  #foregroundColor = '#fff'

  /**
   * Creates a new instance of SelectionPattern
   *
   * @param {number} [size=SIZE]
   */
  constructor(size = SIZE) {
    this.#canvas = Canvas.createOffscreen(size, size)
    this.#context = CanvasContext2D.get(this.#canvas)
    this.#setup()
  }

  #render() {
    this.#context.fillStyle = this.#foregroundColor
    this.#context.fillRect(0, 0, SIZE, SIZE)
    this.#context.fillStyle = this.#backgroundColor
    this.#context.fillRect(0, 0, SIZE_HALF, SIZE_HALF)
    this.#context.fillRect(SIZE_HALF, SIZE_HALF, SIZE_HALF, SIZE_HALF)
  }

  #setupMatrix() {
    this.#matrix = new DOMMatrix()
  }

  #setupPattern() {
    this.#pattern = this.#context.createPattern(this.#canvas, 'repeat')
  }

  #setup() {
    this.#render()
    this.#setupMatrix()
    this.#setupPattern()
  }

  /**
   * Pattern transform matrix
   *
   * @type {DOMMatrix}
   */
  get matrix() {
    return this.#matrix
  }

  /**
   * Pattern
   *
   * @type {CanvasPattern}
   */
  get pattern() {
    return this.#pattern
  }

  /**
   * Updates the pattern transform.
   */
  update() {
    this.#pattern.setTransform(this.#matrix.translateSelf(0.25, 0.25))
  }
}

export default SelectionPattern
