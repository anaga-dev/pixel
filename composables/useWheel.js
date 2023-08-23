import { useEventListener } from '@/composables/useEventListener'

export function useWheel(callback, options) {
  const target = options?.target ?? globalThis
  useEventListener(target, 'wheel', (e) => callback(e))
}

export default useWheel
