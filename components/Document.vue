<template>
  <div class="paint" ref="container" :style="{ width, height, transform }">
    <!-- aquí inyectaremos el canvas -->
  </div>
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'
import { useElement } from '@/composables/useElement'
import { usePointer } from '@/composables/usePointer'

const documentStore = useDocumentStore()

const container = ref()

const width = computed(() => `${documentStore.width}px`)
const height = computed(() => `${documentStore.height}px`)
const transform = computed(() => `scale(${documentStore.zoom.current}) translate(${documentStore.position.x}px, ${documentStore.position.y}px)`)

useElement(container, documentStore.canvas)
usePointer(documentStore.canvas, documentStore.useTool, {
  receiver: documentStore.board
})

onMounted(() => {
  documentStore.redrawAll()
  documentStore.updateCanvasRect()
})

onUpdated(() => documentStore.updateCanvasRect())
</script>

<style>
.paint {
  background-image: url('@/assets/checkers.png');
  image-rendering: crisp-edges;
  image-rendering: pixelated;
  position: relative;
}

.paint canvas {
  position: absolute;
}

canvas::after {
  display: block;
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(transparent 1px, #000 1px), linear-gradient(90deg, transparent 1px, #000 1px);
}
</style>
