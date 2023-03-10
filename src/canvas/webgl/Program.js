/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 * @returns {WebGLProgram}
 */
export function create(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program))
  }
  return program
}

export function destroy(gl, program, destroyShaders = false) {
  let shaders = null
  if (destroyShaders) {
    shaders = gl.getAttachedShaders(program)
  }
  gl.deleteProgram(program)
  if (shaders) {
    shaders.forEach((shader) => gl.deleteShader(shader))
  }
}
