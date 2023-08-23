import { v4 as uuid } from 'uuid'
import BlendMode from '@/pixel/enums/BlendMode.js'
import Canvas from '@/pixel/canvas/Canvas.js'

export const useLayersStore = defineStore('layers', () => {
  const current = ref(null)
  const list = reactive([])
  const settings = ref(null)

  function create({
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

  function duplicate({
    name: initialName,
    visible: initialVisible,
    blendMode: initialBlendMode,
    opacity: initialOpacity,
    canvas: initialCanvas,
    frames: initialFrames
  }) {
    const canvas = Canvas.duplicate(initialCanvas)
    const context = canvas.getContext('2d')
    const id = uuid()
    const name = ref(initialName)
    const visible = ref(initialVisible)
    const blendMode = ref(initialBlendMode)
    const opacity = ref(initialOpacity)
    const opacityPercentage = computed({
      get() {
        return opacity.value * 100
      },
      set(newValue) {
        opacity.value = newValue / 100
      }
    })
    const frames = shallowReactive(
      initialFrames.map(
        (imageData) =>
          new ImageData(imageData.width, imageData.height, imageData.data.slice())
      )
    )
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

  function add(options) {
    const created = shallowReactive(create(options))
    const index = list.findIndex(
      (currentLayer) => currentLayer.id === current.value.id
    )
    const newIndex = index + 1
    current.value = created
    if (newIndex === list.length) {
      list.push(created)
    } else {
      list.splice(newIndex, 0, created)
    }
  }

  function remove(layer) {
    const index = list.findIndex((currentLayer) => currentLayer.id === layer.id)
    if (index < 0) {
      throw new Error(`Layer with ${id} not found`)
    }
    const [removedLayer] = list.splice(index, 1)
  }

  /**
   *
   * @param {*} layer
   */
  function duplicate(layer) {
    const duplicated = shallowReactive(duplicate(layer))
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

  function set(layers) {
    list.length = 0
    layers.forEach((layer) => { add(layer) })
  }

  return {
    current,
    list,
    settings,
    set,
    add,
    remove,
    duplicate,
    swap,
    toggle,
    moveUp,
    moveDown
  }
})
