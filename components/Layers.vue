<script setup>
import { useDocumentStore } from '@/stores/document'
import { Sortable } from 'sortablejs-vue3'

const documentStore = useDocumentStore()

const handleSettings = (layer) => {
  documentStore.showLayerSettings(layer)
}

const handleUpdateLayers = (e) => {
  documentStore.swapLayers(e.oldIndex, e.newIndex)
}

const options = {
  delay: 250,
  delayOnTouchOnly: true
}
</script>

<template>
  <Sortable
    class="Layers"
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
.Layers {
  display: grid;
  gap: var(--spaceS);
}
</style>
