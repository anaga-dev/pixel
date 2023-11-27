<script setup>
import { useDocumentStore } from '@/stores/document'
import { Sortable } from 'sortablejs-vue3'

const documentStore = useDocumentStore()

const handleSettings = (layer) => {
  documentStore.showLayerSettings(layer)
}

/* function onDragStart(index, layerId) {
  draggingLayer.value = true
  fromIndex.value = index
  fromLayerId.value = layerId
}

function onDragOver(e) {
  if (!draggingLayer.value) return
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
  draggingLayer.value = false
  dropArea.value = {}
}

function onDrop(e) {
  if (!draggingLayer.value) return
  const destination = e.currentTarget
  const toIndex = parseInt(destination.dataset.index, 10)
  document.swapLayers(fromIndex.value, toIndex)
  dropArea.value = {}
  draggingLayer.value = false
}

function onTouchStart(index, layerId) {
  console.log('Touch start', index, layerId)
  draggingLayer.value = true
  fromIndex.value = index
  fromLayerId.value = layerId
}

function onTouchMove(e) {
  if (!draggingLayer.value) return
  e.preventDefault()
  const touch = e.touches[0]
  const elementUnderFinger = elementFromPoint(touch.clientX, touch.clientY)
  if (elementUnderFinger && elementUnderFinger.dataset.index) {
    // Puedes acceder al índice del elemento bajo el dedo
    const overIndex = parseInt(elementUnderFinger.dataset.index)
    console.log('Elemento sobre el dedo:', overIndex)
  }
  const ownIndex = e.currentTarget.dataset.index
  console.log('Touch move', fromIndex.value, ownIndex)
  dropArea.value = {
    index: parseInt(ownIndex),
    direction: fromIndex.value > ownIndex ? 'bottom' : 'top'
  }
  console.log('Drop area', dropArea.value)
}

function onTouchEnd(e) {
  if (!draggingLayer.value) return
  const destination = e.currentTarget
  const toIndex = parseInt(destination.dataset.index, 10)
  document.swapLayers(fromIndex.value, toIndex)
  dropArea.value = {}
  draggingLayer.value = false
} */

const handleUpdateLayers = (e) => {
  console.log('Update layers', e)
  documentStore.swapLayers(e.oldIndex, e.newIndex)
}

const options = {
  delay: 250,
  delayOnTouchOnly: true
}
</script>

<template>
  <!--   <div class="layers">
    <Layer
      v-for="(layer, index) in layers.list"
      :key="layer.id"
      :index="index"
      :layer="layer"
      :active="layers.current.id === layer.id"
      :dropTop="dropArea?.index === index && dropArea?.direction === 'top'"
      :dropBottom="
        dropArea?.index === index && dropArea?.direction === 'bottom'
      "
      :settings="layers.settings?.id === layer.id"
      @settings="handleSettings(layer)"
      @visible="document.toggleLayer(layer)"
      @activate="document.setLayer(layer)"
      @touchstart="onTouchStart(index, layer)"
      @dragstart="onDragStart(index, layer)"
      @dragover="onDragOver"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @dragend="onDragEnd"
      @drop.capture="onDrop"
    />
  </div> -->
  <Sortable
    class="layers"
    itemKey="id"
    :list="documentStore.layers.list"
    :options="options"
    @end="handleUpdateLayers"
  >
    <template #item="{ element, index }">
      <Layer
        :index="index"
        :layer="element"
        :active="documentStore.layers.current.id === element.id"
        :settings="documentStore.layers.settings?.id === element.id"
        @settings="handleSettings(element)"
        @visible="documentStore.toggleLayer(element)"
        @activate="documentStore.setLayer(element)"
      />
    </template>
  </Sortable>
</template>

<style scoped>
.layers {
  display: grid;
  gap: var(--spaceS);
}
</style>
