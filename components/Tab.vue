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
  gap: var(--spaceXS);
}

button {
  font-weight: bold;
  padding: var(--spaceS) var(--spaceM);
  transition: all 200ms;
}

button:hover {
  color: var(--colorAccent);
}
</style>
