/**
 *
 * @param {Blob} blob
 * @param {*} options
 * @returns {Promise<void>}
 */
async function showSave(blob, options) {
  if ('showSaveFilePicker' in window) {
    const fileHandle = await window.showSaveFilePicker({
      types: options?.types,
      excludeAcceptAllOption: options?.excludeAcceptAllOption ?? true,
      multiple: options?.multiple ?? false
    })
    const writable = await fileHandle.createWritable()
    await writable.write(blob)
    await writable.close()
  } else {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = options?.defaultFileName ?? 'file'
    a.click()
  }
}

/**
 *
 * @param {*} options
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
    return new Promise((resolve, reject) => {
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