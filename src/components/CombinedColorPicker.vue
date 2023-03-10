<template>
  <div class="combined-color-picker">
    <canvas ref="canvas" @pointerdown="onDown"></canvas>
    <div class="circle" :style="getStyle()"></div>
  </div>
</template>

<script setup>
import Canvas from '../canvas/Canvas'
import Range from '../math/Range'
import Color from '../color/Color'
import { onMounted, watch, reactive, ref } from 'vue'

function getOffsetCoordinates(event, element) {
  const source = element ?? event.currentTarget
  const { left, top, width, height } = source.getBoundingClientRect()
  return {
    x: Math.max(0, Math.min(width - 3, event.clientX - left)),
    y: Math.max(0, Math.min(height - 3, event.clientY - top))
  }
}

const props = defineProps({
  hue: {
    type: Number,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  }
})

// TODO: Hacer un `useColor` que lo que retorne sean unos refs
// que al cambiar el ref principal varíe los valores de red, green, blue
// lightness, saturation o hue.

const emit = defineEmits(['update:modelValue'])

const lastCoords = reactive({ x: 0, y: 0 })
const canvas = ref()
const offscreenCanvas = new OffscreenCanvas(512, 512)

function drawOffscreenCanvas([r, g, b]) {
  /**
   * @type {WebGLRenderingContext}
   */
  const gl = offscreenCanvas.getContext('webgl')

  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertexShader, `
  precision highp float;

  attribute vec2 a_coords;

  void main() {
    gl_Position = vec4(a_coords, 0.0, 1.0);
  }
  `)
  gl.compileShader(vertexShader)
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(vertexShader))
  }

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader, `
  precision highp float;

  uniform vec3 u_color;

  void main() {
    vec2 canvas_position = gl_FragCoord.xy / 512.0;
    vec3 color = mix(
      mix(
        vec3(1.0, 1.0, 1.0),
        u_color,
        canvas_position.x
      ),
      vec3(0.0, 0.0, 0.0),
      1.0 - canvas_position.y
    );
    gl_FragColor = vec4(color, 1.0);
  }
  `)
  gl.compileShader(fragmentShader)
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(fragmentShader))
  }

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program))
  }

  gl.viewport(0, 0, offscreenCanvas.width, offscreenCanvas.height)

  gl.useProgram(program)

  const colorLocation = gl.getUniformLocation(program, 'u_color')
  gl.uniform3f(colorLocation, r, g, b)

  const vertices = new Float32Array([
    -1, -1,
    1, -1,
    1, 1,
    -1, 1,
  ])

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, gl.FALSE, 0, 0)

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
}

/*
  top: `${ -(this.props.hsv.v * 100) + 100 }%`,
  left: `${ this.props.hsv.s * 100 }%`,
*/
function getStyle() {
  const parsedColor = Color.parse(props.modelValue)
  const value = Color.max(parsedColor)
  const saturation = Color.saturationHSV(parsedColor)
  return {
    top: `calc(${ -(value * 100) + 100 }% - 8px)`,
    left: `${ saturation * 100 }%`,
  }
}

// TODO: Ver cómo convertir esto en composables

function updateCanvas(color) {
  drawOffscreenCanvas(color)
  const context = canvas.value.getContext('2d')
  context.drawImage(offscreenCanvas, 0, 0, context.canvas.width, context.canvas.height)
}

function onMove(e) {
  const { x, y } = getOffsetCoordinates(e, canvas.value)
  lastCoords.x = x
  lastCoords.y = y
  const context = canvas.value.getContext('2d')
  const imageData = context.getImageData(x, y, 1, 1)
  const [r, g, b] = imageData.data
  emit('update:modelValue', `rgb(${r}, ${g}, ${b})`)
}

function onUp(e) {
  const { x, y } = getOffsetCoordinates(e, canvas.value)
  lastCoords.x = x
  lastCoords.y = y
  const context = canvas.value.getContext('2d')
  const imageData = context.getImageData(x, y, 1, 1)
  const [r, g, b] = imageData.data
  emit('update:modelValue', `rgb(${r}, ${g}, ${b})`)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
}

function onDown(e) {
  const { x, y } = getOffsetCoordinates(e)
  lastCoords.x = x
  lastCoords.y = y
  const context = canvas.value.getContext('2d')
  const imageData = context.getImageData(x, y, 1, 1)
  const [r, g, b] = imageData.data
  emit('update:modelValue', `rgb(${r}, ${g}, ${b})`)
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}

watch(() => props.hue, (hue) => {
  updateCanvas(Color.fromHSLA(hue, 100, 50, 1))
  const { x, y } = lastCoords
  const context = canvas.value.getContext('2d')
  const imageData = context.getImageData(x, y, 1, 1)
  const [r, g, b] = imageData.data
  emit('update:modelValue', `rgb(${r}, ${g}, ${b})`)
})

onMounted(() => {
  Canvas.resize(canvas.value)
  updateCanvas(Color.fromHSLA(props.hue, 100, 50, 1))
})
</script>

<style scoped>
.combined-color-picker {
  aspect-ratio: 1 / 1;
  width: 100%;
  height: auto;
  position: relative;
}

canvas {
  width: 100%;
  height: 100%;
}

.circle {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 100%;
  box-shadow:
    0 0 0 1px hsl(0, 0%, 100%),
    0 0 0 2px hsl(0, 0%, 0%);
}
</style>
