import Color from '@/pixel/color/Color.js'
import BinaryReader from '@/pixel/io/BinaryReader.js'
import BinaryWriter from '@/pixel/io/BinaryWriter.js'

/**
 * Saves a palette file from a document.
 *
 * @param {Palette} palette
 * @returns {Promise<Blob>}
 */
export async function save(palette) {
  const writer = BinaryWriter.fromByteLength(256 * 3)
  for (let i = 0; i < 256; i++) {
    const serializedColor = palette[i] ?? '#000000'
    const [r, g, b] = Color.parseAsUint8(serializedColor)
    writer.write('u1', r)
    writer.write('u1', g)
    writer.write('u1', b)
  }
}

/**
 * Loads a palette file.
 *
 * @param {Blob} blob
 * @returns {Promise<Palette>}
 */
export async function load(blob) {
  const reader = BinaryReader.fromBlob(blob)
  for (let i = 0; i < 256; i++) {
    const r = reader.read('u1')
    const g = reader.read('u1')
    const b = reader.read('u1')
  }
}

export default {
  load,
  save
}
