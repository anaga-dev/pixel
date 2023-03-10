<template>
  <div class="layer-settings">
    <div class="header row">
      <div v-if="!editLayerName" class="name" @click="onToggleLayerNameEdit">
        {{ layer.name.value }}
        <i class="bx bx-edit"></i>
      </div>
      <input v-else type="text" v-focus v-model="layerName" @keypress="onKeyDown" />
      <div class="visibility" @click="document.toggleLayer(layer)">
        <i v-if="layer.visible" class="bx bx-show"></i>
        <i v-else class="bx bx-hide"></i>
      </div>
    </div>
    <!-- TODO: Muchos de estos elementos necesitan una llamada a `redrawAll` -->
    <div class="opacity row">
      <label for="opacity">Opacity</label>
      <input id="opacity" type="range" min="0" max="1" step="0.01" :value="layer.opacity.value" @input="document.setLayerOpacity(layer, $event.target.value)" />
    </div>
    <!-- TODO: Muchos de estos elementos necesitan una llamada a `redrawAll` -->
    <div class="blend-mode row">
      <label for="blend-mode">Blend mode</label>
      <select id="blend-mode" :value="layer.blendMode.value" @input="document.setLayerBlendMode(layer, $event.target.value)">
        <option v-for="[value, text] in blendModes" :key="value" :value="value">{{ text }}</option>
      </select>
    </div>
    <div class="actions row">
      <button type="button" class="pill" @click="document.duplicateLayer(layer)">
        <i class="bx bx-duplicate"></i>
        Duplicate
      </button>
      <button type="button" class="pill" @click="document.removeLayer(layer)">
        <i class="bx bx-trash"></i>
        Remove
      </button>
    </div>
  </div>
</template>

<script setup>
import { useDocumentStore } from '../../stores/PixelDocument'
import { readonly, ref, unref } from 'vue'

const document = useDocumentStore()

const props = defineProps({
  layer: {
    type: Object,
    required: true
  }
})

const editLayerName = ref()
const layerName = ref(unref(props.layer.name))
const blendModes = readonly([
  ['source-over', 'Normal'],
  ['multiply', 'Multiply'],
  ['screen', 'Screen'],
  ['overlay', 'Overlay'],
  ['darken', 'Darken'],
  ['lighten', 'Lighten'],
  ['color-dodge', 'Color dodge'],
  ['color-burn', 'Color burn'],
  ['hard-light', 'Hard light'],
  ['soft-light', 'Soft light'],
  ['difference', 'Difference'],
  ['exclusion', 'Exclusion'],
  ['hue', 'Hue'],
  ['saturation', 'Saturation'],
  ['color', 'Color'],
  ['luminosity', 'Luminosity'],
])

const vFocus = {
  mounted(el) {
    el.focus()
  }
}

function onToggleLayerNameEdit() {
  editLayerName.value = true
}

function onKeyDown(e) {
  if (e.code === 'Enter') {
    document.changeLayerName(props.layer, layerName.value)
    editLayerName.value = false
  }
}
</script>

<style scoped>
.layer-settings {
  position: fixed;
  top: 8rem;
  right: 16rem;
  min-width: 16rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #2b2b2f;
  border-radius: 0.5rem;
  box-shadow:
    0 0 1px rgba(0, 0, 0, 0.1),
    0 0 2px rgba(0, 0, 0, 0.1),
    0 0 4px rgba(0, 0, 0, 0.1),
    0 0 8px rgba(0, 0, 0, 0.1),
    0 0 16px rgba(0, 0, 0, 0.1),
    0 0 32px rgba(0, 0, 0, 0.1);
}

.row {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
}

.name {
  font-weight: bold;
}
</style>
