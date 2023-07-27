
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
