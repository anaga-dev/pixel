<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  expanded: {
    type: Boolean
  }
})

const icon = computed(() => {
  return props.expanded ? 'arrow-down' : 'arrow-right'
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <Transition
    appear
    name="slide"
  >
    <section
      class="Panel"
      :class="{ expanded: expanded }"
    >
      <header>
        <Button
          variant="ghost"
          @click="emit('toggle')"
        >
          <Icon :i="icon" />
        </Button>
        <h2>{{ title }}</h2>
        <div class="actions">
          <slot name="actions" />
        </div>
      </header>
      <div
        v-if="expanded"
        class="content"
      >
        <slot />
      </div>
    </section>
  </Transition>
</template>

<style scoped>
.Panel {
  pointer-events: initial;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-s);
  padding: var(--space-xs) 0;
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
