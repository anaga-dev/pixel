<template>
  <Button variant="ghost" :label="label" :active="active" :disabled="disabled">
    <slot></slot>
  </Button>
</template>

<script setup>
import Button from '@/components/Button.vue'

const props = defineProps({
  active: {
    type: Boolean
  },
  label: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean
  }
})
</script>

<style scoped>
button {
  display: grid;
  place-content: center;
  height: var(--spaceXL);
  padding: 0 var(--spaceS);
  background-color: transparent;
  clip-path: var(--pixelCorners);
  transition: all 240ms ease;
}

button:hover {
  background-color: var(--colorShade);
}
</style>
