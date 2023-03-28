<template>
  <section class="Zoom">
    <Button label="Zoom out" variant="ghost" @click="document.zoom.decrease()">
      <Icon i="zoom-out" />
    </Button>
    <div class="percentage" @click="onZoomShow">
      {{ document.zoom.percentage }}
    </div>
    <Button label="Zoom in" variant="ghost" @click="document.zoom.increase()">
      <Icon i="zoom-in" />
    </Button>
    <Button label="Reset zoom" variant="ghost" @click="document.zoom.reset()">
      <Icon i="zoom-reset" />
    </Button>
  </section>
</template>

<script setup>
import { useDocumentStore } from '../stores/PixelDocument'
import Button from '@components/Button.vue'
import Icon from '@components/Icon.vue'

const document = useDocumentStore()

function onZoomShow() {
  // TODO:
  console.info('TO BE IMPLEMENTED')
}
</script>

<style scoped>
.Zoom {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: var(--spaceS);
}

.percentage {
  width: 7ch;
  text-align: center;
}
</style>
