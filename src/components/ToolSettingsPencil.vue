<template>
  <Button label="Brush shape" @click="showing = 'brush-type'">
    <Icon :i="`brush-${document.pencil.shape}`" />
  </Button>
  <Button label="Brush size" @click="showing = 'brush-size'">
    {{ document.pencil.size }}px
  </Button>
  <BrushSelector v-if="showing === 'brush-type'" @select="onBrushShape" @close="onClose" />
  <BrushSize v-else-if="showing === 'brush-size'" :current-size="document.pencil.size" @select="onBrushSize" @close="onClose" />
</template>

<script setup>
import { ref } from 'vue'
import { useDocumentStore } from '@/stores/PixelDocument'
import BrushSelector from '@/components/BrushSelector.vue'
import BrushSize from '@/components/BrushSize.vue'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'

const document = useDocumentStore()
const showing = ref('')

function onBrushShape(shape) {
  document.setPencilShape(shape)
  showing.value = ''
}

function onBrushSize(size) {
  document.setPencilSize(size)
  showing.value = ''
}

function onClose() {
  showing.value = ''
}
</script>
