import { v4 as uuid } from 'uuid'
import { ref, shallowReactive } from 'vue'
import BlendMode from '../../enums/BlendMode'
import Canvas from '../../canvas/Canvas'

export function create({
  name: initialName = 'Unnamed',
  visible: initialVisible = true,
  blendMode: initialBlendMode = BlendMode.NORMAL,
  opacity: initialOpacity = 1.0,
  width,
  height
} = {}) {
  const id = ref(uuid())
  const name = ref(initialName)
  const visible = ref(initialVisible)
  const blendMode = ref(initialBlendMode)
  const opacity = ref(initialOpacity)
  const frames = shallowReactive([new ImageData(width, height)])
  const canvas = Canvas.create(width, height)
  const context = canvas.getContext('2d')
  return {
    id,
    name,
    visible,
    blendMode,
    opacity,
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
  const id = ref(uuid())
  const name = ref(initialName)
  const visible = ref(initialVisible)
  const blendMode = ref(initialBlendMode)
  const opacity = ref(initialOpacity)
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
    frames,
    canvas,
    context
  }
}

export default {
  create,
  duplicate
}
