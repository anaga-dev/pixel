/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {number} type
 * @param {string} source
 * @returns {WebGLShader}
 */
export function create(gl, type, source) {
  const shader = gl.create(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog())
  }
  return shader
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} source
 * @returns {WebGLShader}
 */
export function createVertex(gl, source) {
  return create(gl, gl.VERTEX_SHADER, source)
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {string} source
 * @returns {WebGLShader}
 */
export function createFragment(gl, source) {
  return create(gl, gl.FRAGMENT_SHADER, source)
}

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} shader
 */
export function destroy(gl, shader) {
  gl.deleteShader(shader)
}

export default {
  create,
  createVertex,
  createFragment,
  destroy
}
