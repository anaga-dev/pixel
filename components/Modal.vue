<script setup>
const props = defineProps({
  title: {
    type: String
  },
  nondismissable: {
    type: Boolean
  }
})

const emit = defineEmits(['close'])
</script>

<template>
  <Overlay />
  <div class="wrapper">
    <div class="Modal">
      <header v-if="title || !nondismissable">
        <h2>{{ title }}</h2>
        <Button :label="$t('close')" v-if="!nondismissable" variant="ghost" @click="emit('close')">
          <Icon i="close" />
        </Button>
      </header>
      <div class="body">
        <slot></slot>
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
