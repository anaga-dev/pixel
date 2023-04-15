let element = null, handler = null

function onPointer(e) {
  if (!handler) {
    return
  }

  if (!element.contains(e.target)) {
    return handler(e)
  }
}

export const outsideDirective = {
  mounted(el, binding) {
    element = el
    handler = binding.value
    document.addEventListener('pointerdown', onPointer)
  },
  unmounted() {
    element = null
    document.removeEventListener('pointerdown', onPointer)
  }
}

export default outsideDirective
