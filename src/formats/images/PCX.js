import BinaryReader from '../io/BinaryReader.js'

const PCX_SIGNATURE = 0x0A

/**
 * Saves a PCX file from a document.
 *
 * @param {documentStore} document
 * @returns {Promise<Blob>}
 */
export async function save(document) {
  // const writer = BinaryWriter
}

/**
 * Loads a PCX file.
 *
 * @param {Blob} blob
 * @returns {Promise<documentStore>}
 */
export async function load(blob) {
  const reader = BinaryReader.fromBlob(blob)
  const signature = reader.read('u1')
  if (signature != PCX_SIGNATURE) {
    throw new Error('Invalid PCX signature')
  }
  /**
   * 0 = Versión 2.5
   * 2 = Versión 2.8 con Paleta
   * 3 = Versión 2.8 paleta por defecto
   * 4 = Paintbrush para Windows
   * 5 = Version 3.0 o superior
   */
  const version = reader.read('u1')
  if (version === 0) {
    console.log('Versión 2.5')
  } else if (version === 2) {
    console.log('Versión 2.8 con paleta')
  } else if (version === 3) {
    console.log('Versión 2.8 paleta por defecto')
  } else if (version === 4) {
    console.log('Paintbrush para Windows')
  } else if (version === 5) {
    console.log('Versión 3.0 o superior')
  }
  /**
   * 0 - Sin compresión
   * 1 - RLE
   */
  const compression = reader.read('u1')
  if (compression < 0 || compression > 1) {
    throw new Error('Unknown PCX compression algorithm')
  }
  /**
   * 1 - Monocromo
   * 4 - 16 colores
   * 8 - 256 colores
   * 24 - 16.7 millones de colores o truecolor
   */
  const bpp = (reader.position = 128)
  const xmin = reader.read('u2')
  const ymin = reader.read('u2')
  const xmax = reader.read('u2')
  const ymax = reader.read('u2')
  const width = xmax - xmin + 1
  const height = ymax - ymin + 1
  const hres = reader.read('u2')
  const vres = reader.read('u2')
  reader.skip(48)
  const reserved = reader.read('u1')
  const planes = reader.read('u1')
  const planeSize = reader.read('u2')
  const paletteSize = reader.read('u2')
}
