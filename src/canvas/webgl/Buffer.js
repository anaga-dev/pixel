export function create(gl, data, target, usage) {
  const buffer = gl.createBuffer()
  gl.bindBuffer(target, buffer)
  gl.bufferData(target, data, usage)
  gl.bindBuffer(target, null)
}

export function destroy(gl, buffer) {
  gl.deleteBuffer(buffer)
}
