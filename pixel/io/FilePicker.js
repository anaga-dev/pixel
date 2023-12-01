/**
 * @typedef {Object} ShowSaveOptions
 * @property {string[]} types
 * @property {boolean} [excludeAcceptAllOption]
 * @property {boolean} [multiple]
 * @property {string} [defaultFileName]
 */

/**
 * @typedef {Object} ShowOpenOptions
 * @property {string[]} types
 * @property {boolean} [excludeAcceptAllOption]
 * @property {boolean} [multiple]
 */

/**
 * Shows a file picker to save a file.
 *
 * @param {Function} callback
 * @param {ShowSaveOptions} options
 * @returns {Promise<void>}
 */
async function showSave(callback, options) {
  if ('showSaveFilePicker' in window) {
    const fileHandle = await window.showSaveFilePicker({
      types: options?.types,
      excludeAcceptAllOption: options?.excludeAcceptAllOption ?? true,
      multiple: options?.multiple ?? false
    })
    const blob = await callback(fileHandle)
    const writable = await fileHandle.createWritable()
    await writable.write(blob)
    await writable.close()
  } else {
    const a = document.createElement('a')
    const blob = await callback({
      kind: 'file',
      name: options?.defaultFileName ?? 'file'
    })
    a.href = URL.createObjectURL(blob)
    a.download = options?.defaultFileName ?? 'file'
    a.click()
  }
}

/**
 * Shows a file picker to open a file.
 *
 * @param {ShowOpenOptions} options
 * @returns {Promise<File>}
 */
async function showOpen(options) {
  if ('showOpenFilePicker' in window) {
    const [fileHandle] = await window.showOpenFilePicker({
      types: options?.types,
      excludeAcceptAllOption: options?.excludeAcceptAllOption ?? true,
      multiple: options?.multiple ?? false
    })
    if (fileHandle.kind !== 'file') {
      return
    }
    const file = await fileHandle.getFile()
    if (!file) {
      return
    }
    return file
  } else {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = options?.types
      input.multiple = options?.multiple ?? false
      input.onchange = (e) => {
        const [file] = e.target.files
        return resolve(file)
      }
      input.click()
    })
  }
}

export default {
  showOpen,
  showSave
}
