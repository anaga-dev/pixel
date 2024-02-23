<template>
  <Button
    variant="dropdown"
    label="Eraser shape"
    @click.stop="toggleOverlay('eraser-shape')"
  >
    <Icon :i="`brush-${documentStore.eraser.shape}`" />
  </Button>
  <Button
    variant="dropdown"
    label="Eraser size"
    @click.stop="toggleOverlay('eraser-size')"
  >
    {{ documentStore.eraser.size }}px
  </Button>
  <Divider
    v-if="documentStore.eraser.shape === 'dither'"
    vertical
  />
  <Button
    v-if="documentStore.eraser.shape === 'dither'"
    variant="dropdown"
    label="Eraser dither"
    @click.stop="toggleOverlay('eraser-dither')"
  >
    <Icon :i="`dither-${documentStore.eraser.dither.level}`" />
  </Button>
  <BrushSelector
    v-if="showOverlay === 'eraser-shape'"
    :shape="documentStore.eraser.shape"
    @select="onEraserShape"
    @close="toggleOverlay('eraser-shape')"
  />
  <BrushSize
    v-else-if="showOverlay === 'eraser-size'"
    :size="documentStore.eraser.size"
    @update="onEraserSize"
    @close="toggleOverlay('eraser-size')"
  />
  <BrushDither
    v-else-if="showOverlay === 'eraser-dither'"
    @select="onEraserDither"
    @close="toggleOverlay('eraser-dither')"
  />
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'

const documentStore = useDocumentStore()
const uiStore = useUIStore()

const { showOverlay } = storeToRefs(uiStore)
const { toggleOverlay } = uiStore

function onEraserShape(shape) {
  documentStore.setEraserShape(shape)
  toggleOverlay('eraser-shape')
}

function onEraserSize(size) {
  documentStore.setEraserSize(size)
}

function onEraserDither(dither) {
  documentStore.setEraserDitherLevel(dither)
  toggleOverlay('eraser-dither')
}
</script>
