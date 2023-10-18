<template>
  <Transition appear name="slide">
    <section class="Panel">
      <header>
        <Button variant="ghost" @click="emit('toggle')"><Icon :i="icon" /></Button>
        <h2>{{ title }}</h2>
        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </header>
        <div v-if="expanded" class="content"  :class="{ scrollable: scrollable }">
          <div v-if="scrollable" class="scroll-wrapper">
            
            <slot></slot>
          </div>
          <slot v-else><!-- optional fallback --></slot>
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
  scrollable: {
    type: Boolean
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
  display: grid;
  grid-template-rows: auto 1fr;
}
header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--spaceS);
  padding: var(--spaceXS) 0;
  justify-content: space-between;
  align-items: center;
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

.scroll-wrapper {
  position: absolute;
  inset: 0;
}

.scrollable {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow: inset 0 var(--spaceXS) 0 var(--colorShadow),
    inset 0 calc(var(--spaceXS) * -1) 0 var(--colorShadow);
}
</style>
