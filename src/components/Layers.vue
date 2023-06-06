<template>
  <div class="layers">
    <Layer
      v-for="(layer, index) in layers.list"
      :key="layer.id"
      :index="index"
      :layer="layer"
      :active="layers.current.id === layer.id"
      :settings="layers.settings?.id === layer.id"
      @settings="handleSettings(layer)"
      @visible="document.toggleLayer(layer)"
      @activate="document.setLayer(layer)" />
  </div>
</template>

<script setup>
import { useDocumentStore } from '@/stores/DocumentStore'
import Layer from '@/components/Layer.vue'

const document = useDocumentStore()

const props = defineProps({
  layers: {
    type: Object,
    required: true,
  }
})

const handleSettings = (layer) => {
  document
  document.showLayerSettings(layer)
}
</script>

<style scoped>
.layers {
  display: flex;
  flex-direction: column-reverse;
  gap: var(--spaceS);
}
</style>
