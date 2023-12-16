import { v4 as uuid } from 'uuid'
import BlendMode from '@/pixel/enums/BlendMode.js'
import Canvas from '@/pixel/canvas/Canvas.js'

export const useLayersStore = defineStore('layers', () => {
  const current = ref(null)
  const list = reactive([])
  const settings = ref(null)

  function createLayer({
    name: initialName = 'Unnamed',
    visible: initialVisible = true,
    blendMode: initialBlendMode = BlendMode.NORMAL,
    opacity: initialOpacity = 1.0,
    canvas: initialCanvas = null,
    context: initialContext = null,
    frames: initialFrames = null,
    width,
    height
  } = {}) {
    const id = uuid()
    const name = ref(initialName)
    const visible = ref(initialVisible)
    const blendMode = ref(initialBlendMode)
    const opacity = ref(initialOpacity)
    const opacityPercentage = computed({
      get() {
        return Math.round(opacity.value * 100)
      },
      set(newValue) {
        opacity.value = newValue / 100
      }
    })
    const frames = shallowReactive(
      initialFrames ?? [new ImageData(width, height)]
    )
    const canvas = initialCanvas ?? Canvas.create(width, height)
    const context = initialContext ?? canvas.getContext('2d')
    return {
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
  }

  function duplicateLayer({
    name: initialName,
    visible: initialVisible,
    blendMode: initialBlendMode,
    opacity: initialOpacity,
    canvas: initialCanvas,
    frames: initialFrames
  }) {

    const id = uuid()
    const name = ref(`${initialName.value} (copy)`)
    const visible = ref(initialVisible.value)
    const blendMode = ref(initialBlendMode.value)
    const opacity = ref(initialOpacity.value)
    const opacityPercentage = computed({
      get() {
        return opacity.value * 100
      },
      set(newValue) {
        opacity.value = newValue / 100
      }
    })

    console.log('initialCanvas', initialCanvas)
    const canvas = Canvas.duplicate(initialCanvas)
    const context = canvas.getContext('2d')

    const frames = shallowReactive(
      initialFrames.map(
        (imageData) =>
          new ImageData(
            imageData.width,
            imageData.height,
            imageData.data.slice()
          )
      )
    )
    console.log('objeto', { id, name, visible, blendMode, opacity, canvas, context, frames })

    return {
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
  }

  /*   function duplicateLayer(layer) {
    let duplicatedLayer = {}

    for (let key in layer) {
      if (layer[key] instanceof RefImpl) {
        // Duplicar la 'ref'
        duplicatedLayer[key] = ref(layer[key].value)
      } else if (key === 'canvas') {
        // Duplicar el canvas
        const originalCanvas = layer[key]
        duplicatedLayer[key] = duplicateCanvas(originalCanvas)
      } else {
        // Para otras propiedades, copiar el valor directamente
        duplicatedLayer[key] = layer[key]
      }
    }
    return duplicatedLayer
  } */

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

  function addAt(index, layer) {
    list.splice(index, 0, layer)
    current.value = layer
    return { index, layer }
  }

  function remove(layer) {
    const index = list.findIndex((currentLayer) => currentLayer.id === layer.id)
    if (index < 0) {
      throw new Error(`Layer with ${id} not found`)
    }
    const [removedLayer] = list.splice(index, 1)
    return { index, layer: removedLayer }
  }

  function removeAt(index) {
    const [removedLayer] = list.splice(index, 1)
    return { index, layer: removedLayer }
  }

  /**
   *
   * @param {*} layer
   */
  function duplicate(layer) {
    const duplicated = shallowReactive(duplicateLayer(layer))
    console.log('duplicated', duplicated)
    const index = list.findIndex(
      (currentLayer) => currentLayer.id === current.id
    )
    current.value = duplicated
    list.splice(index, 0, duplicated)
    settings.value = null
    return { index, layer: duplicated }
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

  function set(layers) {
    list.length = 0
    console.log('set', layers)
    layers.forEach((layer) => {
      add(layer)
    })
  }

  return {
    current,
    list,
    settings,
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
