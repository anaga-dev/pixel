/**
 *
 * @param {number} width
 * @param {number} height
 * @param {string} contextId
 * @param {object} contextAttributes
 * @returns {CanvasRenderingContext2D|WebGLRenderingContext|WebGL2RenderingContext}
 */
export function create(width, height, contextId, contextAttributes) {
  const canvas = Canvas.create(width, height)
  return canvas.getContext(contextId, contextAttributes)
}

export default {
  create
}
