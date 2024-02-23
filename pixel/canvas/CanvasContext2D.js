import CanvasContext from './CanvasContext'
import Color from '@/pixel/color/Color'

/**
 * Sets the canvas image smoothing
 *
 * @param {CanvasRenderingContext2D} context
 * @param {number} width
 * @param {number} height
 * @returns {CanvasRenderingContext2D}
 */
export function setImageSmoothing(context, enabled, quality) {
  context.imageSmoothingEnabled = enabled
  if (enabled) {
    context.imageSmoothingQuality = quality
  }
  return context
}

/**
 * Creates a new <canvas> element with the specified width,
 *
 * @param {number} width
 * @param {number} height
 * @param {CanvasRenderingContext2DSettings} [contextAttributes]
 * @param {boolean} [imageSmoothingEnabled=false]
 * @param {'low'|'medium'|'high'} [imageSmoothingQuality='low']
 * @returns {CanvasRenderingContext2D}
 */
export function create(width, height, contextAttributes, imageSmoothingEnabled = false, imageSmoothingQuality = 'low') {
  const context = CanvasContext.create(width, height, '2d', contextAttributes)
  return setImageSmoothing(context, imageSmoothingEnabled, imageSmoothingQuality)
}

/**
 * Creates a new OffscreenCanvas (if available) element with the specified width,
 *
 * @param {number} width
 * @param {number} height
 * @param {CanvasRenderingContext2DSettings} [contextAttributes]
 * @param {boolean} [imageSmoothingEnabled=false]
 * @param {'low'|'medium'|'high'} [imageSmoothingQuality='low']
 * @returns {CanvasRenderingContext2D}
 */
export function createOffscreen(width, height, contextAttributes, imageSmoothingEnabled = false, imageSmoothingQuality = 'low') {
  const context = CanvasContext.createOffscreen(width, height, '2d', contextAttributes)
  return setImageSmoothing(context, imageSmoothingEnabled, imageSmoothingQuality)
}

/**
 * Returns a canvas context.
 *
 * @param {HTMLCanvasElement|OffscreenCanvas} canvas
 * @param {CanvasRenderingContext2DSettings} [contextAttributes]
 * @param {boolean} [imageSmoothingEnabled=false]
 * @param {'low'|'medium'|'high'} [imageSmoothingQuality='low']
 * @returns {CanvasRenderingContext2D}
 */
export function get(canvas, contextAttributes, imageSmoothingEnabled = false, imageSmoothingQuality = 'low') {
  const context = CanvasContext.get(canvas, '2d', contextAttributes)
  return setImageSmoothing(
    context,
    imageSmoothingEnabled,
    imageSmoothingQuality
  )
}

/**
 * Returns the color of an specified context and pixel coordinates
 * as a CSS color string.
 *
 * @param {CanvasRenderingContext2D} context
 * @param {number} x
 * @param {number} y
 * @returns {string}
 */
export function getColor(context, x, y) {
  const imageData = context.getImageData(x, y, 1, 1)
  const color = Color.fromUint8Array(imageData.data)
  return Color.stringify(color, 'rgba')
}

/**
 * Copies the image data from one context to another.
 *
 * @param {CanvasRenderingContext2D} targetContext
 * @param {CanvasRenderingContext2D} sourceContext
 */
export function copyImageData(targetContext, sourceContext) {
  const imageData = sourceContext.getImageData(
    0,
    0,
    sourceContext.canvas.width,
    sourceContext.canvas.height
  )
  targetContext.putImageData(imageData, 0, 0)
}

export default {
  create,
  createOffscreen,
  get,
  getColor,
  copyImageData,
}
