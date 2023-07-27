<template>
  <li class="Tab">
    <button :class="{ active: active }" type="button"><slot></slot></button>
  </li>
</template>

<script setup>
const props = defineProps({
  active: {
    type: Boolean
  }
})
</script>

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