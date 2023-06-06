<template>
  <div class="paint" ref="container" :style="{ width, height, transform }">
    <!-- aquí inyectaremos el canvas -->
  </div>
</template>

<script setup>
import { onMounted, ref, computed, onUpdated } from 'vue'
import { useDocumentStore } from '@/stores/DocumentStore'
import { useElement } from '@/composables/useElement'
import { usePointer } from '@/composables/usePointer'

const documentStore = useDocumentStore()

const container = ref()

const width = computed(() => `${documentStore.width}px`)
const height = computed(() => `${documentStore.height}px`)
const transform = computed(() => `scale(${documentStore.zoom.current}) translate(${~~documentStore.position[0]}px, ${~~documentStore.position[1]}px)`)

useElement(container, documentStore.canvas)
usePointer(documentStore.canvas, documentStore.useTool)

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
</style>
