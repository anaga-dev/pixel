import Canvas from '../canvas/Canvas.js'

/**
 * Draws a color picker on an offscreen canvas.
 *
 * @param {[number, number, number]} color
 * @returns {OffscreenCanvas|HTMLCanvasElement}
 */
export const drawOffscreenCanvas = (() => {
  const offscreenCanvas = Canvas.createOffscreen(512, 512)
  const gl = offscreenCanvas.getContext('webgl')
  if (!gl) {
    throw new Error('WebGL not supported')
  }

  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(
    vertexShader,
    `
  precision highp float;

  attribute vec2 a_coords;

  void main() {
    gl_Position = vec4(a_coords, 0.0, 1.0);
  }
  `
  )
  gl.compileShader(vertexShader)
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(vertexShader))
  }

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(
    fragmentShader,
    `
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
  `
  )
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

  const vertices = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1])

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  // gl.deleteBuffer(buffer)
  // gl.deleteProgram(program)
  // gl.deleteShader(fragmentShader)
  // gl.deleteShader(vertexShader)

  return function drawOffscreenCanvas([r, g, b]) {
    gl.viewport(0, 0, offscreenCanvas.width, offscreenCanvas.height)
    gl.useProgram(program)

    const colorLocation = gl.getUniformLocation(program, 'u_color')
    gl.uniform3f(colorLocation, r, g, b)

    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, gl.FALSE, 0, 0)

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)

    return offscreenCanvas
  }
})()

export default {
  drawOffscreenCanvas
}
