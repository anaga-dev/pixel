export const usePaletteStore = defineStore('palette', () => {
  const colors = reactive([])
  console.log(colors)

  /**
   * Set palette colors
   *
   * @param {Array<string>} newColors
   */
  function set(newColors) {
    colors.splice(0, colors.length, ...newColors)
  }

  /**
   * Add color to palette
   */
  function add(color) {
    colors.push(color)
  }

  function addAt(index, color) {
    colors.splice(index, 0, color)
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

  return { colors, set, add, addAt, removeAt, removeLast }
})
