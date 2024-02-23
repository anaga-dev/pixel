import CanvasRenderingContext2D from './OffscreenCanvas/CanvasRenderingContext2D'

export class OffscreenCanvasMock {
  #width = 0
  #height = 0

  constructor(width, height) {
    this.#width = width
    this.#height = height
  }

  get width() {
    return this.#width
  }

  get height() {
    return this.#height
  }

  getContext(contextId, contextAttributes) {
    switch (contextId) {
      case '2d':
        return new CanvasRenderingContext2D(this, contextAttributes)
      case 'webgl':
      case 'webgl2':
      default:
        return null
    }
  }
}

export default OffscreenCanvasMock
