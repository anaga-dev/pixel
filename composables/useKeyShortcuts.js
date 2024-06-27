import useEventListener from './useEventListener'

/**
 *
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isTextInputElement(element) {
  return ['INPUT', 'SELECT', 'TEXTAREA'].includes(element.nodeName)
}

function isClipboardEvent(e) {
  if (e.ctrlKey && ['v','c','x'].includes(e.key)) {
    return true
  }
  return false
}

/**
 * TODO: Could be improved a bit using a tree with mapped keys like this:
 *
 * <key> -> <function>
 *               -> <shift> -> <function>
 *
 * @param {Map<Array<string>,Function>} bindings
 */
export function useKeyShortcuts(bindings, target) {
  useEventListener(target ?? globalThis, 'keydown', (e) => {
    // If the current selected element is <input>, <select> or <textarea>
    // this function is stopped.
    if (isTextInputElement(document.activeElement)
     || isClipboardEvent(e)) {
      return
    }

    for (const [binding, callback] of bindings) {
      const [key, ...modifiers] = binding
      if (e.key.toLowerCase() === key) {
        if (modifiers.every((modifier) => e[`${modifier}Key`])) {
          e.preventDefault()
          callback(e)
          break
        }
      }
    }
  })
}

export default useKeyShortcuts
