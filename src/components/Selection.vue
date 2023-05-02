<template>
  <div class="selection" ref="container">
    <!-- aquí inyectamos el canvas de selección -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDocumentStore } from '@/stores/PixelDocument'
import { useElement } from '@/composables/useElement'
import { useRequestAnimationFrame } from '@/composables/useRequestAnimationFrame'

const documentStore = useDocumentStore()

const canvas = documentStore.selectionCanvas
const context = canvas.getContext('2d')

const container = ref()

/**
 * Actualiza la posición del canvas de
 * selección.
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
 * Actualiza el patrón usado para pintar
 * el "camino de hormigas".
 */
function updatePattern() {
  documentStore.pattern.setTransform(documentStore.patternMatrix.translateSelf(0.25, 0.25))
}

/**
 * Renderiza el polígono de selección
 * con el "camino de hormigas".
 */
function render() {
  if (context.imageSmoothingEnabled)
    context.imageSmoothingEnabled = false

  context.clearRect(0, 0, canvas.width, canvas.height)

  // con esto podemos visualizar la máscara que
  // estamos generando a partir de la selección
  if (documentStore.selectionMaskCanvas) {
    // Esto dibuja cuatro veces la figura con un pixel
    // de diferencia para poder dibujar el "camino de
    // hormigas".
    // TODO: Quizá podríamos cachear este dibujo.
    context.drawImage(
      documentStore.selectionMaskCanvas,
      -1, -1, canvas.width, canvas.height
    )
    context.drawImage(
      documentStore.selectionMaskCanvas,
      1, -1, canvas.width, canvas.height
    )
    context.drawImage(
      documentStore.selectionMaskCanvas,
      1, 1, canvas.width, canvas.height
    )
    context.drawImage(
      documentStore.selectionMaskCanvas,
      -1, 1, canvas.width, canvas.height
    )
    // Esta es la parte responsable de dibujar
    // el contorno de nuestra selección.
    context.globalCompositeOperation = 'destination-out'
    context.drawImage(
      documentStore.selectionMaskCanvas,
      0, 0, canvas.width, canvas.height
    )
    context.globalCompositeOperation = 'source-in'
    context.fillStyle = documentStore.pattern
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.globalCompositeOperation = 'source-over'
  }

  context.beginPath()
  for (let index = 0; index < documentStore.selectionPolygon.length; index++) {
    const [x, y] = documentStore.selectionPolygon[index]
    const px = x * canvas.width
    const py = y * canvas.height
    if (index === 0) {
      context.moveTo(px, py)
    } else {
      context.lineTo(px, py)
    }
  }
  context.closePath()
  context.strokeStyle = documentStore.pattern
  context.stroke()
}

const pipeline = [
  updateSizeAndPosition,
  updatePattern,
  render
]

useElement(container, documentStore.selectionCanvas)

useRequestAnimationFrame(pipeline)
</script>

<style scoped>
.selection {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
