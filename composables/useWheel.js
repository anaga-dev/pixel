import { useEventListener } from '@/composables/useEventListener'

export function useWheel(callback, options) {
  const target = options?.target ?? globalThis
  console.log(target)
  useEventListener(target, 'wheel', (e) => callback(e))
}

export default useWheel
