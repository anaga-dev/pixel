import SelectionType from './SelectionType'
import SelectionMode from './SelectionMode'
import SelectionMask from './SelectionMask'
import SelectionPath from './SelectionPath'
import SelectionPattern from './SelectionPattern'

export class Selection {
  #pattern = new SelectionPattern()
  #path = new SelectionPath()
  #mask = null
  #type = SelectionType.FREEHAND
  #mode = SelectionMode.ADD
  #start = { x: 0, y: 0 }

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

  clear() {
    this.#path.clear()
    this.#mask.clear()
  }

  setup(width, height) {
    this.#mask = new SelectionMask(width, height)
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

  getPath2D(width, height) {
    return this.#path.getPath2D(width, height)
  }
}

export default Selection
