import IndexedImageData from './IndexedImageData'
import CanvasContext2D from './CanvasContext2D'
import FillStack from './FillStack'

/**
 * Returns true if the given coordinates are inside the image data.
 *
 * @param {ImageData} imageData
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
export function isInside(imageData, x, y) {
  return x >= 0 && x < imageData.width
      && y >= 0 && y < imageData.height
}

/**
 * Returns true if the given coordinates are outside the image data.
 *
 * @param {ImageData} imageData
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
export function isOutside(imageData, x, y) {
  return !isInside(imageData, x, y)
}

/**
 * Returns the offset of the given coordinates.
 *
 * @param {ImageData} imageData
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
export function getOffset(imageData, x, y) {
  if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) {
    return null
  }
  return (Math.floor(y) * imageData.width + Math.floor(x)) * 4
}

/**
 * Puts a color in the specified coordinates.
 *
 * @param {ImageData} imageData
 * @param {number} x
 * @param {number} y
 * @param {Color} color
 * @param {Dither} [dither]
 * @returns {ImageData}
 */
export function putColor(imageData, x, y, [r, g, b, a], dither = null) {
  if (isOutside(imageData, x, y)) {
    return imageData
  }
  const offset = getOffset(imageData, x, y)
  if (offset === null) {
    return imageData
  }
  if (dither && dither.level > 0) {
    if (!dither.shouldPaint(x, y)) {
      return imageData
    }
  }
  imageData.data[offset + 0] = r
  imageData.data[offset + 1] = g
  imageData.data[offset + 2] = b
  imageData.data[offset + 3] = a
  return imageData
}

/**
 * Returns the color of the given coordinates.
 *
 * @param {ImageData} imageData
 * @param {number} x
 * @param {number} y
 * @returns {Color}
 */
export function getColor(imageData, x, y) {
  const offset = getOffset(imageData, x, y)
  if (offset === null) {
    return [0, 0, 0, 1]
  }
  const r = imageData.data[offset + 0]
  const g = imageData.data[offset + 1]
  const b = imageData.data[offset + 2]
  const a = imageData.data[offset + 3]
  return [r, g, b, a]
}

/**
 * Replace the color in the image data.
 *
 * @param {ImageData} imageData
 * @param {Color} colorToReplace
 * @param {Color} colorUsed
 * @returns {ImageData}
 */
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

/**
 * Replaces the color at the given coordinates.
 *
 * @param {ImageData} imageData
 * @param {number} x
 * @param {number} y
 * @param {Color} colorUsed
 * @returns {ImageData}
 */
export function replaceColorAt(imageData, x, y, [r, g, b, a]) {
  const [sr, sg, sb] = getColor(imageData, x, y)
  replaceColor(imageData, [sr, sg, sb], [r, g, b, a])
}

/**
 * Clears image data.
 *
 * @param {ImageData} imageData
 * @returns {ImageData}
 */
export function clear(imageData) {
  imageData.data.fill(0)
  return imageData
}

/**
 * Realiza cualquier operación de pintado desde el origen al destino.
 * El callback debe recibir los siguientes parámetros:
 * - targetData: Uint8ClampedArray
 * - sourceData: Uint8ClampedArray
 * - targetOffset: number
 * - sourceOffset: number
 *
 * @param {ImageData} target
 * @param {ImageData} source
 * @param {number} x
 * @param {number} y
 * @param {Function} callback
 * @returns {ImageData}
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
  return target
}

/**
 * Flood fill algorithm.
 *
 * @param {ImageData} imageData
 * @param {number} x
 * @param {number} y
 * @param {Color} color
 * @param {Dither} [dither]
 * @param {Array<Vec2>} [directions]
 * @returns
 */
export function fill(imageData, x, y, color, dither, directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
  debugger
  const VISITED_COLOR = 0xFF
  const [r, g, b, a] = color
  const [sr, sg, sb, sa] = getColor(imageData, x, y)
  // si estamos pintando sobre el mismo color que tenemos
  // seleccionado, pasamos.
  if (r == sr && g == sg && b == sb && a == sa) {
    return false
  }
  const visited = IndexedImageData.fromImageData(imageData)
  const fillStack = new FillStack(imageData.width, imageData.height)
  fillStack.push(x, y)
  while (!fillStack.isEmpty) {
    const [x, y] = fillStack.pop()
    visited.putColor(x, y, VISITED_COLOR)
    const [cr, cg, cb, ca] = getColor(imageData, x, y)
    // Si el color actual no coincide, entonces
    // continuamos.
    if (cr != sr || cg != sg || cb != sb || ca != sa) {
      continue
    }

    putColor(imageData, x, y, color, dither)
    for (const [dx, dy] of directions) {
      const nx = x + dx
      const ny = y + dy
      if (!visited.isInside(nx, ny) || visited.getColor(nx, ny) === VISITED_COLOR) {
        continue
      }
      fillStack.push(nx, ny)
    }
  }
}

