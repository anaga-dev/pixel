
/**
 * Listens to an event.
 *
 * @param {EventTarget} target
 * @param {string} type
 * @param {Function} callback
 * @param {object} [options]
 */
export function useEventListener(target, type, callback, options) {
  onMounted(() => {
    const domTarget = unref(target)
    domTarget?.addEventListener(type, callback, options)
  })
  onBeforeUnmount(() => {
    const domTarget = unref(target)
    domTarget?.removeEventListener(type, callback)
  })
}

export default useEventListener
