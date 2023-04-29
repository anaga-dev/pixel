import IndexedImageData from './IndexedImageData'

function clamp(value, min, max) {
  if (value < min) return min
  if (value > max) return max
  return value
}

export function isInside(imageData, x, y) {
  return x >= 0 && x < imageData.width
      && y >= 0 && y < imageData.height
}

export function isOutside(imageData, x, y) {
  return !isInside(imageData, x, y)
}

export function getOffset(imageData, x, y) {
  return (Math.floor(clamp(y, 0, imageData.height - 1)) * imageData.width + Math.floor(clamp(x, 0, imageData.width - 1))) * 4
}

// TODO: Una forma más rápida de hacer esto sería pintando con un Uint32Array
export function putColor(imageData, x, y, [r, g, b, a]) {
  if (isOutside(imageData, x, y)) {
    return imageData
  }
  const offset = getOffset(imageData, x, y)
  imageData.data[offset + 0] = r
  imageData.data[offset + 1] = g
  imageData.data[offset + 2] = b
  imageData.data[offset + 3] = a
  return imageData
}

export function getColor(imageData, x, y) {
  const offset = getOffset(imageData, x, y)
  const r = imageData.data[offset + 0]
  const g = imageData.data[offset + 1]
  const b = imageData.data[offset + 2]
  const a = imageData.data[offset + 3]
  return [r, g, b, a]
}

export function replaceColor(imageData, [sr, sg, sb], [tr, tg, tb, ta]) {
  for (let offset = 0; offset < imageData.data.length; offset += 4) {
    const cr = imageData.data[offset + 0]
    const cg = imageData.data[offset + 1]
    const cb = imageData.data[offset + 2]
    if (sr === cr && sg === cg && sb === cb) {
      imageData.data[offset + 0] = tr
      imageData.data[offset + 1] = tg
      imageData.data[offset + 2] = tb
      imageData.data[offset + 3] = ta
    }
  }
  return imageData
}

export function replaceColorAt(imageData, x, y, [r, g, b, a]) {
  const [sr, sg, sb] = getColor(imageData, x, y)
  replaceColor(imageData, [sr, sg, sb], [r, g, b, a])
}

export function clear(imageData) {
  imageData.data.fill(0)
}

/**
 *
 * @param {*} target
 * @param {*} source
 * @param {*} x
 * @param {*} y
 * @param {*} callback
 */
export function paint(target, source, x, y, callback) {
  for (let sy = 0; sy < source.height; sy++) {
    const ty = sy + y
    if (ty < 0 || ty >= target.height) {
      continue
    }
    for (let sx = 0; sx < source.width; sx++) {
      const tx = sx + x
      if (tx < 0 || tx >= target.width) {
        continue
      }
      const sourceOffset = getOffset(source, sx, sy)
      const targetOffset = getOffset(target, tx, ty)
      callback(target.data, source.data, targetOffset, sourceOffset)
    }
  }
}

/**
 * Flood fill algorithm.
 *
 * @param {ImageData} imageData
 * @param {number} x
 * @param {number} y
 * @param {Color} color
 * @param {Array<Vec2>} directions
 * @returns
 */
export function fill(imageData, x, y, color, directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
  const [r, g, b, a] = color
  const [sr, sg, sb, sa] = getColor(imageData, x, y)
  // si estamos pintando sobre el mismo color que tenemos
  // seleccionado, pasamos.
  if (r == sr && g == sg && b == sb && a == sa) {
    return false
  }
  const visited = IndexedImageData.fromImageData(imageData)
  const next = [[x, y]]
  while (next.length > 0) {
    const [x, y] = next.pop()
    visited.putColor(x, y, 0xFF)
    const [cr, cg, cb] = getColor(imageData, x, y)
    // Si el color actual no coincide, entonces
    // continuamos.
    if (cr != sr || cg != sg || cb != sb) {
      continue
    }

    putColor(imageData, x, y, color)
    for (const [dx, dy] of directions) {
      const nx = x + dx
      const ny = y + dy
      if (visited.isInside(nx, ny) && visited.getColor(nx, ny) !== 0xFF) {
        next.push([nx, ny])
      }
    }
  }
}

/**
 *
 * @see https://github.com/aseprite/aseprite/blob/1eace2489125933f1975def6d5f3eea3344c4dc3/src/doc/algo.cpp
 * @param {ImageData} imageData
 * @param {number} px1
 * @param {number} py1
 * @param {number} px2
 * @param {number} py2
 * @param {Color} color
 */
