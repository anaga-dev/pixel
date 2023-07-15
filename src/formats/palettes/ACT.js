import ColorParser from '@/color/ColorParser.js'
import BinaryReader from '@/io/BinaryReader.js'
import BinaryWriter from '@/io/BinaryWriter.js'

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
    const [r, g, b] = ColorParser.parse(serializedColor)
    writer.write('u1', Math.floor(r * 0xff))
    writer.write('u1', Math.floor(g * 0xff))
    writer.write('u1', Math.floor(b * 0xff))
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
    console.log(r, g, b)
  }
}

export default {
  load,
  save
}
