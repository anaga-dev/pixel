<template>
  <Transition
    name="pop"
    appear
  >
    <div
      ref="target"
      class="Dropdown"
    >
      <slot />
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
  gap: var(--space-m);
  padding: var(--space-m);
  background-color: var(--color-base-900);
  box-shadow: var(--shadow-floating-element);
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
  scale: 0.2;
  opacity: 0;
}
</style>
