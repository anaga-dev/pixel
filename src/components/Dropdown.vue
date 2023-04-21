<template>
  <div class="Dropdown" v-on-click-outside.bubble="onClick">
    <slot></slot>
  </div>
</template>

<script setup>
import { vOnClickOutside } from '@vueuse/components'
const emit = defineEmits(['close'])

function onClick(e) {
  emit('close')
}
</script>

<style scoped>
.Outside {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.Dropdown {
  min-width: 16rem;
  display: grid;
  grid-auto-flow: row;
  justify-content: stretch;
  gap: var(--spaceM);
  padding: var(--spaceM);
  background-color: var(--colorLayer1);
  z-index: 1000;
  box-shadow: var(--shadowLayer);
  position: fixed;
}
</style>
