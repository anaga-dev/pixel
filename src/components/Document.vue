<template>
  <div class="paint" ref="doc" :style="{ width, height, transform }">
    <!-- aquí inyectaremos el canvas -->
  </div>
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { useDocumentStore } from '@/stores/PixelDocument'
import { useElement } from '@/composables/useElement'

const pixelDocument = useDocumentStore()
const doc = ref()
const selection = ref()

const width = computed(() => `${pixelDocument.width}px`)
const height = computed(() => `${pixelDocument.height}px`)
const transform = computed(() => `scale(${pixelDocument.zoom.current}) translate(${~~pixelDocument.position[0]}px, ${~~pixelDocument.position[1]}px)`)

useElement(doc, pixelDocument.canvas)

onMounted(() => pixelDocument.redrawAll())
</script>

<style scoped>
.paint {
  background-image: url('@/assets/checkers.png');
  image-rendering: pixelated; /* WhAT? */
}

</style>
