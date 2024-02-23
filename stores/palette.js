import { v4 as uuid } from 'uuid'

/**
 * @typedef {object} PaletteColor
 * @property {string} id
 * @property {string} color
 */

/**
 * Palette store
 */
export const usePaletteStore = defineStore('palette', () => {
  const colors = reactive([])

  /**
   * Set palette colors
   *
   * @param {Array<string>} newColors
   */
  function set(newColors) {
    const newColorsList = newColors.map((color) => ({
      id: uuid(),
      color: color
    }))
    colors.splice(0, colors.length, ...newColorsList)
  }

  /**
   * Clear palette colors
   *
   * @param {Array<string>} newColors
   */
  function clear() {
    colors.splice(0, colors.length)
  }

  /**
   * Add color to palette
   */
  function add(color) {
    colors.push({
      id: uuid(),
      color: color
    })
  }

  /**
   * Add color to palette at index.
   *
   * @param {number} index
   * @param {string} color
   */
  function addAt(index, color) {
    const newColor = {
      id: uuid(),
      color: color
    }
    colors.splice(index, 0, newColor)
  }

  /**
   * Remove color from palette.
   *
   * @param {number} index
   */
  function removeAt(index) {
    const [removed] = colors.splice(index, 1)
    return removed
  }

  /**
   * Removes last color.
   *
   * @returns {string}
   */
  function removeLast() {
    return colors.pop()
  }

  /**
   * Swap colors in palette.
   *
   * @param {number} fromIndex
   * @param {number} toIndex
   */
  function swap(fromIndex, toIndex) {
    const [fromColor] = colors.splice(fromIndex, 1)
    colors.splice(toIndex, 0, fromColor)
  }

  return { colors, set, clear, add, addAt, removeAt, removeLast, swap }
})
