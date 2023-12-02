<template>
  <Button variant="dropdown" label="Brush shape" @click.stop="toggleOverlay('brush-shape')">
    <Icon :i="`brush-${documentStore.pencil.shape}`" />
  </Button>
  <Button variant="dropdown" label="Brush size" @click.stop="toggleOverlay('brush-size')">
    {{ documentStore.pencil.size }}px
  </Button>
  <Divider vertical v-if="documentStore.pencil.shape === 'dither'" />
  <Button variant="dropdown" v-if="documentStore.pencil.shape === 'dither'" label="Brush dither" @click.stop="uiStore.toggleOverlay('brush-dither')">
    <Icon :i="`dither-${documentStore.pencil.dither.level}`" />
  </Button>
  <BrushSelector
    v-if="showOverlay === 'brush-shape'"
    @select="onBrushShape"
    @close="toggleOverlay('brush-shape')" />
  <BrushSize
    v-else-if="showOverlay === 'brush-size'"
    :size="documentStore.pencil.size"
    @update="onBrushSize"
    @close="toggleOverlay('brush-size')" />
  <BrushDither v-else-if="showOverlay === 'brush-dither'" @select="onBrushDither" @close="toggleOverlay('brush-dither')" />
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'

const documentStore = useDocumentStore()
const uiStore = useUIStore()

const { showOverlay } = storeToRefs(uiStore)
const { toggleOverlay } = uiStore

function onBrushShape(shape) {
  documentStore.setPencilShape(shape)
  toggleOverlay('brush-shape')
}

function onBrushSize(size) {
  documentStore.setPencilSize(size)
}

function onBrushDither(dither) {
  documentStore.setPencilDitherLevel(dither)
  toggleOverlay('brush-dither')
}
</script>

<style scoped>
button {
  background-color: var(--colorLayer1);
}
</style>