export function line(imageData, px1, py1, px2, py2, color) {
  let x1 = px1,
    y1 = py1,
    x2 = px2,
    y2 = py2

  if (x1 === x2 && y1 === y2) {
    putColor(imageData, x1, y1, color)
    return
  }

  let yAxis = false
  // Si la altura de la línea es mayor que la anchura, iteraremos
  // sobre el eje Y.
  if (Math.abs(y2 - y1) > Math.abs(x2 - x1)) {
    x1 = py1
    y1 = px1
    x2 = py2
    y2 = px2
    yAxis = true
  }

  const w = Math.abs(x2 - x1) + 1
  const h = Math.abs(y2 - y1) + 1
  const dx = Math.sign(x2 - x1)
  const dy = Math.sign(y2 - y1)

  let e = 0
  let y = y1

  // Mueve x2 un pixel extra a la dirección dx para que podamos usar
  // operador!=() en lugar de operador<(). Aquí prefiero operator!=()
  // en lugar de intercambiar x1 con x2 para que el error siempre comience desde 0
  // en el origen (x1,y1).
  x2 += dx

  for (let x = x1; x !== x2; x += dx) {
    if (yAxis) putColor(imageData, y, x, color)
    else putColor(imageData, x, y, color)

    // El error avanza "h/w" por cada paso "x". Como estamos usando un
    // valor entero para "e", utilizamos "w" como unidad.
    e += h
    if (e >= w) {
      y += dy
      e -= w
    }
  }
}

export function fillRect(imageData, px1, py1, px2, py2, color) {
  const sx = Math.min(px1, px2)
  const ex = Math.max(px1, px2)
  const sy = Math.min(py1, py2)
  const ey = Math.max(py1, py2)
  for (let y = sy; y <= ey; y++) {
    for (let x = sx; x <= ex; x++) {
      putColor(imageData, x, y, color)
    }
  }
  return imageData
}

export function strokeRect(imageData, px1, py1, px2, py2, color) {
  line(imageData, px1, py1, px2, py1, color)
  line(imageData, px2, py1, px2, py2, color)
  line(imageData, px2, py2, px1, py2, color)
  line(imageData, px1, py2, px1, py1, color)
  return imageData
}

export function rect(imageData, px1, py1, px2, py2, color, filled = false) {
  if (filled) {
    return fillRect(imageData, px1, py1, px2, py2, color)
  }
  return strokeRect(imageData, px1, py1, px2, py2, color)
}

export function fillEllipse(imageData, px1, py1, px2, py2, color) {
  let a = Math.abs(px2 - px1),
    b = Math.abs(py2 - py1),
    b1 = b & 1 /* values of diameter */
  let dx = 4 * (1 - a) * b * b,
    dy = 4 * (b1 + 1) * a * a /* error increment */
  let err = dx + dy + b1 * a * a
  let e2 /* error of 1.step */

  if (px1 > px2) {
    px1 = px2
    px2 += a
  } /* if called with swapped points */
  if (py1 > py2) {
    py1 = py2 /* .. exchange them */
  }
  py1 += (b + 1) / 2
  py2 = py1 - b1 /* starting pixel */
  a *= 8 * a
  b1 = 8 * b * b

  do {
    for (let x = px1; x < px2; x++) {
      putColor(imageData, x, py1, color) /*   I. Quadrant */
      putColor(imageData, x, py2, color) /*   I. Quadrant */
    }
    e2 = 2 * err
    if (e2 <= dy) {
      py1++
      py2--
      err += dy += a
    } /* y step */
    if (e2 >= dx || 2 * err > dy) {
      px1++
      px2--
      err += dx += b1
    } /* x step */
  } while (px1 <= px2)

  while (py1 - py2 < b) {
    /* too early stop of flat ellipses a=1 */
    putColor(imageData, px1 - 1, py1, color) /* -> finish tip of ellipse */
    putColor(imageData, px2 + 1, py1++, color)
    putColor(imageData, px1 - 1, py2, color)
    putColor(imageData, px2 + 1, py2--, color)
  }
  return imageData
}

