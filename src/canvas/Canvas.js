import CanvasContext2D from './CanvasContext2D'

/**
 * Creates a new <canvas> element with the specified width
 * and height.
 *
 * @param {number} width
 * @param {number} height
 * @returns {HTMLCanvasElement}
 */
export function create(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

/**
 * Creates a new <canvas> element with the specified width,
 * height and CSS classes.
 *
 * @param {number} width
 * @param {number} height
 * @param  {...string} classNames
 * @returns {HTMLCanvasElement}
 */
export function createWithClasses(width, height, ...classNames) {
  const canvas = create(width, height)
  classNames.forEach((className) => canvas.classList.add(className))
  return canvas
}

export function resize(canvas, multiplier = 1) {
  let resized = false
  const expectedWidth = Math.floor(canvas.clientWidth * multiplier)
  if (canvas.width !== expectedWidth) {
    canvas.width = expectedWidth
    resized = true
  }
  const expectedHeight = Math.floor(canvas.clientHeight * multiplier)
  if (canvas.height !== expectedHeight) {
    canvas.height = expectedHeight
    resized = true
  }
  return resized
}

export function resizeTo(canvas, width, height) {
  let resized = false
  const expectedWidth = Math.floor(width)
  if (canvas.width !== expectedWidth) {
    canvas.width = expectedWidth
    resized = true
  }
  const expectedHeight = Math.floor(height)
  if (canvas.height !== expectedHeight) {
    canvas.height = expectedHeight
    resized = true
  }
  return resized
}

export function duplicate(canvas) {
  const duplicateCanvas = create(canvas.width, canvas.height)
  swap(duplicateCanvas, canvas)
  return duplicateCanvas
}

/**
 *
 * @param {HTMLCanvasElement|OffscreenCanvas} target
 * @param {HTMLCanvasElement|OffscreenCanvas} source
 */
export function swap(target, source) {
  CanvasContext2D.swapImageData(target.getContext('2d'), source.getContext('2d'))
}

/**
 * Crea un blob a partir de un canvas.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {string} type
 * @param {number} quality
 * @returns {Blob}
 */
export function createBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), type, quality))
}

export default {
  create,
  createWithClasses,
  resize,
  resizeTo,
  duplicate,
  swap,
  createBlob
}
