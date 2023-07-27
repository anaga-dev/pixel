import CanvasContext from './CanvasContext'
import ImageDataUtils from './ImageDataUtils'
import Color from '../color/Color'

/**
 * @typedef {Object} Layer
 * @property {string} id
 * @property {boolean} visible
 * @property {number} opacity
 * @property {string} blendMode
 * @property {string} type
 * @property {HTMLCanvasElement} canvas
 */

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

export function replaceImageData(context, callback) {
  const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
  callback(imageData)
  context.putImageData(imageData, 0, 0)
  return context
}

export function copyImageData(targetContext, sourceContext) {
  const imageData = sourceContext.getImageData(0, 0, sourceContext.canvas.width, sourceContext.canvas.height)
  targetContext.putImageData(imageData, 0, 0)
}

export function putImage(context, image) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height)
  context.drawImage(image, 0, 0)
}

export function getColor(context, x, y) {
  const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
  const color = ImageDataUtils.getColor(imageData, x, y).map(value => value / 255)
  return Color.stringify(color, 'rgba')
}

export function putColor(context, x, y, color) {
  return replaceImageData(context, (imageData) =>
    ImageDataUtils.putColor(imageData, x, y, Color.asUint8(Color.parse(color)))
  )
}

export function fill(context, x, y, color, contiguous = true) {
  return replaceImageData(context, (imageData) => {
    if (contiguous) {
      ImageDataUtils.fill(imageData, x, y, Color.asUint8(Color.parse(color)))
    } else {
      ImageDataUtils.replaceColorAt(imageData, x, y, Color.asUint8(Color.parse(color)))
    }
  })
}

export function line(context, x1, y1, x2, y2, color) {
  return replaceImageData(context, (imageData) => {
    ImageDataUtils.line(imageData, x1, y1, x2, y2, Color.asUint8(Color.parse(color)))
  })
}

export function rectangle(context, x1, y1, x2, y2, color, filled) {
  return replaceImageData(context, (imageData) => {
    ImageDataUtils.rect(imageData, x1, y1, x2, y2, Color.asUint8(Color.parse(color)), filled)
  })
}

export function ellipse(context, x1, y1, x2, y2, color, filled) {
  return replaceImageData(context, (imageData) => {
    ImageDataUtils.ellipse(imageData, x1, y1, x2, y2, Color.asUint8(Color.parse(color)), filled)
  })
}

export function translate(context, x, y, mode) {
  return replaceImageData(context, (imageData) => {
    ImageDataUtils.translate(imageData, x, y, mode)
  })
}

export default {
  create,
  get,
  replaceImageData,
  copyImageData,
  putImage,
  getColor,
  putColor,
  fill,
  line,
  rectangle,
  ellipse,
  translate
}
