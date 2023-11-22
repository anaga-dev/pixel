<template>
  <Transition name="pop">
    <div ref="target" class="Dropdown">
      <slot></slot>
    </div>
  </Transition>
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

.pop-enter-active {
  transition: all 200ms ease-out;
}

.pop-leave-active {
  transition: all 200ms ease-in;
}

.pop-enter-from,
.pop-leave-to {
  translate: 100%;
  opacity: 0;
}
</style>
