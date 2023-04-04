import JSZip from 'jszip'
import Canvas from '../canvas/Canvas'

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
  // TODO: Esto generará imágenes con aspect ratios erróneos, habría que hacer un crop inteligente.
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
    default:
      return `svg:${operation}`
  }
}

/**
 * Devuelve el XML de las capas
 *
 * @param {PixelDocumentStore} document
 * @returns {string}
 */
function createStack(document) {
  let xml = '<?xml version="1.0" encoding="UTF-8" ?>'
  xml += `<image version="0.0.3" w="${document.width}" h="${document.height}" xres="${document.width}" yres="${document.height}">`
  xml += '<stack>'
  for (let index = 0; index < document.layers.length; index++) {
    const layer = document.layers[index]
    xml += `<layer name="${layer.name}" src="data/layer${index}.png" opacity="${layer.opacity}" visibility="${layer.visible ? 'visible': 'hidden'}" composite-op="${getCompositeOperation(layer.blendMode)}" x="0" y="0" />`
  }
  xml += '</stack>'
  xml += '</image>'
  return xml
}

/**
 * Guardamos un archivo .ora (Open Raster)
 *
 * @param {PixelDocumentStore} document
 * @returns {Promise<Blob>}
 */
export async function save(document) {
  const stack = createStack(document)
  const mergedImage = await Canvas.createBlob(document.canvas, 'image/png')
  const zip = new JSZip()
  zip.file('mimetype', 'image/openraster', {
    compression: 'STORE'
  })
  zip.file('stack.xml', stack)
  zip.file('mergedimage.png', mergedImage)
  const dataFolder = zip.folder('data')
  const layers = await Promise.all(document.layers.list.map((layer) => Canvas.createBlob(layer.canvas, 'image/png')))
  layers.forEach((blob, index) => dataFolder.file(`layer${index}.png`, blob))
  zip.folder('Thumbnails').file('thumbnail.png', await createThumbnail(document.canvas))
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
  const stack = await zip.file('stack.xml').async('string')
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(stack, 'text/xml')
  const image = xmlDoc.querySelector('image')
  const width = image.getAttribute('w')
  const height = image.getAttribute('h')
  const layers = xmlDoc.querySelectorAll('layer')
  const blobs = await Promise.all(layers.map((layer) => {
    return zip.file(layer).async('blob')
  }))
  console.log(blobs)
  // TODO: Terminar esta función para poder cargar archivos de tipo OpenRaster.
}

export default {
  save,
  load
}
