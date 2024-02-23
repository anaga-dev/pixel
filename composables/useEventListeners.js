import { addEventListeners } from './addEventListeners'
import { removeEventListeners } from './removeEventListeners'

/**
 * Listens to all the events specified.
 *
 * @param {EventTarget} target
 * @param {Array<string>} types
 * @param {Function} callback
 * @param {Object} [options]
 */
export function useEventListeners(target, types, callback, options) {
  onMounted(() => {
    const domTarget = unref(target)
    addEventListeners(domTarget, types, callback, options)
  })
  onBeforeUnmount(() => {
    const domTarget = unref(target)
    removeEventListeners(domTarget, types, callback)
  })
}

export default useEventListeners
