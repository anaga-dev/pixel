<template>
  <Dropdown class="layer-settings" @close="document.hideLayerSettings()">
    <header>
      <div v-if="!editLayerName" class="name" @click="onToggleLayerNameEdit">
        {{ layer.name.value }}
        <Icon i="edit" />
      </div>
      <input v-else type="text" v-focus v-model="layerName" @keydown="onKeyDown" />
    </header>
    <!-- TODO: Muchos de estos elementos necesitan una llamada a `redrawAll` -->
    <Field label="Opacity" for="opacity" class="opacity">
      <div class="layer-visibility">
        <Slider
          id="opacity"
          :min="0"
          :max="100"
          :step="1"
          :modelValue="layer.opacityPercentage.value"
          @update:modelValue="document.setLayerOpacity(layer, $event)" />
        <Button :label="layer.visible ? 'Hide layer' : 'Show layer'" variant="ghost" @click="document.toggleLayer(layer)">
          <Icon :i="layer.visible ? 'visible' : 'hidden'" />
        </Button>
      </div>
    </Field>
    <!-- TODO: Muchos de estos elementos necesitan una llamada a `redrawAll` -->
    <Field label="Blend mode"  for="blend-mode">
      <Select id="blend-mode" :modelValue="layer.blendMode.value" @update:modelValue="document.setLayerBlendMode(layer, $event)">
        <option v-for="[value, text] in blendModes" :key="value" :value="value">{{ text }}</option>
      </Select>
    </Field>
    <div class="actions">
      <Button label="Duplicate layer" @click="document.duplicateLayer(layer)">
        <Icon i="duplicate" />
        Duplicate
      </Button>
      <Button label="Remove layer" variant="critical" @click="onDelete(layer)">
        <Icon i="delete" />
        Delete
      </Button>
    </div>
  </Dropdown>
</template>

<script setup>
import { readonly, ref, unref } from 'vue'
import { useDocumentStore } from '@/stores/PixelDocument'
import Dropdown from '@/components/Dropdown.vue'
import Button from '@/components/Button.vue'
import Field from '@/components/Field.vue'
import Icon from '@/components/Icon.vue'
import Select from '@/components/Select.vue'
import Slider from '@/components/Slider.vue'

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
  if (e.key === 'Enter') {
    document.changeLayerName(props.layer, layerName.value)
    editLayerName.value = false
  }
  if (e.key === 'Escape') {
    editLayerName.value = false
  }
}

function onDelete(layer) {
  document.removeLayer(layer)
  document.hideLayerSettings()
}
</script>

<style scoped>
.layer-settings {
  top: calc(var(--widthToolbar) + var(--spaceS));
  right: calc(var(--widthPanels) + var(--spaceS));
  min-width: 20rem;
}

.name {
  font-weight: bold;
  height: var(--spaceXL);
  display: grid;
  grid-template-columns: auto auto;
  gap: var(--spaceM);
  align-items: center;
  justify-content: start;
}

.layer-visibility {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spaceS);
}

input {
  width: 100%;
}

.actions {
  display: grid;
  grid-auto-flow: row;
  gap: var(--spaceS);
}
</style>
