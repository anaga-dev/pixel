<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  nonDismissable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
</script>

<template>
  <Overlay />
  <div class="wrapper">
    <div class="Modal">
      <header v-if="props.title || !props.nonDismissable">
        <h2>{{ props.title }}</h2>
        <Button
          v-if="!props.nonDismissable"
          :label="$t('close')"
          variant="ghost"
          @click="emit('close')"
        >
          <Icon i="close" />
        </Button>
      </header>
      <div class="body">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: fixed;
  inset: 0;
  display: grid;
  place-content: center;
  z-index: 1000;
}
.Modal {
  min-width: 24rem;
  display: grid;
  grid-auto-flow: row;
  justify-content: stretch;
  gap: var(--spaceM);
  padding: var(--spaceL) var(--spaceL);
  background-color: var(--colorLayer2);
  box-shadow: var(--shadowLayer);
  z-index: 1001;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
