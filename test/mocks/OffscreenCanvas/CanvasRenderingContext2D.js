import ImageDataMock from '../ImageData'

export class CanvasRenderingContext2DMock {
  #canvas = null
  #attributes = null

  #fillStyle = '#000'
  #strokeStyle = '#000'

  constructor(canvas, attributes) {
    this.#canvas = canvas
    this.#attributes = attributes
  }

  get canvas() {
    return this.#canvas
  }

  set fillStyle(newFillStyle) {
    this.#fillStyle = newFillStyle
  }

  get fillStyle() {
    return this.#fillStyle
  }

  set strokeStyle(newStrokeStyle) {
    this.#strokeStyle = newStrokeStyle
  }

  get strokeStyle() {
    return this.#strokeStyle
  }

  arc() {}
  arcTo() {}
  beginPath() {}
  bezierCurveTo() {}
  clearRect() {}
  clip() {}
  closePath() {}
  createConicGradient() {}
  createImageData() {}
  createLinearGradient() {}
  createPattern() {}
  createRadialGradient() {}
  drawFocusIfNeeded() {}
  drawImage() {}
  ellipse() {}
  fill() {}
  fillRect() {}
  fillText() {}
  getContextAttributes() {}
  getImageData(sx, sy, sw, sh) {
    return new ImageDataMock(sw, sh)
  }
  getLineDash() {}
  getTransform() {}
  isPointInPath() {}
  isPointInStroke() {}
  lineTo() {}
  measureText() {}
  moveTo() {}
  putImageData() {}
  quadraticCurveTo() {}
  rect() {}
  reset() {}
  resetTransform() {}
  restore() {}
  rotate() {}
  roundRect() {}
  save() {}
  scale() {}
  setLineDash() {}
  setTransform() {}
  stroke() {}
  strokeRect() {}
  strokeText() {}
  transform() {}
  translate() {}
}

export default CanvasRenderingContext2DMock
