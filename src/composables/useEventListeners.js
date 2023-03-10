import { onMounted, onBeforeUnmount } from 'vue'
import { addEventListeners } from './addEventListeners'
import { removeEventListeners } from './removeEventListeners'

/**
 * Escucha a todos los eventos que le indicamos.
 *
 * @param {HTMLElement} target
 * @param {Array<string>} types
 * @param {Function} callback
 */
export function useEventListeners(target, types, callback) {
  onMounted(() => addEventListeners(target, types, callback))
  onBeforeUnmount(() => removeEventListeners(target, types, callback))
}

export default useEventListeners
