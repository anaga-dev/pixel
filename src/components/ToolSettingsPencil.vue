<template>
  <Button label="Brush shape" @click.stop="onShowing('shape')">
    <Icon :i="`brush-${pixelDocument.pencil.shape}`" />
  </Button>
  <Button label="Brush size" @click.stop="onShowing('size')">
    {{ pixelDocument.pencil.size }}px
  </Button>
  <Button v-if="pixelDocument.pencil.shape === 'dither'" label="Brush dither" @click.stop="onShowing('dither')">
    <Icon :i="`dither-${pixelDocument.pencil.dither.level}`" />
  </Button>
  <BrushSelector v-if="showing === 'shape'" @select="onBrushShape" @close="showing = ''" />
  <BrushSize v-else-if="showing === 'size'" :size="pixelDocument.pencil.size" @update="onBrushSize" @close="showing = ''" />
  <BrushDither v-else-if="showing === 'dither'" @select="onBrushDither" @close="showing = ''" />
</template>

<script setup>
import { ref } from 'vue'
import { useDocumentStore } from '@/stores/PixelDocument'
import BrushSelector from '@/components/BrushSelector.vue'
import BrushSize from '@/components/BrushSize.vue'
import BrushDither from '@/components/BrushDither.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'

const pixelDocument = useDocumentStore()
const showing = ref('')

function onBrushShape(shape) {
  pixelDocument.setPencilShape(shape)
  showing.value = ''
}

function onBrushSize(size) {
  pixelDocument.setPencilSize(size)
}

function onBrushDither(dither) {
  pixelDocument.setPencilDitherLevel(dither)
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
