<script setup>
const props = defineProps({
  active: {
    type: Boolean
  }
})
</script>

<template>
  <li class="Tab">
    <button
      :class="{ active: props.active }"
      type="button"
    >
      <slot />
    </button>
  </li>
</template>

<style scoped>
.Tab {
  padding: 0;
  margin: 0;
  display: grid;
  grid-auto-flow: column;
  justify-content: stretch;
  gap: var(--space-xs);
}

button {
  font-weight: bold;
  padding: var(--space-s) var(--space-m);
  transition: all 200ms;
}

button:hover {
  color: var(--color-brand);
}
</style>
