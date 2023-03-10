<template>
  <div class="zoom">
    <button class="pill" type="button" @click="document.zoom.decrease()">
      <i class="bx bx-zoom-out"></i>
    </button>
    <div class="percentage" @click="onZoomShow">
      {{ document.zoom.percentage }}
    </div>
    <button class="pill" type="button" @click="document.zoom.increase()">
      <i class="bx bx-zoom-in"></i>
    </button>
    <button class="pill" type="button" @click="document.zoom.reset()">
      <i class="bx bx-reset"></i>
    </button>
  </div>
</template>

<script setup>
import { useDocumentStore } from '../stores/PixelDocument'

const document = useDocumentStore()

function onZoomShow() {
  // TODO:
  console.info('TO BE IMPLEMENTED')
}
</script>

<style scoped>
.zoom {
  display: flex;
  justify-content: center;
  align-items: center;
}

.percentage {
  margin-right: 0.5rem;
}
</style>
