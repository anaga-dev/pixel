<template>
  <div class="tool-settings-shape">
    <button class="pill" type="button" id="line" :class="{ active: document.shape.type === 'line' }" @click="document.setShapeType('line')">
      <i class="bx bx-shape-square"></i>
      Line
    </button>
    <button class="pill" type="button" id="rectangle" :class="{ active: document.shape.type === 'rectangle' }" @click="document.setShapeType('rectangle')">
      <i class="bx bx-shape-square"></i>
      Rectangle
    </button>
    <button class="pill" type="button" id="ellipse" :class="{ active: document.shape.type === 'ellipse' }" @click="document.setShapeType('ellipse')">
      <i class="bx bx-shape-square"></i>
      Ellipse
    </button>
    <button class="pill" type="button" id="fill" :class="{ active: document.shape.filled }" @click="document.toggleShapeFill()">
      <i class="bx bxs-droplet"></i>
      Fill shape
    </button>
    <button class="pill" type="button" id="lock-aspect-ratio" :class="{ active: document.shape.lockAspectRatio }" @click="document.toggleShapeLockAspectRatio()">
      <i class="bx bxs-lock-alt"></i>
      Lock aspect ratio
    </button>
  </div>
</template>

<script setup>
import { useDocumentStore } from '../stores/PixelDocument'

const document = useDocumentStore()
</script>

<style scoped>
button {
  margin: 0;
  padding: 0.25rem 1rem;
  background: #000;
  border-radius: 0.5rem;
}
</style>
