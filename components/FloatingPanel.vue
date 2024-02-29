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
  padding: var(--spaceM);
  background-color: var(--colorLayer1);
  box-shadow: var(--shadowLayer);
  overflow: hidden;
  max-height: calc(100svh - 4.5rem - var(--spaceS));
  width: var(--widthSidebar);
  z-index: 1000;
}

header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spaceS);
  padding-bottom: var(--spaceS);
  justify-content: space-between;
  align-items: center;
  position: relative;
}

h2 {
  font-size: var(--fontSizeM);
  color: var(--colorText);
}
.actions {
  display: grid;
  grid-auto-flow: column;
  gap: var(--spaceS);
}

.content {
  flex: 1;
  overflow-y: auto;
}
</style>
