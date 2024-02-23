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

<template>
  <div class="Field">
    <label :for="props.for">{{ props.label }}</label>
    <slot />
  </div>
</template>

<style scoped>
.Field {
  display: grid;
  grid-auto-flow: row;
  gap: var(--spaceS);
}
</style>
