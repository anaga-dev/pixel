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

<template>
  <button
    type="button"
    class="tool"
    :class="{ active: props.active }"
    @click="onClick"
  >
    <slot />
  </button>
</template>
