<template>
  <div ref="target" class="Dropdown">
    <slot></slot>
  </div>
</template>

<script setup>
const target = ref(null)

const emit = defineEmits(['close'])

onClickOutside(target, (e) => {
  e.stopPropagation()
  emit('close')
})
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
  box-shadow: var(--shadowLayer);
  position: absolute;
  z-index: 1000;
}
</style>
