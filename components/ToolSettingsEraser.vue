<script setup>
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'

const documentStore = useDocumentStore()
const uiStore = useUIStore()

function onEraserShape(shape) {
  documentStore.setEraserShape(shape)
  uiStore.toggleOverlay('eraser-shape')
}

function onEraserSize(size) {
  documentStore.setEraserSize(size)
}

function onEraserDither(dither) {
  documentStore.setEraserDitherLevel(dither)
  uiStore.toggleOverlay('eraser-dither')
}
</script>

<template>
  <Button
    variant="dropdown"
    label="Eraser shape"
    @click.stop="uiStore.toggleOverlay('eraser-shape')"
  >
    <Icon :i="`brush-${documentStore.eraser.shape}`" />
  </Button>
  <Button
    variant="dropdown"
    label="Eraser size"
    @click.stop="uiStore.toggleOverlay('eraser-size')"
  >
    {{ documentStore.eraser.size }}px
  </Button>
  <Divider v-if="documentStore.eraser.shape === 'dither'" vertical />
  <Button
    v-if="documentStore.eraser.shape === 'dither'"
    variant="dropdown"
    label="Eraser dither"
    @click.stop="uiStore.toggleOverlay('eraser-dither')"
  >
    <Icon :i="`dither-${documentStore.eraser.dither.level}`" />
  </Button>
  <BrushSelector
    v-if="uiStore.visibleOverlay === 'eraser-shape'"
    :shape="documentStore.eraser.shape"
    @select="onEraserShape"
    @close="uiStore.toggleOverlay('eraser-shape')"
  />
  <BrushSize
    v-else-if="uiStore.visibleOverlay === 'eraser-size'"
    :size="documentStore.eraser.size"
    @update="onEraserSize"
    @close="uiStore.toggleOverlay('eraser-size')"
  />
  <BrushDither
    v-else-if="uiStore.visibleOverlay === 'eraser-dither'"
    @select="onEraserDither"
    @close="uiStore.toggleOverlay('eraser-dither')"
  />
</template>
