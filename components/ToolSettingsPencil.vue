<script setup>
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'

const documentStore = useDocumentStore()
const uiStore = useUIStore()

function onBrushShape(shape) {
  documentStore.setPencilShape(shape)
  uiStore.toggleOverlay('brush-shape')
}

function onBrushSize(size) {
  documentStore.setPencilSize(size)
}

function onBrushDither(dither) {
  documentStore.setPencilDitherLevel(dither)
  uiStore.toggleOverlay('brush-dither')
}
</script>

<template>
  <Button
    variant="dropdown"
    label="Brush shape"
    @click.stop="uiStore.toggleOverlay('brush-shape')"
  >
    <Icon :i="`brush-${documentStore.pencil.shape}`" />
  </Button>
  <Button
    variant="dropdown"
    label="Brush size"
    @click.stop="uiStore.toggleOverlay('brush-size')"
  >
    {{ documentStore.pencil.size }}px
  </Button>
  <Divider
    v-if="documentStore.pencil.shape === 'dither'"
    vertical
  />
  <Button
    v-if="documentStore.pencil.shape === 'dither'"
    variant="dropdown"
    label="Brush dither"
    @click.stop="uiStore.toggleOverlay('brush-dither')"
  >
    <Icon :i="`dither-${documentStore.pencil.dither.level}`" />
  </Button>
  <BrushSelector
    v-if="uiStore.visibleOverlay === 'brush-shape'"
    @select="onBrushShape"
    @close="uiStore.toggleOverlay('brush-shape')"
  />
  <BrushSize
    v-else-if="uiStore.visibleOverlay === 'brush-size'"
    :size="documentStore.pencil.size"
    @update="onBrushSize"
    @close="uiStore.toggleOverlay('brush-size')"
  />
  <BrushDither
    v-else-if="uiStore.visibleOverlay === 'brush-dither'"
    @select="onBrushDither"
    @close="uiStore.toggleOverlay('brush-dither')"
  />
</template>

<style scoped>
button {
  background-color: var(--color-base-900);
}
</style>
