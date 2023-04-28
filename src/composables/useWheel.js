import { useEventListener } from '@/composables/useEventListener'

export function useWheel(callback, { target = window } = {}) {
  console.log(target)
  useEventListener(target, 'wheel', (e) => callback(e))
}

export default useWheel
