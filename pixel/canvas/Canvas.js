import { createImageFromURL } from '../image/ImageUtils'
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
  if (!Number.isInteger(width) || width <= 0) {
    throw new Error('The width must be a finite integer number')
  }
  if (!Number.isInteger(height) || height <= 0) {
    throw new Error('The height must be a finite integer number')
  }
  const canvas = document.createElement('canvas')
  canvas.width = Math.floor(width)
  canvas.height = Math.floor(height)
  return canvas
}

/**
 * Creates or returns a canvas with the specified width and height.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} width
 * @param {number} height
 * @returns {HTMLCanvasElement}
 */
export function createOrGet(canvas, width, height) {
  if (!canvas) {
    return create(width, height)
  }
  resizeTo(canvas, width, height)
  return canvas
}

/**
 * Tries to create a OffscreenCanvas if supported by the browser.
 * Otherwise, it creates a regular canvas.
 *
 * @param {number} width
 * @param {number} height
 * @returns {HTMLCanvasElement|OffscreenCanvas}
 */
export function createOffscreen(width, height) {
  if (window && 'OffscreenCanvas' in window) {
    return new OffscreenCanvas(width, height)
  }
  return create(width, height)
}

/**
 * Creates a new <canvas> element with the specified width,
 * height and properties.
 *
 * @param {number} width
 * @param {number} height
 * @param {CreateWithProps} [props]
 * @returns {HTMLCanvasElement}
 */
export function createWith(width, height, props) {
  const canvas = create(width, height)
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      canvas[key] = Array.isArray(value) ? value.join(' ') : value
    }
  }
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

/**
 * Creates or returns a canvas with the specified width, height
 * and CSS Classes.
 *
 * @param {HTMLCanvasElement|undefined|null} canvas
 * @param {number} width
 * @param {number} height
 * @param  {...any} classNames
 * @returns {HTMLCanvasElement}
 */
export function createOrGetWithClasses(canvas, width, height, ...classNames) {
  if (!canvas) {
    return createWithClasses(width, height, ...classNames)
  }
  resizeTo(canvas, Math.floor(width), Math.floor(height))
  classNames.forEach((className) => canvas.classList.add(className))
  return canvas
}

/**
 * Resizes the canvas to the specified width and height.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} width
 * @param {number} height
 * @returns {boolean}
 */
export function resizeTo(canvas, width, height) {
  let resized = false
  if (canvas.width !== width) {
    canvas.width = width
    resized = true
  }
  if (canvas.height !== height) {
    canvas.height = height
    resized = true
  }
  return resized
}

/**
 * Resizes the canvas to match the size of its ClientRect
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} multiplier
 * @returns {boolean}
 */
export function resize(canvas, multiplier = 1) {
  return resizeTo(
    canvas,
    Math.floor(canvas.clientWidth * multiplier),
    Math.floor(canvas.clientHeight * multiplier)
  )
}

/**
 * Duplicates a canvas.
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {HTMLCanvasElement}
 */
export function duplicate(canvas) {
  const duplicatedCanvas = create(canvas.width, canvas.height)
  copy(duplicatedCanvas, canvas)
  return duplicatedCanvas
}

/**
 * Copies the content of a canvas to another.
 *
 * @param {HTMLCanvasElement|OffscreenCanvas} target
 * @param {HTMLCanvasElement|OffscreenCanvas} source
 */
export function copy(target, source) {
  CanvasContext2D.copyImageData(
    target.getContext('2d'),
    source.getContext('2d')
  )
}

/**
 * Clones a canvas.
 *
 * @param {HTMLCanvasElement|OffscreenCanvas} source
 * @returns {HTMLCanvasElement|OffscreenCanvas}
 */
export function clone(source) {
  return copy(create(source.width, source.height), source)
}

/**
 * Creates a new canvas with the specified width and height
 *
 * @param {HTMLCanvasElement|OffscreenCanvas} canvas
 * @param {'image/png'|'image/jpeg'|'image/webp'} [type]
 * @param {number} [quality]
 * @returns {Promise<Blob>}
 */
export function createBlob(canvas, type, quality) {
  if ('convertToBlob' in canvas && typeof canvas.convertToBlob === 'function') {
    return canvas.convertToBlob({ type, quality })
  }
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), type, quality))
}

/**
 *
 * @param {Blob|File} blob
 * @returns {HTMLCanvasElement}
 */
export async function createFromBlob(blob) {
  if (['image/png', 'image/jpeg'].includes(blob.type)) {
    const url = URL.createObjectURL(blob)
    /**
     * @type {Image}
     */
    const image = await createImageFromURL(url)
    URL.revokeObjectURL(url)
    const canvas = create(image.naturalWidth, image.naturalHeight)
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0)
    return canvas
  }
  return Promise.reject(new Error('Unsupported image file type'))
}

export default {
  create,
  createOrGet,
  createOffscreen,
  createWith,
  createWithClasses,
  createOrGetWithClasses,
  createFromBlob,
  resize,
  resizeTo,
  duplicate,
  copy,
  clone,
  createBlob
}
