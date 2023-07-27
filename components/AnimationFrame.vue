<template>
  <div
    class="Frame"
    :class="{ active: props.active }"
    ref="preview">
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
  border: 2px solid var(--colorLayer0);
  transition: all 100ms;
  overflow: hidden;
}

.active {
  border: 2px solid var(--colorAccent);
}
</style>
