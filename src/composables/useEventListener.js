import { onMounted, onBeforeUnmount } from 'vue'

export function useEventListener(target, type, callback) {
  onMounted(() => target.addEventListener(type, callback))
  onBeforeUnmount(() => target.removeEventListener(type, callback))
}

export default useEventListener
