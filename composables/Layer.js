import { v4 as uuid } from 'uuid'
import BlendMode from '@/pixel/enums/BlendMode'
import Canvas from '@/pixel/canvas/Canvas'

export function create({
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
  const frames = shallowReactive(initialFrames ?? [new ImageData(width, height)])
  const canvas = initialCanvas ?? Canvas.create(width, height)
  const context = initialContext ?? canvas.getContext('2d')
  console.log(frames,canvas,context)
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

export function duplicate({
  name: initialName,
  visible: initialVisible,
  blendMode: initialBlendMode,
  opacity: initialOpacity,
  canvas: initialCanvas,
  frames: initialFrames,
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

export default {
  create,
  duplicate
}
