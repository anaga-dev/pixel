import { onMounted, onBeforeUnmount } from 'vue'

export function useRequestAnimationFrame(pipeline) {
  let frameId = null
  function onFrame(time) {
    pipeline.forEach((step) => step(time))
    frameId = requestAnimationFrame(onFrame)
  }
  onMounted(() => { frameId = requestAnimationFrame(onFrame)})
  onBeforeUnmount(() => { cancelAnimationFrame(frameId) })
}
