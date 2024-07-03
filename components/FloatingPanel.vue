<script setup>
const props = defineProps({
  title: {
    type: String,
    required: false
  }
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <Transition appear name="slide">
    <section class="Panel">
      <header>
        <h2>{{ title }}</h2>
        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </header>
      <div class="content">
        <slot></slot>
      </div>
    </section>
  </Transition>
</template>

<style scoped>
.Panel {
  position: fixed;
  pointer-events: initial;
  display: flex;
  flex-direction: column;
  padding: var(--space-m);
  background-color: var(--color-base-900);
  box-shadow: var(--shadow-floating-element);
  overflow: hidden;
  max-height: calc(100svh - 4.5rem - var(--space-s));
  width: var(--size-sidebar);
  z-index: 1000;
}

header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-s);
  padding-bottom: var(--space-s);
  justify-content: space-between;
  align-items: center;
  position: relative;
}

h2 {
  font-size: var(--font-size-m);
  color: var(--color-base-100);
}
.actions {
  display: grid;
  grid-auto-flow: column;
  gap: var(--space-s);
}

.content {
  flex: 1;
  overflow-y: auto;
}
</style>
