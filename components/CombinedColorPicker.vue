<template>
  <div class="CombinedColorPicker">
    <canvas ref="canvas" @pointermove="onPointer"></canvas>
    <div class="circle" :style="style"></div>
  </div>
</template>

<script setup>
import Canvas from '@/pixel/canvas/Canvas'
import Color from '@/pixel/color/Color'

const emit = defineEmits(['update'])

const props = defineProps({
  color: {
    type: Object,
    required: true
  }
})

const { value, valueSaturation, hue, saturation, lightness } = props.color

const lastCoords = reactive({ x: 0, y: 0 })
const canvas = ref()
const offscreenCanvas = Canvas.createOffscreen(512, 512)

/**
 * TODO: Reescribir esto para que no haya que recrear
 *       absolutamente todos los recursos del canvas.
 *
 * @param {*} param0
 */
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

  gl.deleteBuffer(buffer)
  gl.deleteProgram(program)
  gl.deleteShader(fragmentShader)
  gl.deleteShader(vertexShader)
}

/*
  top: `${ -(this.props.hsv.v * 100) + 100 }%`,
  left: `${ this.props.hsv.s * 100 }%`,
*/
const style = computed(() => ({
  top: `calc(${ -(value.value * 100) + 100 }%)`,
  left: `${ valueSaturation.value * 100 }%`,
}))

function updateCanvas(color) {
  drawOffscreenCanvas(color)
  const context = canvas.value.getContext('2d', {
    willReadFrequently: true
  })
  context.drawImage(offscreenCanvas, 0, 0, context.canvas.width, context.canvas.height)
}

function updateFromPixel(x, y) {
  const context = canvas.value.getContext('2d', {
    willReadFrequently: true
  })
  const imageData = context.getImageData(x, y, 1, 1)
  const [r, g, b] = imageData.data
  const extractedColor = Color.fromRGBA(r, g, b)
  saturation.value = Color.saturation(extractedColor) * 100
  lightness.value = Color.lightness(extractedColor) * 100
}

function getOffsetCoordinates(event, element) {
  const source = element ?? event.currentTarget
  const { left, top, width, height } = source.getBoundingClientRect()
  return {
    x: Math.max(0, Math.min(width - 3, event.clientX - left)),
    y: Math.max(0, Math.min(height - 3, event.clientY - top))
  }
}

function onPointer(e) {
  if (!e.pressure) {
    return
  }
  const { x, y } = getOffsetCoordinates(e, canvas.value)
  lastCoords.x = x
  lastCoords.y = y
  updateFromPixel(x, y)
}

watch(() => hue.value, () => updateCanvas(Color.fromHSLA(hue.value, 100, 50, 1)))

onMounted(() => {
  Canvas.resize(canvas.value)
  updateCanvas(Color.fromHSLA(hue.value, 100, 50, 1))
})
</script>

<style scoped>
.CombinedColorPicker {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
}

canvas {
  width: 100%;
  height: 100%;
}

.circle {
  position: absolute;
  width: var(--spaceM);
  height: var(--spaceM);
  border-radius: 100%;
  transform: translate(-50%, -50%);
  box-shadow:
    0 0 0 1px hsl(0, 0%, 100%),
    0 0 0 2px hsl(0, 0%, 0%);
}
</style>
