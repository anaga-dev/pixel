import { useEventListener } from '@/composables/useEventListener'

export function useDoubleClick(callback, options) {
  const target = options?.target ?? globalThis
  let previousClickTime = 0
  useEventListener(target, 'click', (e) => {
    const currentTime = new Date().getTime()
    const diffTime = currentTime - previousClickTime

    if (diffTime < 300) {
      // Double click detected
      callback(e)
    }

    previousClickTime = currentTime
  })
}

export default useDoubleClick
