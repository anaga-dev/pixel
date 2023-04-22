<template>
  <Button label="Eraser shape" @click.stop="onShowing('shape')">
    <Icon :i="`brush-${pixelDocument.eraser.shape}`" />
  </Button>
  <Button label="Eraser size" @click.stop="onShowing('size')">
    {{ pixelDocument.eraser.size }}px
  </Button>
  <BrushSelector v-if="showing === 'shape'" :shape="pixelDocument.eraser.shape" @select="onEraserShape" @close="showing = ''" />
  <BrushSize v-else-if="showing === 'size'" :size="pixelDocument.eraser.size" @update="onEraserSize" @close="showing = ''" />
</template>

<script setup>
import { ref } from 'vue'
import { useDocumentStore } from '@/stores/PixelDocument'
import BrushSelector from '@/components/BrushSelector.vue'
import BrushSize from '@/components/BrushSize.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'

const pixelDocument = useDocumentStore()
const showing = ref('')

function onEraserShape(shape) {
  pixelDocument.setEraserShape(shape)
  showing.value = ''
}

function onEraserSize(size) {
  pixelDocument.setEraserSize(size)
  showing.value = ''
}

function onShowing(tool) {
  if (showing.value === tool) {
    showing.value = ''
  } else {
    showing.value = tool
  }
}
</script>
