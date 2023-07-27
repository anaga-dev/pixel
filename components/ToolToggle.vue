<template>
  <button type="button" class="tool" :class="{ active: active }" @click="onClick">
    <slot></slot>
  </button>
</template>

<script setup>
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