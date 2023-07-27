import { addEventListeners } from './addEventListeners'
import { removeEventListeners } from './removeEventListeners'

/**
 * Escucha a todos los eventos que le indicamos.
 *
 * @param {EventTarget} target
 * @param {Array<string>} types
 * @param {Function} callback
 * @param {Object} [options]
 */
export function useEventListeners(target, types, callback, options) {
  onMounted(() => {
    const domTarget = isRef(target) ? target.value : target
    addEventListeners(domTarget, types, callback, options)
  })
  onBeforeUnmount(() => {
    const domTarget = isRef(target) ? target.value : target
    removeEventListeners(domTarget, types, callback)
  })
}

export default useEventListeners
