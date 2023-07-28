<template>
  <div class="Panels" ref="target">
    <slot></slot>
  </div>
</template>

<script setup>
const target = ref(null)

const emit = defineEmits(['close'])

onClickOutside(target, () => emit('close'))
</script>

<style scoped>
.Panels {
  width: var(--widthSidebar);
  max-height: 100%;
  display: grid;
  grid-auto-flow: row;
}
</style>
