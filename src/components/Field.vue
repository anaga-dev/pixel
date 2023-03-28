<template>
  <div class="Field">
    <label :for="for">{{ label }}</label>
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  for: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.Field {
  display: grid;
  grid-auto-flow: row;
  gap: var(--spaceS);
}
</style>