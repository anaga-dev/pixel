<template>
  <div
    ref="preview"
    class="Frame"
    :class="{ active: props.active }"
  >
    <!-- Inyectamos el fotograma -->
  </div>
</template>

<script setup>
import useElement from '@/composables/useElement'

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
.Frame {
  width: 5rem;
  aspect-ratio: 1;
  border: 2px solid var(--color-base-950);
  transition: all 100ms;
  overflow: hidden;
}

.active {
  border: 2px solid var(--color-brand);
}
</style>
