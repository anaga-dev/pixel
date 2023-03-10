<template>
  <div
    class="frame"
    :class="{ active: props.active }"
    ref="preview">
    <!-- Inyectamos el fotograma -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import useElement from '../composables/useElement'

const preview = ref()

const props = defineProps({
  frame: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    default: false,
    required: false
  }
})

useElement(preview, props.frame.canvas)
</script>

<style scoped>
.frame {
  flex: 0 0 auto;
  width: 4rem;
  height: 4rem;
  border: 1px solid #000;
}

.active {
  border: 1px solid #0cf;
}
</style>
