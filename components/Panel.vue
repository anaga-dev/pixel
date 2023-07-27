<template>
  <section class="Panel">
    <header v-if="title">
      <h2>{{ title }}</h2>
      <div class="actions">
        <slot name="actions"></slot>
      </div>
    </header>
    <div class="content" :class="{ scrollable: scrollable }">
      <slot></slot>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(['collapse'])

const props = defineProps({
  title: {
    type: String,
    required: false
  },
  scrollable: {
    type: Boolean
  }
})
</script>

<style scoped>
.Panel {
  max-height: 100%;
  pointer-events: initial;
  background-color: var(--colorLayer1);
  padding: var(--spaceM);
  box-shadow: var(--shadowLayer);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
header {
  display: flex;
  padding: var(--spaceXS) var(--spaceXS) var(--spaceXS) var(--spaceM);
  justify-content: space-between;
  align-items: center;
}
.actions {
  display: grid;
  grid-auto-flow: column;
  gap: var(--spaceS);
}

.scrollable {
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow:
    inset 0 var(--spaceXS) 0 var(--colorShadow),
    inset 0 calc(var(--spaceXS) * -1) 0 var(--colorShadow);
}
</style>
