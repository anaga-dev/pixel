/**
 * Actions history.
 */
export const useHistoryStore = defineStore('history', () => {
  const MAX_HISTORY = 2048
  const list = reactive([])
  const index = ref(-1)
  const canUndo = computed(() => index.value >= 0 && list.length > 0)
  const canRedo = computed(() => index.value < list.length - 1)

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

    // Eliminamos todos los elementos por la cabecera del historial
    // si superamos el número de undos.
    if (list.length > MAX_HISTORY) {
      const count = list.length - MAX_HISTORY
      list.splice(0, count)
    }
    // Actualizamos el index de la historia automáticamente.
    index.value = list.length - 1
  }

  /**
   * Deshace la última acción realizada.
   *
   * @returns {HistoryEntry}
   */
  function undo() {
    // guardamos la información de la acción que hemos realizado
    // y una copia del buffer que estabamos modificando.
    if (index.value < 0) {
      return
    }
    const item = list[index.value]
    index.value--
    return item
  }

  /**
   * Rehace la última acción deshecha.
   *
   * @returns {HistoryEntry}
   */
  function redo() {
    // restauramos el buffer almacenado.
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