// @see https://github.com/aseprite/aseprite/blob/25fbe786f8353a2ddb57de3bcc5db00066cc9ca6/src/doc/algo.cpp
// @see http://members.chello.at/easyfilter/bresenham.html
export function strokeEllipse(imageData, px1, py1, px2, py2, color) {
  let a = Math.abs(px2-px1), b = Math.abs(py2-py1), b1 = b&1 /* values of diameter */
  let dx = 4*(1-a)*b*b, dy = 4*(b1+1)*a*a /* error increment */
  let err = dx+dy+b1*a*a
  let e2; /* error of 1.step */

  if (px1 > px2) {
    px1 = px2
    px2 += a
  } /* if called with swapped points */
  if (py1 > py2) {
    py1 = py2 /* .. exchange them */
  }
  py1 += (b+1)/2
  py2 = py1-b1   /* starting pixel */
  a *= 8*a
  b1 = 8*b*b

  do {
    putColor(imageData, px2, py1, color) /*   I. Quadrant */
    putColor(imageData, px1, py1, color) /*  II. Quadrant */
    putColor(imageData, px1, py2, color) /* III. Quadrant */
    putColor(imageData, px2, py2, color) /*  IV. Quadrant */
    e2 = 2*err
    if (e2 <= dy) {
      py1++
      py2--
      err += dy += a
    }  /* y step */
    if (e2 >= dx || 2*err > dy) {
      px1++
      px2--
      err += dx += b1
    } /* x step */
  } while (px1 <= px2)

  while (py1-py2 < b) {  /* too early stop of flat ellipses a=1 */
    putColor(imageData, px1-1, py1, color) /* -> finish tip of ellipse */
    putColor(imageData, px2+1, py1++, color)
    putColor(imageData, px1-1, py2, color)
    putColor(imageData, px2+1, py2--, color)
  }
  return imageData
}

export function ellipse(imageData, px1, py1, px2, py2, color, filled = false) {
  if (filled) {
    return fillEllipse(imageData, px1, py1, px2, py2, color)
  }
  return strokeEllipse(imageData, px1, py1, px2, py2, color)
}

/**
 *
 * @param {ImageData} a
 * @param {ImageData} b
 * @returns {boolean}
 */
export function equals(a, b) {
  if (a.data.length !== b.data.length) {
    return false
  }
  for (let i = 0; i < a.data.length; i++) {
    if (a.data[i] !== b.data[i]) {
      return false
    }
  }
  return true
}

/**
 * Clonamos un ImageData
 *
 * @param {ImageData} imageData
 * @returns {ImageData}
 */
export function clone(imageData) {
  return new ImageData(imageData.data.slice(), imageData.width, imageData.height)
}

export function copy(targetImageData, sourceImageData) {
  targetImageData.data.set(sourceImageData.data, 0)
}

export function copyFromCanvas(targetImageData, canvas) {
  const context = canvas.getContext('2d')
  const sourceImageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
  copy(targetImageData, sourceImageData)
}

export function copyToCanvas(targetImageData, canvas) {
  const context = canvas.getContext('2d')
  context.putImageData(targetImageData, 0, 0)
}

export function translate(imageData, tx, ty, mode) {
  let dx = tx, dy = ty
  if (!Number.isInteger(tx)) {
    dx = tx < 0 ? Math.ceil(tx) : Math.floor(tx)
  }
  if (!Number.isInteger(ty)) {
    dy = ty < 0 ? Math.ceil(ty) : Math.floor(tx)
  }
  const source = new Uint32Array(imageData.data.buffer)
  const target = new Uint32Array(imageData.data.slice().buffer)
  // Generamos el buffer desplazado.
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      let sy = (y - dy) % imageData.height
      if (sy < 0) {
        sy += imageData.height
      }
      let sx = (x - dx) % imageData.width
      if (sx < 0) {
        sx += imageData.width
      }
      const sourceOffset = sy * imageData.width + sx
      const targetOffset = y * imageData.width + x
      target[targetOffset] = source[sourceOffset]
    }
  }
  // Cuando terminamos, volcamos un buffer sobre el otro.
  source.set(target, 0)
}

export default {
  getOffset,
  putColor,
  getColor,
  replaceColor,
  replaceColorAt,
  line,
  strokeRect,
  fillRect,
  rect,
  strokeEllipse,
  fillEllipse,
  clear,
  paint,
  fill,
  ellipse,
  equals,
  copy,
  copyFromCanvas,
  copyToCanvas,
  clone,
  translate
}