/**
 * Draws a line between two points.
 *
 * @see https://github.com/aseprite/aseprite/blob/1eace2489125933f1975def6d5f3eea3344c4dc3/src/doc/algo.cpp
 * @param {ImageData} imageData
 * @param {number} px1
 * @param {number} py1
 * @param {number} px2
 * @param {number} py2
 * @param {Color} color
 * @param {Dither} [dither]
 * @returns {ImageData}
 */
export function line(imageData, px1, py1, px2, py2, color, dither) {
  let x1 = px1,
    y1 = py1,
    x2 = px2,
    y2 = py2

  if (x1 === x2 && y1 === y2) {
    return putColor(imageData, x1, y1, color, dither)
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
    if (yAxis) putColor(imageData, y, x, color, dither)
    else putColor(imageData, x, y, color, dither)

    // El error avanza "h/w" por cada paso "x". Como estamos usando un
    // valor entero para "e", utilizamos "w" como unidad.
    e += h
    if (e >= w) {
      y += dy
      e -= w
    }
  }
}

/**
 * Fills a rectangle.
 *
 * @param {ImageData} imageData
 * @param {number} px1
 * @param {number} py1
 * @param {number} px2
 * @param {number} py2
 * @param {Color} color
 * @param {Dither} [dither]
 * @returns {ImageData}
 */
export function fillRect(imageData, px1, py1, px2, py2, color, dither) {
  const sx = Math.min(px1, px2)
  const ex = Math.max(px1, px2)
  const sy = Math.min(py1, py2)
  const ey = Math.max(py1, py2)
  for (let y = sy; y <= ey; y++) {
    for (let x = sx; x <= ex; x++) {
      putColor(imageData, x, y, color, dither)
    }
  }
  return imageData
}

/**
 * Strokes a rectangle.
 *
 * @param {ImageData} imageData
 * @param {number} px1
 * @param {number} py1
 * @param {number} px2
 * @param {number} py2
 * @param {Color} color
 * @param {Dither} [dither]
 * @returns {ImageData}
 */
export function strokeRect(imageData, px1, py1, px2, py2, color, dither) {
  line(imageData, px1, py1, px2, py1, color, dither)
  line(imageData, px2, py1, px2, py2, color, dither)
  line(imageData, px2, py2, px1, py2, color, dither)
  line(imageData, px1, py2, px1, py1, color, dither)
  return imageData
}

/**
 * Draws a rectangle.
 *
 * @param {ImageData} imageData
 * @param {number} px1
 * @param {number} py1
 * @param {number} px2
 * @param {number} py2
 * @param {Color} color
 * @param {Dither} [dither]
 * @param {boolean} [filled=false]
 * @returns {ImageData}
 */
export function rect(imageData, px1, py1, px2, py2, color, dither, filled = false) {
  if (filled) {
    return fillRect(imageData, px1, py1, px2, py2, color, dither)
  }
  return strokeRect(imageData, px1, py1, px2, py2, color, dither)
}

/**
 * Fills a ellipse
 *
 * @param {ImageData} imageData
 * @param {number} px1
 * @param {number} py1
 * @param {number} px2
 * @param {number} py2
 * @param {Color} color
 * @param {Dither} [dither]
 * @returns {ImageData}
 */
export function fillEllipse(imageData, px1, py1, px2, py2, color, dither) {
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
      putColor(imageData, x, py1, color, dither)
      putColor(imageData, x, py2, color, dither)
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
    putColor(imageData, px1 - 1, py1, color, dither)
    putColor(imageData, px2 + 1, py1++, color, dither)
    putColor(imageData, px1 - 1, py2, color, dither)
    putColor(imageData, px2 + 1, py2--, color, dither)
  }
  return imageData
}

/**
 * Strokes a ellipse.
 *
 * @see https://github.com/aseprite/aseprite/blob/25fbe786f8353a2ddb57de3bcc5db00066cc9ca6/src/doc/algo.cpp
 * @see http://members.chello.at/easyfilter/bresenham.html
 * @param {ImageData} imageData
 * @param {number} px1
 * @param {number} py1
 * @param {number} px2
 * @param {number} py2
 * @param {Color} color
 * @param {Dither} [dither]
 * @returns {ImageData}
 */
