import { reactive, watchEffect } from 'vue'

const clickOutsideDirective = {
  mounted(el, binding) {
    const state = reactive({
      isDragging: false,
      isOpen: false
    })

    const onMouseDown = () => {
      state.isDragging = true
    }

    const onMouseUp = () => {
      state.isDragging = false
    }

    const onOpen = () => {
      state.isOpen = true    
    }

    const onClickOutside = (event) => {
      const { target } = event

      if (!state.isOpen) {
        state.isOpen = true
        return
      }

      if (!el.contains(target) && !state.isDragging) {
        state.isOpen = false
        binding.value()
      }
    }

    el.addEventListener('click', onOpen)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)

    watchEffect(() => {
      if (binding.arg === 'touch') {
        document.addEventListener('touchstart', onMouseDown)
        document.addEventListener('touchend', onMouseUp)
      }

      document.addEventListener('click', onClickOutside)
    })

    el._clickOutside = {
      onMouseDown,
      onMouseUp,
      onOpen,
      onClickOutside,
      onOpen
    }
  },

  updated(el, binding) {
    el._clickOutside.onClickOutside = (event) => {
      const { target } = event

      if (!el.contains(target) && !el._clickOutside.isDragging) {
        binding.value()
      }
    }
  },

  unmounted(el) {
    const { onMouseDown, onMouseUp, onClickOutside, onOpen } = el._clickOutside

    el.removeEventListener('click', onOpen)
    document.removeEventListener('mousedown', onMouseDown)
    document.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('touchstart', onMouseDown)
    document.removeEventListener('touchend', onMouseUp)
    document.removeEventListener('click', onClickOutside)
  }
}

export default clickOutsideDirective

/*
import { onUnmounted } from 'vue';

export default {
  mounted(el, binding) {
    let isOpen = false;

    const handleClick = (event) => {
      if (isOpen) {
        // si el elemento está abierto, ignorar el primer evento de clic
        isOpen = false;
        return;
      }

      if (el.contains(event.target)) {
        return;
      }

      isOpen = false;
      binding.value();
    };

    const handleOpen = () => {
      isOpen = true;
    };

    el.addEventListener('click', handleOpen);

    document.addEventListener('click', handleClick);

    onUnmounted(() => {
      el.removeEventListener('click', handleOpen);
      document.removeEventListener('click', handleClick);
    });
  },
};
*/