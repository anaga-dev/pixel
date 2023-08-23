/**
 *
 */
export class SelectionPath {
  #points = []

  get points() {
    return this.#points
  }

  clear() {
    this.#points.length = 0
    return this
  }

  push(x, y) {
    this.#points.push({ x, y })
    return this
  }

  pop() {
    return this.#points.pop()
  }

  rectangle(sx, sy, ex, ey) {
    if (this.#points.length > 4) {
      this.#points.length = 0
    }

    if (this.#points.length === 0) {
      this.#points.push(
        { x: sx, y: sy },
        { x: ex, y: sy },
        { x: ex, y: ey },
        { x: sx, y: ey }
      )
    } else {
      this.#points[0].x = sx
      this.#points[0].y = sy

      this.#points[1].x = ex
      this.#points[1].y = sy

      this.#points[2].x = ex
      this.#points[2].y = ey

      this.#points[3].x = sx
      this.#points[3].y = ey
    }
  }

  ellipse(sx, sy, ex, ey, points = 36) {
    const width = ex - sx
    const height = ey - sy

    const halfWidth = width / 2
    const halfHeight = height / 2

    const cx = sx + halfWidth
    const cy = sy + halfHeight

    if (this.#points.length > points) {
      this.#points.length = 0
    }

    if (this.#points.length === 0) {
      for (let index = 0; index < points; index++) {
        const angle = (index / (points - 1)) * Math.PI * 2
        this.#points.push({
          x: cx + Math.cos(angle) * halfWidth,
          y: cy + Math.sin(angle) * halfHeight
        })
      }
    } else {
      for (let index = 0; index < points; index++) {
        const angle = (index / (points - 1)) * Math.PI * 2
        this.#points[index].x = cx + Math.cos(angle) * halfWidth
        this.#points[index].y = cy + Math.sin(angle) * halfHeight
      }
    }
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
    path.closePath()
    return path
  }
}

export default SelectionPath
