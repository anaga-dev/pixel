const ClickOutsideDirective = {
  mounted(el, binding) {
    el.clickOutside = (e) => {
      if (!(el == e.target || el.contains(e.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutside)
    delete el.clickOutside
  }
}

export default ClickOutsideDirective