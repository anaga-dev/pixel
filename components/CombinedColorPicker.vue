<script setup>
import Canvas from '@/pixel/canvas/Canvas'
import Color from '@/pixel/color/Color'
import CombinedColorPicker from '@/pixel/color/CombinedColorPicker'

const props = defineProps({
  color: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['update'])

const { value, valueSaturation, hue, saturation, lightness, style } = props.color

const canvas = ref()

let offsetX = 0
let offsetY = 0
let imageData = null

const context = computed(() => canvas.value.getContext('2d', {
  willReadFrequently: true
}))

/*
  top: `${ -(this.props.hsv.v * 100) + 100 }%`,
  left: `${ this.props.hsv.s * 100 }%`,
*/
const computedStyle = computed(() => ({
  top: `calc(${-(value.value * 100) + 100}%)`,
  left: `${valueSaturation.value * 100}%`
}))

function updateCanvas(color) {
  context.value.drawImage(
    CombinedColorPicker.drawOffscreenCanvas(color),
    0,
    0,
    context.value.canvas.width,
    context.value.canvas.height
  )
  imageData = context.value.getImageData(
    0, 0, context.value.canvas.width, context.value.canvas.height
  )
}

function updateFromPixel(x, y) {
  const offset = (y * imageData.width + x) * 4
  const r = imageData.data[offset + 0]
  const g = imageData.data[offset + 1]
  const b = imageData.data[offset + 2]
  const extractedColor = Color.fromRGBA(r, g, b)
  saturation.value = Color.saturation(extractedColor) * 100
  lightness.value = Color.lightness(extractedColor) * 100
}

const boundingClientRect = computed(() => canvas.value.getBoundingClientRect())

function updateOffsetCoordinates(e) {
  const { left, top } = boundingClientRect.value // source.getBoundingClientRect()
  offsetX = Math.floor(Math.max(0, Math.min(canvas.value.width - 1, e.clientX - left)))
  offsetY = Math.floor(Math.max(0, Math.min(canvas.value.height - 1, e.clientY - top)))
}

function startDragging(e) {
  updateOffsetCoordinates(e, canvas.value)
  updateFromPixel(offsetX, offsetY)
  window.addEventListener('pointermove', updateColor)
  window.addEventListener('pointerup', stopDragging, { once: true })
  window.addEventListener('pointerleave', stopDragging, { once: true })
}

function updateColor(e) {
  updateOffsetCoordinates(e, canvas.value)
  updateFromPixel(offsetX, offsetY)
}

function stopDragging(e) {
  window.removeEventListener('pointermove', updateColor)
  window.removeEventListener('pointerup', stopDragging)
  window.removeEventListener('pointerleave', stopDragging)
  if (e.type === 'pointerup') {
    emit('update', style.value)
  }
}

watch(
  () => hue.value,
  () => updateCanvas(Color.fromHSLA(hue.value, 100, 50, 1))
)

onMounted(() => {
  Canvas.resize(canvas.value)
  updateCanvas(Color.fromHSLA(hue.value, 100, 50, 1))
})
</script>

<template>
  <div class="CombinedColorPicker">
    <canvas
      ref="canvas"
      draggable="false"
      @pointerdown="startDragging"
    />
    <div
      class="sample"
      :style="computedStyle"
    />
  </div>
</template>

<style scoped>
.CombinedColorPicker {
  user-select: none;
  display: block;
  width: 100%;
  position: relative;
  overflow: hidden;
}

canvas {
  width: 100%;
  height: 100%;
}

.sample {
  position: absolute;
  width: 8px;
  height: 8px;
  pointer-events: none;
  user-select: none;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 2px hsl(0, 0%, 100%), 0 0 0 4px hsl(0, 0%, 0%);
}
</style>
