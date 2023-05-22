<template>
  <section class="Panel">
    <header>
      <button class="button-title" type="button" @click="emit('collapse', !collapsed)">
        <Icon :i="collapsed ? 'arrow-right' : 'arrow-down' " />
        <h2>{{ title }}</h2>
      </button>
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
import Icon from '@/components/Icon.vue'

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

.button-title {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: var(--spaceS);
}

.actions {
  display: grid;
  grid-auto-flow: column;
  gap: var(--spaceS);
}
.content {
  overflow: hidden;
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
