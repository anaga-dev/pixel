<template>
  <div class="selection" :class="{ active }" ref="container">
    <!-- inject canvas -->
  </div>
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'
import { useElement } from '@/composables/useElement'
import { useRequestAnimationFrame } from '@/composables/useRequestAnimationFrame'
import { Tool } from '@/pixel/enums/Tool'

const documentStore = useDocumentStore()

const canvas = documentStore.selection.getCanvas()
const context = canvas.getContext('2d')

const active = computed(() => documentStore.tool === Tool.SELECT)
const container = ref()

/**
 * Updates the size and position of the canvas.
 */
function updateSizeAndPosition() {
  if (canvas.style.position !== 'absolute')
    canvas.style.position = 'absolute'

  const expectedWidth = Math.floor(documentStore.canvasRect.width)
  if (canvas.width !== expectedWidth)
    canvas.width = expectedWidth

  const expectedHeight = Math.floor(documentStore.canvasRect.height)
  if (canvas.height !== expectedHeight)
    canvas.height = expectedHeight

  const expectedLeft = `${Math.floor(documentStore.canvasRect.left)}px`
  if (canvas.style.left !== expectedLeft)
    canvas.style.left = expectedLeft

  const expectedTop = `${Math.floor(documentStore.canvasRect.top)}px`
  if (canvas.style.top !== expectedTop)
    canvas.style.top = expectedTop
}

/**
 * Updates the pattern of the selection.
 */
function updatePattern() {
  documentStore.selection.getPattern().update()
}

/**
 * Renders the selection.
 *
 * TODO: Move this to pixel/selection
 */
function render() {
  if (context.imageSmoothingEnabled) {
    context.imageSmoothingEnabled = false
  }

  context.clearRect(0, 0, canvas.width, canvas.height)

  const maskCanvas = documentStore.selection.getMaskCanvas()
  // con esto podemos visualizar la máscara que
  // estamos generando a partir de la selección
  if (maskCanvas) {
    // Esto dibuja cuatro veces la figura con un pixel
    // de diferencia para poder dibujar el "camino de
    // hormigas".
    // TODO: Quizá podríamos cachear este dibujo.
    context.drawImage(
      maskCanvas,
      -1, -1, canvas.width, canvas.height
    )
    context.drawImage(
      maskCanvas,
      1, -1, canvas.width, canvas.height
    )
    context.drawImage(
      maskCanvas,
      1, 1, canvas.width, canvas.height
    )
    context.drawImage(
      maskCanvas,
      -1, 1, canvas.width, canvas.height
    )
    // Esta es la parte responsable de dibujar
    // el contorno de nuestra selección.
    context.globalCompositeOperation = 'destination-out'
    context.drawImage(
      maskCanvas,
      0, 0, canvas.width, canvas.height
    )
    context.globalCompositeOperation = 'source-in'
    context.fillStyle = documentStore.selection.getPattern().pattern
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.globalCompositeOperation = 'source-over'
  }

  // Esto dibuja el contorno de la selección.
  context.strokeStyle = documentStore.selection.getPattern().pattern
  context.stroke(documentStore.selection.getPath2D(canvas.width, canvas.height))
}

const pipeline = [
  updateSizeAndPosition,
  updatePattern,
  render
]

useElement(container, documentStore.selection.getCanvas())

useRequestAnimationFrame(pipeline)
</script>

<style scoped>
.selection {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
}
.active {
  pointer-events: auto;
}
</style>
