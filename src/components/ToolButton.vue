<template>
  <button type="button" class="tool" :class="{ disabled: disabled }" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script setup>
import { useDocumentStore } from '../stores/PixelDocument'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  }
})
</script>

<style scoped>
.tool {
  width: 1rem;
  height: 1rem;
}
</style>
