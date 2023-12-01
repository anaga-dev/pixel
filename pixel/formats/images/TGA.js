import BinaryReader from '@/pixel/io/BinaryReader.js'
import BinaryWriter from '@/pixel/io/BinaryWriter.js'

/**
 * Saves a PCX file from a document.
 *
 * @param {documentStore} document
 * @returns {Promise<Blob>}
 */
export async function save(document) {
  const writer = BinaryWriter
}

/**
 * Loads a PCX file.
 *
 * @param {Blob} blob
 * @returns {Promise<documentStore>}
 */
export async function load(blob) {
  const reader = BinaryReader.fromBlob(blob)
}

export default {
  save,
  load,
}
