import { isRef, onMounted, onBeforeUnmount } from 'vue'

export function useWheel(callback, target = window) {
  onMounted(() => {
    if (isRef(target)) {
      target.value.addEventListener('wheel', (e) => callback(e))
    } else {
      target.addEventListener('wheel', (e) => callback(e))
    }
  })
  onBeforeUnmount(() => {
    if (isRef(target)) {
      target.value.removeEventListener('wheel', (e) => callback(e))
    } else {
      target.removeEventListener('wheel', (e) => callback(e))
    }
  })
}

export default useWheel
