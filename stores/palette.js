import { v4 as uuid } from 'uuid'

export const usePaletteStore = defineStore('palette', () => {
  const colors = reactive([])
  console.log(colors)

  /**
   * Set palette colors
   *
   * @param {Array<string>} newColors
   */
  function set(newColors) {
    console.log('set', newColors)
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

  function addAt(index, color) {
    const newColor = {
      id: uuid(),
      color: color
    }
    colors.splice(index, 0, newColor)
  }

  /**
   * Remove color from palette
   *
   * @param {number} index
   */
  function removeAt(index) {
    const [removed] = colors.splice(index, 1)
    return removed
  }

  function removeLast() {
    return colors.pop()
  }

  /*
   * Swap colors in palette
   */

  function swap(fromIndex, toIndex) {
    console.log('swap', fromIndex, toIndex)
    const [fromColor] = colors.splice(fromIndex, 1)
    console.log('fromColor', fromColor)
    colors.splice(toIndex, 0, fromColor)
  }

  return { colors, set, clear, add, addAt, removeAt, removeLast, swap }
})
