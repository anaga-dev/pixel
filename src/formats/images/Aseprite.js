// @see https://github.com/aseprite/aseprite/blob/main/docs/ase-file-specs.md

/**
 *
 * @param {Document} document
 * @returns {Promise<Blob>}
 */
export async function save(document) {
  // 128 bytes header
  for (let index = 0; index < document.layers; index++) {
    const layer = document.layers[index]
    // 16 bytes per frame
  }
}

/**
 * @type {Blob} blob
 * @returns {Promise<Document>}
 */
export function load(blob) {

}

export default {
  save,
  load
}
