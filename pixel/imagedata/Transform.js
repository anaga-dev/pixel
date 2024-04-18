import { clone } from './ImageDataUtils'

/**
 * Translates all the pixels of an ImageData by
 * the amount of pixels.
 *
 * @param {ImageData} imageData
 * @param {number} tx
 * @param {number} ty
 * @param {boolean} tiling
 */
export function translate(imageData, tx, ty, tiling) {
  let dx = tx,
    dy = ty
  if (!Number.isInteger(tx)) {
    dx = tx < 0 ? Math.ceil(tx) : Math.floor(tx)
  }
  if (!Number.isInteger(ty)) {
    dy = ty < 0 ? Math.ceil(ty) : Math.floor(tx)
  }
  const source = new Uint32Array(imageData.data.buffer)
  const target = new Uint32Array(imageData.data.byteLength / 4)
  // Generate the translated buffer.
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      let sy = y - dy
      let sx = x - dx

      if (tiling) {
        sy = (sy + imageData.height) % imageData.height
        sx = (sx + imageData.width) % imageData.width
      }

      const sourceOffset = sy * imageData.width + sx
      const targetOffset = y * imageData.width + x

      if (
        !tiling &&
        (sx < 0 || sx >= imageData.width || sy < 0 || sy >= imageData.height)
      ) {
        target[targetOffset] = 0 // Podrías establecer un color específico aquí.
      } else {
        target[targetOffset] = source[sourceOffset]
      }
    }
  }
  // One buffer is dumped on top of the other when it's finished.
  source.set(target, 0)
}

export function rotate(imageData, angle, rx, ry, tiling) {
  console.warn('TO BE IMPLEMENTED')
}

export function scale(imageData, sx, sy, tiling) {
  console.warn('TO BE IMPLEMENTED')
}

/**
 * Returns the source of the image data to flip
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
  const source = new Uint32Array(imageData.data.buffer)
  const target = new Uint32Array(targetImageData.data.buffer)
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const sourceOffset = y * imageData.width + x
      const targetOffset = y * imageData.width + (imageData.width - 1 - x)
      target[targetOffset] = source[sourceOffset]
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
  const source = new Uint32Array(imageData.data.buffer)
  const target = new Uint32Array(targetImageData.data.buffer)
  for (let y = 0; y < imageData.height; y++) {
    target.set(
      source.subarray(
        y * imageData.width,
        y * imageData.width + imageData.width
      ),
      (imageData.height - 1 - y) * imageData.width
    )
  }
  return targetImageData
}

export default {
  translate,
  rotate,
  scale,
  flipHorizontally,
  flipVertically
}
