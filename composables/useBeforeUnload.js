export function useBeforeUnload(when, ask) {
  window.onbeforeunload = function onBeforeUnload(e) {
    const shouldAsk = typeof when === 'function' ? when() : when
    if (shouldAsk) {
      const message = typeof ask === 'function' ? ask() : ask
      e.returnValue = message
      return message
    }
  }
}

export default useBeforeUnload
