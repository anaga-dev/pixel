/**
 * Actions history.
 */
export const useHistoryStore = defineStore('history', () => {
  const MAX_HISTORY = 2048
  const list = reactive([])
  const index = ref(-1)
  const canUndo = computed(() => index.value >= 0 && list.length > 0)
  const canRedo = computed(() => index.value < list.length - 1)
  const last = computed(() => list[index.value])

  /**
   * Adds a new entry to history.
   *
   * @param {HistoryEntry} item
   */
  function add(item) {
    // If we are behind in history...
    if (index.value < list.length - 1) {
      // ...we invalidate all actions after the current one.
      const count = list.length - index.value
      list.splice(index.value, count, item)
    } else {
      // We add a new entry to history.
      list.push(item)
    }
// If the number of undos are exceeded, deletes all elements by history header
    if (list.length > MAX_HISTORY) {
      const count = list.length - MAX_HISTORY
      list.splice(0, count)
    }
    // Updates history index automatically.
    index.value = list.length - 1
  }

  /**
   * Undoes last action
   *
   * @returns {HistoryEntry}
   */
  function undo() {
    // Stores data from the last action made and a copy of the modified buffer .
    if (index.value < 0) {
      return
    }
    const item = list[index.value]
    index.value--
    return item
  }

  /**
   * Redoes last undone action.
   *
   * @returns {HistoryEntry}
   */
  function redo() {
    // Restores the stored buffer.
    if (index.value === list.length - 1) {
      return
    }
    index.value++
    const item = list[index.value]
    return item
  }

  return {
    canUndo,
    canRedo,
    list,
    index,
    add,
    undo,
    redo
  }
})

