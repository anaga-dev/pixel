import Color from '@/pixel/color/Color'
import BinaryReader from '@/pixel/io/BinaryReader'
import BinaryWriter from '@/pixel/io/BinaryWriter'

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
  return writer.toBlob()
}

/**
 * Loads a palette file.
 *
 * @param {Blob} blob
 * @returns {Promise<Palette>}
 */
export async function load(blob) {
  const reader = BinaryReader.fromBlob(blob)
  const palette = []
  for (let i = 0; i < 256; i++) {
    const r = reader.read('u1')
    const g = reader.read('u1')
    const b = reader.read('u1')
    palette.push(
      '#'
      + r.toString(16).padStart(2, '0')
      + g.toString(16).padStart(2, '0')
      + b.toString(16).padStart(2, '0')
    )
  }
  return palette
}

export default {
  load,
  save
}
