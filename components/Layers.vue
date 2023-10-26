<script setup>
import { useDocumentStore } from '@/stores/document'

const document = useDocumentStore()
const dropArea = ref({})
const fromIndex = ref(null)
const fromLayerId = ref(null)

const props = defineProps({
  layers: {
    type: Object,
    required: true
  }
})

const handleSettings = (layer) => {
  document
  document.showLayerSettings(layer)
}

function onDragStart(index, layerId) {
  fromIndex.value = index
  fromLayerId.value = layerId
}

function onDragOver(e) {
  e.preventDefault()
  const ownIndex = e.currentTarget.dataset.index
  console.log('Drag over', fromIndex.value, ownIndex)
  dropArea.value = {
    index: parseInt(ownIndex),
    direction: fromIndex.value > ownIndex ? 'bottom' : 'top'
  }
  console.log('Drop area', dropArea.value)
}

function onDragEnd(e) {
  dropArea.value = {}
}

function onDrop(e) {
  const destination = e.currentTarget
  const toIndex = parseInt(destination.dataset.index, 10)
  document.layers.swap(fromIndex.value, toIndex)
  dropArea.value = {}
}
</script>

<template>
  <div class="layers">
    <Layer
      v-for="(layer, index) in layers.list"
      :key="layer.id"
      :index="index"
      :layer="layer"
      :active="layers.current.id === layer.id"
      :dropTop="dropArea?.index === index && dropArea?.direction === 'top'"
      :dropBottom="dropArea?.index === index && dropArea?.direction === 'bottom'"
      :settings="layers.settings?.id === layer.id"
      @settings="handleSettings(layer)"
      @visible="document.toggleLayer(layer)"
      @activate="document.setLayer(layer)"
      @dragstart="onDragStart(index, layer)"
      @dragover="onDragOver"
      @dragend="onDragEnd"
      @drop.capture="onDrop"
    />
  </div>
</template>

<style scoped>
.layers {
  display: flex;
  flex-direction: column-reverse;
  gap: var(--spaceS);
}
</style>
