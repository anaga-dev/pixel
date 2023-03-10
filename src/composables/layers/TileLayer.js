import { v4 as uuid } from 'uuid'
import { ref } from 'vue'
import Canvas from '../../canvas/Canvas'

export function create({
  name: initialName = 'Unnamed',
  visible: initialVisible = true,
  width,
  height,
  tileWidth,
  tileHeight
} = {}) {
  const id = ref(uuid())
  const name = ref(initialName)
  const visible = ref(initialVisible)
  const data = new Uint32Array(width * height)
  const canvas = Canvas.create(width * tileWidth, height * tileHeight)
  const context = canvas.getContext('2d')
  return {
    id,
    name,
    visible,
    data,
    canvas,
    context
  }
}

export function duplicate({
  name: initialName,
  visible: initialVisible,
  data: initialData,
  width,
  height,
  tileWidth,
  tileHeight
}) {
  const id = ref(uuid())
  const name = ref(initialName)
  const visible = ref(initialVisible)
  const data = initialData.slice()
  const canvas = Canvas.create(width * tileWidth, height * tileHeight)
  const context = canvas.getContext('2d')
  return {
    id,
    name,
    visible,
    data,
    canvas,
    context
  }
}

export default {
  create,
  duplicate
}
