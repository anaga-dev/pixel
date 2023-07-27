
/**
 * Escucha un evento.
 *
 * @param {EventTarget} target
 * @param {string} type
 * @param {Function} callback
 * @param {object} [options]
 */
export function useEventListener(target, type, callback, options) {
  onMounted(() => {
    const domTarget = isRef(target) ? target.value : target
    domTarget.addEventListener(type, callback, options)
  })
  onBeforeUnmount(() => {
    const domTarget = isRef(target) ? target.value : target
    domTarget.removeEventListener(type, callback)
  })
}

export default useEventListener
