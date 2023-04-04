<template>
  <div class="paint" ref="doc" :style="{ width, height, transform }">
    <!-- aquí inyectaremos el canvas -->
  </div>
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { useDocumentStore } from '~/stores/PixelDocument'
import { useElement } from '~/composables/useElement'

const document = useDocumentStore()
const doc = ref()
const selection = ref()

const width = computed(() => `${document.width}px`)
const height = computed(() => `${document.height}px`)
const transform = computed(() => `scale(${document.zoom.current}) translate(${document.position[0]}px, ${document.position[1]}px)`)

useElement(doc, document.canvas)

onMounted(() => document.redrawAll())
</script>

<style scoped>
.paint {
  background-image: url('@/assets/checkers.png');
  image-rendering: pixelated; /* WhAT? */
}

</style>
