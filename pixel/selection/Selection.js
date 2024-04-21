import SelectionType from './SelectionType.js'
import SelectionMode from './SelectionMode.js'
import SelectionMask from './SelectionMask.js'
import SelectionPath from './SelectionPath.js'
import SelectionPattern from './SelectionPattern.js'
import Canvas from '@/pixel/canvas/Canvas.js'
import CanvasContext2D from '@/pixel/canvas/CanvasContext2D.js'
import { resizeTo } from '@/pixel/canvas/Canvas.js'

export class Selection {
  #pattern = new SelectionPattern()
  #path = new SelectionPath()
  #mask = null
  #type = SelectionType.FREEHAND
  #mode = SelectionMode.ADD
  #start = { x: 0, y: 0 }
  #canvas = null
  #context = null

  get pattern() {
    return this.#pattern
  }

  get path() {
    return this.#path
  }

  get mask() {
    return this.#mask
  }

  get type() {
    return this.#type
  }

  set type(value) {
    this.#type = value
  }

  get mode() {
    return this.#mode
  }

  set mode(value) {
    this.#mode = value
  }

  get canvas() {
    return this.#canvas
  }

  get context() {
    return this.#context
  }

  clear() {
    this.#path.clear()
    this.#mask.clear()
  }

  setup(width, height) {
    this.#mask = new SelectionMask(width, height)
    this.#context = CanvasContext2D.createOffscreen(width, height, '2d')
    this.#canvas = this.#context.canvas
    console.log(this.#canvas, this.#context)
  }

  render(width, height) {
    this.#pattern.update()

    const canvas = this.#canvas
    resizeTo(canvas, width, height)
    const context = this.#context
    if (context.imageSmoothingEnabled) {
      context.imageSmoothingEnabled = false
    }

    context.clearRect(0, 0, canvas.width, canvas.height)

    const maskCanvas = this.#mask.canvas

    // with this we can visualize the mask that
    // we are generating from the selection
    if (maskCanvas) {
      // This draws the figure four times with a pixel
      // difference to be able to draw the "ant trail".
      // TODO: Maybe we could cache this drawing.
      context.drawImage(maskCanvas, -1, -1, context.canvas.width, context.canvas.height)
      context.drawImage(maskCanvas, 1, -1, context.canvas.width, context.canvas.height)
      context.drawImage(maskCanvas, 1, 1, context.canvas.width, context.canvas.height)
      context.drawImage(maskCanvas, -1, 1, context.canvas.width, context.canvas.height)
      // This is the part responsible for drawing
      // the outline of our selection.
      context.globalCompositeOperation = 'destination-out'
      context.drawImage(maskCanvas, 0, 0, context.canvas.width, context.canvas.height)
      context.globalCompositeOperation = 'source-in'
      context.fillStyle = this.#pattern.pattern
      context.fillRect(0, 0, context.canvas.width, context.canvas.height)
      context.globalCompositeOperation = 'source-over'
    }

    // This draws the outline of the selection.
    context.strokeStyle = this.#pattern.pattern
    context.stroke(
      this.#path.getPath2D(context.canvas.width, context.canvas.height)
    )
  }

  start(x, y) {
    this.#start.x = x
    this.#start.y = y
    this.#path.clear()
    if (this.#type === SelectionType.FREEHAND) {
      this.#path.push(x, y)
    } else if (this.#type === SelectionType.RECTANGLE) {
      this.#path.rectangle(this.#start.x, this.#start.y, x, y)
    } else if (this.#type === SelectionType.ELLIPSE) {
      this.#path.ellipse(this.#start.x, this.#start.y, x, y)
    }
  }

  update(x, y) {
    if (this.#type === SelectionType.FREEHAND) {
      this.#path.push(x, y)
    } else if (this.#type === SelectionType.RECTANGLE) {
      this.#path.rectangle(this.#start.x, this.#start.y, x, y)
    } else if (this.#type === SelectionType.ELLIPSE) {
      this.#path.ellipse(this.#start.x, this.#start.y, x, y)
    }
  }

  end(x, y) {
    if (this.#type === SelectionType.FREEHAND) {
      this.#path.push(x, y)
    } else if (this.#type === SelectionType.RECTANGLE) {
      this.#path.rectangle(this.#start.x, this.#start.y, x, y)
    } else if (this.#type === SelectionType.ELLIPSE) {
      this.#path.ellipse(this.#start.x, this.#start.y, x, y)
    }
    this.#mask.rasterize(this.#path, this.#mode)
    this.#path.clear()
  }
}

export default Selection
