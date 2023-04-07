<template>
  <section class="Panel">
    <header>
      <h2 @click="$event => emit('collapse', !collapsed)">
        {{ collapsed ? '+' : '-' }}
        {{ title }}
      </h2>
      <div class="actions">
        <slot name="actions"></slot>
      </div>
    </header>
    <div class="content" :class="{ scrollable, collapsed }">
      <slot></slot>
    </div>
  </section>
</template>

<script setup>
const emit = defineEmits(['collapse'])

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  scrollable: {
    type: Boolean,
    default: true,
    required: false
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
header {
  display: flex;
  padding: var(--spaceXS) var(--spaceXS) var(--spaceXS) var(--spaceM);
  justify-content: space-between;
  align-items: center;
}

h3 {
  text-transform: uppercase;
}

.actions {
  display: grid;
  grid-auto-flow: column;
  gap: var(--spaceS);
}
.content {
  overflow: hidden;
  max-height: 25vh;
}

.scrollable {
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow:
    inset 0 var(--spaceXS) 0 var(--colorShadow),
    inset 0 calc(var(--spaceXS) * -1) 0 var(--colorShadow);
}

.collapsed {
  height: 0;
}
</style>
