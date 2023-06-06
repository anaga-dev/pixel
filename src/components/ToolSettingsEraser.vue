<template>
  <Button variant="dropdown" label="Eraser shape" @click.stop="uiStore.toggleOverlay('eraser-shape')">
    <Icon :i="`brush-${documentStore.eraser.shape}`" />
  </Button>
  <Button variant="dropdown" label="Eraser size" @click.stop="uiStore.toggleOverlay('eraser-size')">
    {{ documentStore.eraser.size }}px
  </Button>
  <Divider vertical v-if="documentStore.eraser.shape === 'dither'" />
  <Button variant="dropdown" v-if="documentStore.eraser.shape === 'dither'" label="Eraser dither" @click.stop="uiStore.toggleOverlay('eraser-dither')">
    <Icon :i="`dither-${documentStore.eraser.dither.level}`" />
  </Button>
  <BrushSelector
    v-if="uiStore.showOverlay === 'eraser-shape'"
    :shape="documentStore.eraser.shape"
    @select="onEraserShape"
    @close="uiStore.toggleOverlay('eraser-shape')" />
  <BrushSize
    v-else-if="uiStore.showOverlay === 'eraser-size'"
    :size="documentStore.eraser.size"
    @update="onEraserSize"
    @close="uiStore.toggleOverlay('eraser-size')" />
  <BrushDither v-else-if="uiStore.showOverlay === 'eraser-dither'" @select="onEraserDither" @close="uiStore.toggleOverlay('eraser-dither')" />
</template>

<script setup>
import { useDocumentStore } from '@/stores/DocumentStore'
import { useUIStore } from '@/stores/UIStore'
import BrushSelector from '@/components/BrushSelector.vue'
import BrushSize from '@/components/BrushSize.vue'
import BrushDither from '@/components/BrushDither.vue'
import Divider from '@/components/Divider.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'

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
