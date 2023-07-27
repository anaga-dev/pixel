import useEventListener from './useEventListener'

/**
 *
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isTextInputElement(element) {
  return ['INPUT', 'SELECT', 'TEXTAREA'].includes(element.nodeName)
}

/**
 * TODO: Una pequeña mejora a esto sería utilizar un árbol en el que se mapean las teclas
 * de la siguiente manera:
 *
 * <tecla clave> -> <función>
 *               -> <con shift> -> <función>
 *
 * @param {Map<Array<string>,Function>} bindings
 */
export function useKeyShortcuts(bindings, target) {
  useEventListener(target ?? globalThis, 'keydown', (e) => {
    // Si el elemento actual seleccionado es un <input>, <select> o <textarea>
    // entonces salimos de esta función.
    if (isTextInputElement(document.activeElement)) {
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
