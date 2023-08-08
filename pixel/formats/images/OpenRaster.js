import JSZip from 'jszip'
import Canvas from '@/pixel/canvas/Canvas'

// @see https://www.openraster.org/baseline/layer-stack-spec.html

/**
 * Convierte un <canvas> o un OffscreenCanvas en un thumbnail.
 *
 * @param {*} source
 * @returns {Promise<Blob>}
 */
function createThumbnail(source) {
  const canvas = Canvas.create(256, 256)
  const context = canvas.getContext('2d')
  // TODO: This will generate wrong aspect ratio images, we should make a smart crop.
  context.drawImage(source, 0, 0)
  return Canvas.createBlob(canvas)
}

/**
 * Traduce las operaciones de composición de Canvas a
 * OpenRaster.
 *
 * @param {string} operation
 * @returns {string}
 */
function getCompositeOperation(operation) {
  switch (operation) {
    case 'source-over':
      return 'svg:src-over'
    case 'source-atop':
      return 'svg:src-atop'
    case 'source-in':
      return 'svg:src-in'
    case 'source-out':
      return 'svg:src-out'
    case 'destination-over':
      return 'svg:dst-over'
    case 'destination-atop':
      return 'svg:dst-atop'
    case 'destination-in':
      return 'svg:dst-in'
    case 'destination-out':
      return 'svg:dst-out'
    default:
      return `svg:${operation}`
  }
}

/**
 * Traduce las operaciones de composición de OpenRaster a
 * Canvas.
 *
 * @param {string} operation
 * @returns {string}
 */
function getBlendMode(operation) {
  if (!operation.startsWith('svg:')) {
    throw new Error('Invalid blend mode')
  }
  switch (operation) {
    case 'svg:src-over':
      return 'source-over'
    case 'svg:src-atop':
      return 'source-atop'
    case 'svg:src-in':
      return 'source-in'
    case 'svg:src-out':
      return 'source-out'
    case 'svg:dst-over':
      return 'destination-over'
    case 'svg:dst-atop':
      return 'destination-atop'
    case 'svg:dst-in':
      return 'destination-in'
    case 'svg:dst-out':
      return 'destination-out'
    default:
      return operation.slice(4)
  }
}

/**
 * Devuelve el XML de las capas
 *
 * @param {documentStoreStore} document
 * @returns {string}
 */
function createStack(document) {
  let xml = '<?xml version="1.0" encoding="UTF-8" ?>'
  xml += `<image version="0.0.3" w="${document.width}" h="${document.height}" xres="${document.width}" yres="${document.height}">`
  xml += '<stack>'
  for (let index = 0; index < document.layers.list.length; index++) {
    const layer = document.layers.list[index]
    xml += `<layer name="${layer.name.value}" src="data/layer${index}.png" opacity="${layer.opacity.value}" visibility="${layer.visible.value ? 'visible': 'hidden'}" composite-op="${getCompositeOperation(layer.blendMode.value)}" x="0" y="0" />`
  }
  xml += '</stack>'
  xml += '</image>'
  return xml
}

/**
 * Guardamos un archivo .ora (Open Raster)
 *
 * @param {documentStoreStore} doc
 * @returns {Promise<Blob>}
 */
export async function save(doc) {
  const stack = createStack(doc)
  const mergedImage = await Canvas.createBlob(doc.canvas, 'image/png')
  const zip = new JSZip()
  zip.file('mimetype', 'image/openraster', {
    compression: 'STORE'
  })
  zip.file('stack.xml', stack)
  zip.file('mergedimage.png', mergedImage)
  const dataFolder = zip.folder('data')
  const layers = await Promise.all(doc.layers.list.map((layer) => Canvas.createBlob(layer.canvas, 'image/png')))
  layers.forEach((blob, index) => dataFolder.file(`layer${index}.png`, blob))
  zip.folder('Thumbnails').file('thumbnail.png', await createThumbnail(doc.canvas))
  return zip.generateAsync({ type: 'blob' })
}

/**
 * Cargamos un archivo .ora (Open Raster)
 *
 * @param {File|Blob} blob
 * @returns {Promise}
 */
export async function load(blob) {
  const zip = new JSZip()
  await zip.loadAsync(blob)
  if (!zip.file('mimetype')) {
    throw new Error('File mimetype does not exists')
  }
  if (!zip.file('stack.xml')) {
    throw new Error('File stack.xml does not exists')
  }
  const mimetype = await zip.file('mimetype').async('string')
  if (mimetype !== 'image/openraster') {
    throw new Error('Invalid OpenRaster mimetype')
  }
  try {
    const stack = await zip.file('stack.xml').async('string')
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(stack, 'text/xml')
    const image = xmlDoc.querySelector('image')
    const width = parseInt(image.getAttribute('w'), 10)
    const height = parseInt(image.getAttribute('h'), 10)
    const layerElements = Array.from(xmlDoc.querySelectorAll('layer'))
    const blobs = await Promise.all(layerElements.map((layer) => {
      const src = layer.getAttribute('src')
      return zip.file(src).async('blob')
    }))
    const layers = await Promise.all(layerElements.map(async (layerElement, index) => {
      const blob = blobs[index]
      const imageBitmap = await createImageBitmap(blob)
      console.log(imageBitmap)
      const canvas = Canvas.create(width, height)
      const context = canvas.getContext('2d', {
        willReadFrequently: true
      })
      context.drawImage(imageBitmap, 0, 0)
      const { data } = context.getImageData(0, 0, width, height)
      const frame = new ImageData(data, width, height) //
      console.log(frame)
      return {
        name: layerElement.getAttribute('name'),
        opacity: parseFloat(layerElement.getAttribute('opacity')),
        visible: layerElement.getAttribute('visibility') === 'visible',
        blendMode: getBlendMode(layerElement.getAttribute('composite-op')),
        canvas,
        context,
        frames: [frame]
      }
    }))
    return {
      width,
      height,
      layers
    }
  } catch (error) {
    console.log(error)
    throw new Error('Invalid OpenRaster stack.xml')
  }
  // TODO: We need to finish this function in order to be able to load OpenRaster files.
}

export default {
  save,
  load
}
