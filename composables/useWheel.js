import { useEventListener } from '@/composables/useEventListener'

export function useWheel(callback, options) {
  const target = options?.domTarget ?? window
  useEventListener(target, 'wheel', (e) => callback(e))
}

export default useWheel
