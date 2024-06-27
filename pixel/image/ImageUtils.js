/**
 * @typedef {object} ImageOptions
 * @property {''|'anonymous'|'use-credentials'} [crossOrigin]
 * @property {''|'async'|'sync'} [decoding]
 * @property {''|'eager'|'lazy'} [loading]
 */

/**
 *
 * @param {string|URL} url
 * @param {ImageOptions} [options]
 * @returns {Promise<Image|Error>}
 */
export function createImageFromURL(url, options) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = (error) => reject(error)
    image.onabort = () => reject(new Error('Abort'))
    image.src = url
    image.crossOrigin = options?.crossOrigin ?? ''
    image.decoding = options?.decoding ?? 'sync'
    image.loading = options?.loading ?? 'eager'
  })
}

export default {
  createImageFromURL
}
