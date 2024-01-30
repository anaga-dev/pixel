/**
 * useRequestAnimationFrame composable options
 *
 * @typedef {Object} UseRequestAnimationFrameOptions
 * @property {Function} [requestAnimationFrame=globalThis.requestAnimationFrame]
 * @property {Function} [cancelAnimationFrame=globalThis.cancelAnimationFrame]
 */

/**
 * useRequestAnimationFrame composable
 *
 * @param {Array<Function>} pipeline
 * @param {UseRequestAnimationFrameOptions} options
 */
export function useRequestAnimationFrame(pipeline, options) {
  const requestAnimationFrame = options?.requestAnimationFrame ?? globalThis.requestAnimationFrame
  const cancelAnimationFrame = options?.cancelAnimationFrame ?? globalThis.cancelAnimationFrame

  let frameId = null

  function onFrame(time) {
    pipeline.forEach((step) => step(time))
    frameId = requestAnimationFrame(onFrame)
  }

  onMounted(() => { frameId = requestAnimationFrame(onFrame)})
  onBeforeUnmount(() => { cancelAnimationFrame(frameId) })
}
