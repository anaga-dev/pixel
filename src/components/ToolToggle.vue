<template>
  <button type="button" class="tool" :class="{ active: active }" @click="onClick">
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  active: {
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
