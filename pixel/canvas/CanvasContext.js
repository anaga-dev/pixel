import Canvas from './Canvas.js'

/**
 * Returns a canvas context.
 *
 * @param {HTMLCanvasElement|OffscreenCanvas} canvas
 * @param {'2d'|'webgl'|'webgl2'|'experimental-webgl'|'experimental-webgl2'} contextId
 * @param {CanvasRenderingContext2DSettings|WebGLContextAttributes} [contextAttributes]]
 * @returns {CanvasRenderingContext2D|WebGLRenderingContext|WebGL2RenderingContext}
 */
export function get(canvas, contextId, contextAttributes) {
  const context = canvas.getContext(contextId, contextAttributes)
  if (!context) {
    throw new Error(`Cannot create "${contextId}" context.`)
  }
  return context
}

/**
 * Creates a canvas context.
 *
 * @param {number} width
 * @param {number} height
 * @param {'2d'|'webgl'|'webgl2'|'experimental-webgl'|'experiemntal-webgl2'} contextId
 * @param {CanvasRenderingContext2DSettings|WebGLContextAttributes} [contextAttributes]
 * @returns {CanvasRenderingContext2D|WebGLRenderingContext|WebGL2RenderingContext}
 */
export function create(width, height, contextId, contextAttributes) {
  return get(Canvas.create(width, height), contextId, contextAttributes)
}

/**
 * Creates a canvas context (if OffscreenCanvas is available, it will be an
 * offscreen canvas).
 *
 * @param {number} width
 * @param {number} height
 * @param {'2d'|'webgl'|'webgl2'|'experimental-webgl'|'experimental-webgl2'} contextId
 * @param {CanvasRenderingContext2DSettings|WebGLContextAttributes} contextAttributes
 * @returns {CanvasRenderingContext2D|WebGLRenderingContext|WebGL2RenderingContext|OffscreenCanvasRenderingContext2D|OffscreenCanvasRenderingContextWebGL|OffscreenCanvasRenderingContextWebGL2}
 */
export function createOffscreen(width, height, contextId, contextAttributes) {
  return get(Canvas.createOffscreen(width, height), contextId, contextAttributes)
}

export default {
  get,
  create,
  createOffscreen,
}
