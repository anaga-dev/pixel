<template>
  <Transition appear name="slide">
    <section class="Panel" :class="{ expanded: expanded }">
      <header>
        <Button variant="ghost" @click="emit('toggle')"
          ><Icon :i="icon"
        /></Button>
        <h2>{{ title }}</h2>
        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </header>
      <div v-if="expanded" class="content">
        <slot></slot>
      </div>
    </section>
  </Transition>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: false
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
  gap: var(--spaceS);
  padding: var(--spaceXS) 0;
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