export function strokeEllipse(imageData, px1, py1, px2, py2, color, dither) {
  let a = Math.abs(px2-px1),
      b = Math.abs(py2-py1),
      b1 = b&1 /* values of diameter */
  let dx = 4*(1-a)*b*b,
      dy = 4*(b1+1)*a*a /* error increment */
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
    putColor(imageData, px2, py1, color, dither) /*   I. Quadrant */
    putColor(imageData, px1, py1, color, dither) /*  II. Quadrant */
    putColor(imageData, px1, py2, color, dither) /* III. Quadrant */
    putColor(imageData, px2, py2, color, dither) /*  IV. Quadrant */
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
    putColor(imageData, px1-1, py1, color, dither) /* -> finish tip of ellipse */
    putColor(imageData, px2+1, py1++, color, dither)
    putColor(imageData, px1-1, py2, color, dither)
    putColor(imageData, px2+1, py2--, color, dither)
  }
  return imageData
}

/**
 * Draws a ellipse.
 *
 * @param {ImageData} imageData
 * @param {number} px1
 * @param {number} py1
 * @param {number} px2
 * @param {number} py2
 * @param {Color} color
 * @param {Dither} [dither]
 * @param {boolean} [filled=false]
 * @returns {ImageData}
 */
export function ellipse(imageData, px1, py1, px2, py2, color, dither, filled = false) {
  if (filled) {
    return fillEllipse(imageData, px1, py1, px2, py2, color, dither)
  }
  return strokeEllipse(imageData, px1, py1, px2, py2, color, dither)
}

/**
 * Compares two ImageData and returns true if the are equals.
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
 * Clone an ImageData.
 *
 * @param {ImageData} imageData
 * @returns {ImageData}
 */
export function clone(imageData) {
  return new ImageData(imageData.data.slice(), imageData.width, imageData.height)
}

/**
 * Copy sourceImageData to targetImageData.
 *
 * @param {ImageData} targetImageData
 * @param {ImageData} sourceImageData
 * @returns {ImageData}
 */
export function copy(targetImageData, sourceImageData) {
  targetImageData.data.set(sourceImageData.data, 0)
  return targetImageData
}

/**
 * Copy sourceImageData to targetImageData
 *
 * @param {ImageData} targetImageData
 * @param {ImageData} sourceImageData
 * @param {Color} color
 * @param {Color} [maskColor]
 * @returns {ImageData}
 */
export function copySelected(targetImageData, sourceImageData, [r, g, b], maskColor = null) {
  if (sourceImageData.width !== targetImageData.width
   || sourceImageData.height !== targetImageData.height) {
    throw new Error('sourceImageData and targetImageData must have the same size')
  }
  for (let y = 0; y < sourceImageData.height; y++) {
    const baseOffset = (y * sourceImageData.width)
    for (let x = 0; x < sourceImageData.width; x++) {
      const index = (baseOffset + x) * 4
      const cr = sourceImageData.data[index + 0]
      const cg = sourceImageData.data[index + 1]
      const cb = sourceImageData.data[index + 2]
      const ca = sourceImageData.data[index + 3]
      if (r === cr && g === cg && b === cb) {
        if (maskColor) {
          const [mr, mg, mb, ma] = maskColor
          putColor(targetImageData, x, y, [mr, mg, mb, ma])
        } else {
          putColor(targetImageData, x, y, [cr, cg, cb, ca])
        }
      }
    }
  }
  return targetImageData
}

/**
 * Copy sourceImageData to targetImageData.
 *
 * @param {ImageData} targetImageData
 * @param {ImageData} sourceImageData
 * @param {number} x
 * @param {number} y
 * @param {Color} [maskColor]
 * @returns {ImageData}
 */
export function copySelectedAt(targetImageData, sourceImageData, x, y, maskColor = null) {
  const color = getColor(sourceImageData, x, y)
  return copySelected(targetImageData, sourceImageData, color, maskColor)
}

/**
 * Copy sourceImageData to targetImageData but only in contiguous pixels.
 *
 * @param {ImageData} targetImageData
 * @param {ImageData} sourceImageData
 * @param {number} x
 * @param {number} y
 * @param {Color} [maskColor]
 * @returns {ImageData}
 */
