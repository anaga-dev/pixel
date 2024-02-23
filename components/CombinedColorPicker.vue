<template>
  <div class="CombinedColorPicker">
    <canvas
      ref="canvas"
      draggable="false"
      @pointerdown="startDragging"
    />
    <div
      class="sample"
      :style="style"
    />
  </div>
</template>

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

const { value, valueSaturation, hue, saturation, lightness } = props.color

const canvas = ref()
const context = computed(() => canvas.value.getContext('2d', {
  willReadFrequently: true
}))

/*
  top: `${ -(this.props.hsv.v * 100) + 100 }%`,
  left: `${ this.props.hsv.s * 100 }%`,
*/
const style = computed(() => ({
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
}

function updateFromPixel(x, y) {
  const imageData = context.value.getImageData(x, y, 1, 1)
  const [r, g, b] = imageData.data
  const extractedColor = Color.fromRGBA(r, g, b)
  saturation.value = Color.saturation(extractedColor) * 100
  lightness.value = Color.lightness(extractedColor) * 100
}

const boundingClientRect = computed(() => canvas.value.getBoundingClientRect())

function getOffsetCoordinates(event) {
  // const source = element ?? event.currentTarget
  const { left, top, width, height } = boundingClientRect.value // source.getBoundingClientRect()
  const x = Math.max(0, Math.min(width - 1, event.clientX - left))
  const y = Math.max(0, Math.min(height - 1, event.clientY - top))
  return {
    x,
    y
  }
}

function startDragging(e) {
  const { x, y } = getOffsetCoordinates(e, canvas.value)
  updateFromPixel(x, y)
  window.addEventListener('pointermove', updateColor)
  window.addEventListener('pointerup', stopDragging, { once: true })
  window.addEventListener('pointerleave', stopDragging, { once: true })
}

function updateColor(e) {
  const { x, y } = getOffsetCoordinates(e, canvas.value)
  updateFromPixel(x, y)
}

function stopDragging() {
  window.removeEventListener('pointermove', updateColor)
  window.removeEventListener('pointerup', stopDragging)
  window.removeEventListener('pointerleave', stopDragging)
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

<style scoped>
.CombinedColorPicker {
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
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 2px hsl(0, 0%, 100%), 0 0 0 4px hsl(0, 0%, 0%);
}
</style>
