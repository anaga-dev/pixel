<script setup>
import { useDocumentStore } from '@/stores/document'
const documentStore = useDocumentStore()

const grid = ref(null)

/**
 * Updates the size and position of the canvas.
 */
const updateSizeAndPosition = () => {
  grid.value.width = Math.floor(documentStore.canvasRect.width)
  grid.value.height = Math.floor(documentStore.canvasRect.height)

  grid.value.style.left = `${Math.floor(documentStore.canvasRect.left)}px`
  grid.value.style.top = `${Math.floor(documentStore.canvasRect.top)}px`
}

const drawGrid = () => {
  const canvas = grid.value
  const context = grid.value.getContext('2d')

  context.strokeStyle = 'rgba(128, 128, 128, 0.2)'
  context.lineWidth = 1
  context.imageSmoothingEnabled = false

  const stepSize = documentStore.zoom.current

  context.clearRect(0, 0, canvas.width, canvas.height)

  for (let y = stepSize; y < canvas.height; y += stepSize) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(canvas.width, y)
    context.stroke()
  }

  for (let x = stepSize; x < canvas.width; x+= stepSize) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, canvas.height)
    context.stroke()
  }
}

const pipeline = [
  updateSizeAndPosition,
  drawGrid
]

useRequestAnimationFrame(pipeline)
</script>

<template>
  <div class="PixelGrid">
    <canvas ref="grid" />
  </div>
</template>

<style scoped>
.PixelGrid {
  pointer-events: none;
  position: fixed;
  inset: 0;
  mix-blend-mode: difference;
}

canvas {
  position: absolute;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
</style>
