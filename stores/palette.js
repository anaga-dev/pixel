export const usePaletteStore = defineStore('palette', () => {
  const colors = ref([])

  /**
   * Set palette colors
   *
   * @param {Array<string>} colors
   */
  function set(colors) {
    colors.splice(0, colors.length, ...colors)
  }

  /**
   * Add color to palette
   */
  function add() {
    colors.push(this.color)
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
