import { v4 as uuid } from 'uuid'
import BlendMode from '@/pixel/enums/BlendMode.js'
import Canvas from '@/pixel/canvas/Canvas.js'
import isSize from '../pixel/validation/isSize'

/**
 * Creates a Layer
 *
 * @param {CreateLayerOptions} options
 * @returns {Layer}
 */
export function createLayer(options) {
  const id = uuid()
  const width = options.width
  const height = options.height
  if (!isSize(width)
   || !isSize(height)) {
    throw new Error('Invalid layer size')
  }
  const name = shallowRef(options?.name ?? 'Layer')
  const visible = shallowRef(options?.visible ?? true)
  const blendMode = shallowRef(options?.blendMode ?? BlendMode.NORMAL)
  const opacity = shallowRef(options?.opacity ?? 1)
  const opacityPercentage = computed({
    get() {
      return Math.round(opacity.value * 100)
    },
    set(newValue) {
      opacity.value = newValue / 100
    }
  })
  const frames = shallowReactive(
    options?.frames ?? [markRaw(new ImageData(width, height))]
  )
  const canvas = markRaw(options?.canvas ?? Canvas.create(width, height))
  const context = markRaw(canvas.getContext('2d'))

  const newLayer = {
    id,
    name,
    visible,
    blendMode,
    opacity,
    opacityPercentage,
    frames,
    canvas,
    context
  }

  return newLayer
}

/**
 * Duplicates a layer.
 *
 * @param {Layer} layer
 * @returns {Layer}
 */
export function duplicateLayer(layer) {
  return createLayer({
    width: layer.canvas.width,
    height: layer.canvas.height,
    name: `${unref(layer.name)} (copy)`,
    visible: unref(layer.visible),
    blendMode: unref(layer.blendMode),
    opacity: unref(layer.opacity),
    canvas: Canvas.clone(layer.canvas),
    frames: unref(layer.frames).map(
      imageData => markRaw(
        new ImageData(
          imageData.data.slice(),
          imageData.width,
          imageData.height
        )
      )
    )
  })
}

/**
 * Store de Layers
 */
export const useLayersStore = defineStore('layers', () => {
  const current = ref(null)
  const list = reactive([])
  const settings = ref(null)

  /**
   * Adds a new layer to the layer list.
   *
   * @param {LayerOptions} options
   * @returns {AddLayerResult}
   */
  function add(options) {
    const created = shallowReactive(createLayer(options))
    const index = list.findIndex(
      (currentLayer) => currentLayer.id === current.value.id
    )
    const newIndex = index - 1
    current.value = created
    if (newIndex === -1) {
      list.splice(0, 0, created)
    } else {
      list.splice(newIndex, 0, created)
    }
    return { index: newIndex, layer: created }
  }

  /**
   * Add a new layer at a specified index.
   *
   * @param {number} index
   * @param {Layer} layer
   * @returns {AddLayerResult}
   */
  function addAt(index, layer) {
    list.splice(index, 0, layer)
    current.value = layer
    return { index, layer }
  }

  /**
   * Removes a layer.
   *
   * @param {Layer} layer
   * @returns {RemoveLayerResult}
   */
  function remove(layer) {
    const index = list.findIndex((currentLayer) => currentLayer.id === layer.id)
    if (index < 0) {
      throw new Error(`Layer with ${id} not found`)
    }
    const [removedLayer] = list.splice(index, 1)
    return { index, layer: removedLayer }
  }

  /**
   * Removes a layer at a specified index.
   *
   * @param {number} index
   * @returns {RemoveLayerResult}
   */
  function removeAt(index) {
    const [removedLayer] = list.splice(index, 1)
    return { index, layer: removedLayer }
  }

  /**
   * Duplicates a layer
   *
   * @param {Layer} layer
   * @returns {DuplicateLayerResult}
   */
  function duplicate(layer) {
    const duplicated = shallowReactive(duplicateLayer(layer))
    const index = list.findIndex(
      (currentLayer) => currentLayer.id === current.id
    )
    current.value = duplicated
    list.splice(index, 0, duplicated)
    settings.value = null
    return { index, layer: duplicated }
  }

  /**
   * Swaps to layers
   *
   * @param {number} fromIndex
   * @param {number} toIndex
   */
  function swap(fromIndex, toIndex) {
    const [fromLayer] = list.splice(fromIndex, 1)
    list.splice(toIndex, 0, fromLayer)
  }

  /**
   * Toggles layer visibility.
   *
   * @param {Layer} layer
   */
  function toggle(layer) {
    layer.visible.value = !layer.visible.value
  }

  /**
   * Moves the currently selected layer up.
   */
  function moveUp() {
    const index = list.findIndex((layer) => layer === layer)
    if (index < 0) {
      throw new Error('Cannot find layer index')
    }
    const [removed] = list.splice(index, 1)
    list.splice(index + 1, 0, removed)
  }

  /**
   * Moves the currently selected layer down.
   */
  function moveDown() {
    const index = list.findIndex((layer) => layer === layer)
    if (index < 0) {
      throw new Error('Cannot find layer index')
    }
    const [removed] = list.splice(index, 1)
    list.splice(index - 1, 0, removed)
  }

  /**
   * Sets layer list to the specified one.
   *
   * @param {Array<Layer>} layers
   */
  function set(layers) {
    list.length = 0
    layers.forEach(layer => add(layer))
  }

  /**
   * Clears the layers list
   */
  function clear() {
    list.splice(0, list.length)
  }

  return {
    current,
    list,
    settings,
    clear,
    set,
    add,
    addAt,
    remove,
    removeAt,
    duplicate,
    swap,
    toggle,
    moveUp,
    moveDown
  }
})
