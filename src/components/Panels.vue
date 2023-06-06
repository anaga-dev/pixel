<template>
  <div class="Panels" v-on-click-outside.bubble="onClick">
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
.Panels {
  width: var(--widthSidebar);
  max-height: 100%;
  display: grid;
  grid-auto-flow: row;
}
</style>  