export function copyContiguousSelectedAt(
  targetImageData,
  sourceImageData,
  x,
  y,
  maskColor = null
) {
  if (sourceImageData.width !== targetImageData.width
   || sourceImageData.height !== targetImageData.height) {
    throw new Error('sourceImageData and targetImageData must have the same size')
  }
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]
  const [r, g, b] = getColor(sourceImageData, x, y)
  const visited = IndexedImageData.fromImageData(sourceImageData)
  const fillStack = new FillStack(sourceImageData.width, sourceImageData.height)
  fillStack.push(x, y)
  while (!fillStack.isEmpty) {
    const [x, y, offset] = fillStack.pop()
    visited.putColor(x, y, 0xFF)
    const cr = sourceImageData.data[offset + 0]
    const cg = sourceImageData.data[offset + 1]
    const cb = sourceImageData.data[offset + 2]
    const ca = sourceImageData.data[offset + 3]

    if (maskColor) {
      const [mr, mg, mb, ma] = maskColor
      putColor(targetImageData, x, y, [mr, mg, mb, ma])
    } else {
      putColor(targetImageData, x, y, [cr, cg, cb, ca])
    }

    for (const [dx, dy] of directions) {
      const [nr, ng, nb] = getColor(sourceImageData, x + dx, y + dy)
      if (r !== nr || g !== ng || b !== nb) {
        continue
      }
      const nx = x + dx
      const ny = y + dy
      if (visited.isInside(nx, ny) && visited.getColor(nx, ny) !== 0xFF) {
        fillStack.push(x + dx, y + dy)
      }
    }
  }
}

/**
 * Copy from canvas to targetImageData
 *
 * @param {ImageData} targetImageData
 * @param {HTMLCanvasElement|OffscreenCanvas} canvas
 * @returns {ImageData}
 */
export function copyFromCanvas(targetImageData, canvas) {
  const context = CanvasContext2D.get(canvas, {
    willReadFrequently: true,
  })
  const sourceImageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
  return copy(targetImageData, sourceImageData)
}

/**
 * Copy from targetImageData to canvas
 *
 * @param {ImageData} targetImageData
 * @param {HTMLCanvasElement|OffscreenCanvas} canvas
 * @returns {ImageData}
 */
export function copyToCanvas(targetImageData, canvas) {
  const context = CanvasContext2D.get(canvas, {
    willReadFrequently: true
  })
  context.putImageData(targetImageData, 0, 0)
  return targetImageData
}

/**
 * Translates an ImageData by tx and ty
 *
 * @param {ImageData} imageData
 * @param {number} tx
 * @param {number} ty
 * @param {*} mode TODO: implementar
 */
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

/**
 *
 * @param {ImageData} targetImageData
 * @param {ImageData} sourceImageData
 * @returns {ImageData}
 */
function flipGetSourceImageData(targetImageData, sourceImageData) {
  if (!sourceImageData) {
    return clone(targetImageData)
  }
  if (targetImageData === sourceImageData) {
    return clone(sourceImageData)
  }
  return sourceImageData
}

/**
 * Flips an ImageData horizontally
 *
 * @param {ImageData} targetImageData
 * @param {ImageData} sourceImageData
 * @returns {ImageData}
 */
export function flipHorizontally(targetImageData, sourceImageData) {
  const imageData = flipGetSourceImageData(targetImageData, sourceImageData)
  const halfWidth = imageData.width / 2
  for (let x = 0; x < halfWidth; x++) {
    const fx = imageData.width - x - 1
    for (let y = 0; y < imageData.height; y++) {
      const leftColor = getColor(imageData, x, y)
      const rightColor = getColor(imageData, fx, y)
      putColor(targetImageData, x, y, rightColor)
      putColor(targetImageData, fx, y, leftColor)
    }
  }

  return targetImageData
}

/**
 * Flips vertically an ImageData
 *
 * @param {ImageData} targetImageData
 * @param {ImageData} sourceImageData
 * @returns {ImageData}
 */
export function flipVertically(targetImageData, sourceImageData) {
  const imageData = flipGetSourceImageData(targetImageData, sourceImageData)
  const halfHeight = imageData.height / 2
  for (let y = 0; y < halfHeight; y++) {
    const fy = imageData.width - y - 1
    for (let x = 0; x < imageData.width; x++) {
      const topColor = getColor(imageData, x, y)
      const bottomColor = getColor(imageData, x, fy)
      putColor(targetImageData, x, y, bottomColor)
      putColor(targetImageData, x, fy, topColor)
    }
  }
  return targetImageData
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
  copySelected,
  copySelectedAt,
  copyContiguousSelectedAt,
  clone,
  translate,
  flipHorizontally,
  flipVertically
}
