<template>
  <Button variant="dropdown" label="Brush shape" @click.stop="uiStore.toggleOverlay('brush-shape')">
    <Icon :i="`brush-${documentStore.pencil.shape}`" />
  </Button>
  <Button variant="dropdown" label="Brush size" @click.stop="uiStore.toggleOverlay('brush-size')">
    {{ documentStore.pencil.size }}px
  </Button>
  <Divider vertical v-if="documentStore.pencil.shape === 'dither'" />
  <Button variant="dropdown" v-if="documentStore.pencil.shape === 'dither'" label="Brush dither" @click.stop="uiStore.toggleOverlay('brush-dither')">
    <Icon :i="`dither-${documentStore.pencil.dither.level}`" />
  </Button>
  <BrushSelector
    v-if="uiStore.showOverlay === 'brush-shape'"
    @select="onBrushShape"
    @close="uiStore.toggleOverlay('brush-shape')" />
  <BrushSize
    v-else-if="uiStore.showOverlay === 'brush-size'"
    :size="documentStore.pencil.size"
    @update="onBrushSize"
    @close="uiStore.toggleOverlay('brush-size')" />
  <BrushDither v-else-if="uiStore.showOverlay === 'brush-dither'" @select="onBrushDither" @close="uiStore.toggleOverlay('brush-dither')" />
</template>

<script setup>
import { useDocumentStore } from '@/stores/DocumentStore'
import { useUIStore } from '@/stores/UIStore'
import BrushSelector from '@/components/BrushSelector.vue'
import BrushSize from '@/components/BrushSize.vue'
import BrushDither from '@/components/BrushDither.vue'
import Button from '@/components/Button.vue'
import Divider from '@/components/Divider.vue'
import Icon from '@/components/Icon.vue'

const documentStore = useDocumentStore()
const uiStore = useUIStore()

function onBrushShape(shape) {
  documentStore.setPencilShape(shape)
  uiStore.toggleOverlay('brush-shape')
}

function onBrushSize(size) {
  console.log('on brush size', size)
  documentStore.setPencilSize(size)
}

function onBrushDither(dither) {
  documentStore.setPencilDitherLevel(dither)
  uiStore.toggleOverlay('brush-dither')
}
</script>
