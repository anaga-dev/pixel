/**
 *
 * @param {string} src
 * @param {LoadImageOptions} [options]
 * @returns {Image}
 */
export function loadImage(src, { crossOrigin = 'anonymous', decoding = 'async', loading = 'eager' } = {}) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = (error) => reject(error)
    image.onabort = () => reject(new Error('Abort'))
    image.crossOrigin = crossOrigin
    image.decoding = decoding
    image.loading = loading
    image.src = src
  })
}

export async function load(file) {
  const url = URL.createObjectURL(file)
  const image = await loadImage(url)
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0)
  const frame = context.getImageData(0, 0, image.naturalWidth, image.naturalHeight)
  return {
    width: image.naturalWidth,
    height: image.naturalHeight,
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

export async function save(document) {
  // TODO:
}

export default {
  load,
  save
}
