<template>
  <Overlay />
  <div class="wrapper">
    <div class="Modal">
      <header>
        <h2>{{ title }}</h2>
        <Button label="Close" v-if="!nondismissable" variant="ghost">
          <Icon i="close" />
        </Button>
      </header>
      <div class="body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from '@components/Button.vue'
import Overlay from '@components/Overlay.vue'
import Icon from '@components/Icon.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  nondismissable: {
    type: Boolean
  }
})
</script>

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
