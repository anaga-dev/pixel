export function useLayers({ layer = null, layers = [], Layer } = {}) {
  if (Layer === undefined && typeof Layer !== 'function') {
    throw new Error('Invalid Layer type')
  }

  const current = ref(layer)
  const list = reactive(layers)
  const settings = ref(null)

  function add(options) {
    const created = shallowReactive(Layer.create(options))
    const index = list.findIndex(
      (currentLayer) => currentLayer.id === current.value.id
    )
    const newIndex = index + 1
    console.log(index, newIndex)
    current.value = created
    if (newIndex === list.length) {
      list.push(created)
    } else {
      list.splice(newIndex, 0, created)
    }
  }

  function remove(layer) {
    const index = list.findIndex(
      (currentLayer) => currentLayer.id === layer.id
    )
    if (index < 0) {
      throw new Error(`Layer with ${id} not found`)
    }
    const [removedLayer] = list.splice(index, 1)
    console.log(removedLayer)
  }

  /**
   *
   * @param {*} layer
   */
  function duplicate(layer) {
    const duplicated = shallowReactive(Layer.duplicate(layer))
    const index = list.findIndex(
      (currentLayer) => currentLayer.id === current.id
    )
    current.value = duplicated
    list.splice(index, 0, duplicated)
    settings.value = null
  }

  function swap(fromIndex, toIndex) {
    const [fromLayer] = list.splice(fromIndex, 1)
    list.splice(toIndex, 0, fromLayer)
  }

  function toggle(layer) {
    layer.visible.value = !layer.visible.value
  }

  function moveUp() {
    const index = list.findIndex((layer) => layer === layer)
    if (index < 0) {
      throw new Error('Cannot find layer index')
    }
    const [removed] = list.splice(index, 1)
    list.splice(index + 1, 0, removed)
  }

  function moveDown() {
    const index = list.findIndex((layer) => layer === layer)
    if (index < 0) {
      throw new Error('Cannot find layer index')
    }
    const [removed] = list.splice(index, 1)
    list.splice(index - 1, 0, removed)
  }

  return {
    current,
    list,
    settings,
    add,
    remove,
    duplicate,
    swap,
    toggle,
    moveUp,
    moveDown
  }
}
