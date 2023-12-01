/**
 * @typedef {object} LoadImageOptions
 * @property {string} [crossOrigin='anonymous']
 * @property {string} [decoding='sync']
 * @property {string} [loading='eager']
 */

/**
 * Loads an Image.
 *
 * @param {string} src
 * @param {LoadImageOptions} [options]
 * @returns {Image}
 */
export function loadImage(src, options) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = _ => resolve(image)
    image.onerror = (error) => reject(error)
    image.onabort = _ => reject(new Error('Abort'))
    image.crossOrigin = options?.crossOrigin ?? 'anonymous'
    image.decoding = options?.decoding ?? 'sync'
    image.loading = options?.loading ?? 'eager'
    image.src = src
  })
}

/**
 * Returns an Image or an ImageBitmap using a blob.
 *
 * @param {Blob} blob
 * @returns {Promise<Image|ImageBitmap>}
 */
export async function getImage(blob) {
  if ('createImageBitmap' in window) {
    return createImageBitmap(blob)
  } else {
    const url = URL.createObjectURL(blob)
    const image = await loadImage(url)
    // Ensure that the image has the correct dimensions.
    image.width = image.naturalWidth
    image.height = image.naturalHeight
    URL.revokeObjectURL(url)
    return image
  }
}

/**
 * Loads a WebImage (png, gif, jpeg, webp) file.
 *
 * @param {File} file
 * @returns {Promise<Document>}
 */
export async function load(file) {
  const image = await getImage(file)
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0)
  const frame = context.getImageData(0, 0, image.width, image.height)
  return {
    width: image.width,
    height: image.height,
    layers: [
      {
        name: file.name,
        opacity: 1.0,
        visible: 'visible',
        blendMode: 'normal',
        canvas,
        context,
        frames: [frame]
      }
    ]
  }
}

/**
 * Saves a WebImage file.
 *
 * @param {Document} document
 * @param {SaveOptions} options
 * @returns {Blob}
 */
export async function save(document, options) {
  const offscreenCanvas = new OffscreenCanvas(document.width, document.height)
  const context = offscreenCanvas.getContext('2d')
  context.drawImage(document.canvas, 0, 0)
  const blob = await offscreenCanvas.convertToBlob({
    type: options?.type ?? 'image/png',
    quality: options?.quality ?? 1
  })
  return blob
}

export default {
  load,
  save
}
