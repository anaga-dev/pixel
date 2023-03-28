<template>
  <div class="Dropdown" v-click-outside="handleClickOutside">
    <slot />
  </div>
</template>

<script setup>
const emit = defineEmits(['close'])

const handleClickOutside = () => {
  console.log('close!!!')
  emit('close')
}
</script>

<style scoped>
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