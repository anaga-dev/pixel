/**
 *
 */
export class SelectionPath {
  #mode = 'points'
  #points = []
  #rect = [0, 0, 0, 0]

  /**
   * @type {Array<{x: number, y: number}>}
   */
  get points() {
    return this.#points
  }

  /**
   * Clears the list of points.
   *
   * @returns {this}
   */
  clear() {
    this.#mode = 'points'
    this.#points.length = 0
    return this
  }

  /**
   * Pushes a new point to the list of points.
   *
   * @param {number} x
   * @param {number} y
   * @returns {this}
   */
  push(x, y) {
    this.#mode = 'points'
    this.#points.push({ x, y })
    return this
  }

  /**
   * Pops the last point from the list of points.
   *
   * @returns {{x: number, y: number}|undefined}
   */
  pop() {
    return this.#points.pop()
  }

  /**
   *
   * @param {number} ax
   * @param {number} ay
   * @param {number} bx
   * @param {number} by
   */
  rectangle(ax, ay, bx, by) {
    if (this.#points.length > 0) {
      this.#points.length = 0
    }
    const sx = Math.min(ax, bx)
    const sy = Math.min(ay, by)
    const ex = Math.max(ax, bx)
    const ey = Math.max(ay, by)
    const x = sx
    const y = sy
    const width = ex - sx
    const height = ey - sy
    this.#mode = 'rectangle'
    this.#rect[0] = x
    this.#rect[1] = y
    this.#rect[2] = width
    this.#rect[3] = height
  }

  /**
   *
   * @param {number} ax
   * @param {number} ay
   * @param {number} bx
   * @param {number} by
   */
  ellipse(ax, ay, bx, by) {
    if (this.#points.length > 0) {
      this.#points.length = 0
    }
    const sx = Math.min(ax, bx)
    const sy = Math.min(ay, by)
    const ex = Math.max(ax, bx)
    const ey = Math.max(ay, by)
    const width = ex - sx
    const height = ey - sy
    const radiusX = width / 2
    const radiusY = height / 2
    const x = sx + radiusX
    const y = sy + radiusY
    this.#mode = 'ellipse'
    this.#rect[0] = x
    this.#rect[1] = y
    this.#rect[2] = radiusX
    this.#rect[3] = radiusY
  }

  /**
   * Obtiene un Path2D a partir de los puntos que hemos definido.
   *
   * @returns {Path2D}
   */
  getPath2D(width, height) {
    // Aquí convertimos el área del polígono en la máscara de selección
    // es decir, rasterizamos el path en píxeles.
    const path = new Path2D()
    switch (this.#mode) {
      case 'rectangle':
        path.rect(
          Math.floor(this.#rect[0] * width) + 0.5,
          Math.floor(this.#rect[1] * height) + 0.5,
          Math.floor(this.#rect[2] * width),
          Math.floor(this.#rect[3] * height)
        )
        break
      case 'ellipse':
        path.ellipse(
          Math.floor(this.#rect[0] * width) + 0.5,
          Math.floor(this.#rect[1] * height) + 0.5,
          Math.floor(this.#rect[2] * width),
          Math.floor(this.#rect[3] * height),
          0,
          0,
          Math.PI * 2
        )
        break
      default:
      case 'points':
        for (let index = 0; index < this.#points.length; index++) {
          const { x, y } = this.#points[index]
          const tx = x * width
          const ty = y * height
          if (index === 0) {
            path.moveTo(tx, ty)
          } else {
            path.lineTo(tx, ty)
          }
        }
        break
    }
    path.closePath()
    return path
  }
}

export default SelectionPath
