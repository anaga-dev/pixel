<script setup>
import { useDocumentStore } from '@/stores/document'

const documentStore = useDocumentStore()

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
  ['luminosity', 'Luminosity']
])

function onToggleLayerNameEdit() {
  editLayerName.value = true
}

function onKeyDown(e) {
  if (e.key === 'Enter') {
    documentStore.changeLayerName(props.layer, layerName.value)
    editLayerName.value = false
  }
  if (e.key === 'Escape') {
    editLayerName.value = false
  }
}

function onDelete(layer) {
  documentStore.removeLayer(layer)
  documentStore.hideLayerSettings()
}
</script>

<template>
  <Dropdown
    class="LayerSettings"
    @close="documentStore.hideLayerSettings()"
  >
    <div
      v-if="!editLayerName"
      class="name"
      @click="onToggleLayerNameEdit"
    >
      {{ layer.name.value }}
    </div>
    <input
      v-else
      v-model="layerName"
      v-focus
      type="text"
      @keydown="onKeyDown"
    >
    <!-- TODO: Many of these elements need to make a call to `redrawAll` -->
    <Field
      :label="$t('opacity')"
      for="opacity"
      class="opacity"
    >
      <div class="layer-visibility">
        <Slider
          id="opacity"
          :min="0"
          :max="100"
          :step="1"
          :model-value="layer.opacityPercentage.value"
          @update:model-value="documentStore.setLayerOpacity(layer, $event)"
        />
        <Button
          :label="
            layer.visible.value
              ? $t('studio.hide-layer')
              : $t('studio.show-layer')
          "
          variant="ghost"
          @click="documentStore.toggleLayer(layer)"
        >
          <Icon :i="layer.visible.value ? 'visible' : 'hidden'" />
        </Button>
      </div>
    </Field>
    <!-- TODO: Many of these elements need to make a call to `redrawAll` -->
    <Field
      :label="$t('blend-mode')"
      for="blend-mode"
    >
      <Select
        id="blend-mode"
        :model-value="layer.blendMode.value"
        @update:model-value="documentStore.setLayerBlendMode(layer, $event)"
      >
        <option
          v-for="[value, text] of blendModes"
          :key="value"
          :value="value"
        >
          {{ text }}
        </option>
      </Select>
    </Field>
    <div class="actions">
      <Button
        :label="$t('studio.duplicate-layer')"
        @click="documentStore.duplicateLayer(layer)"
      >
        <Icon i="duplicate" />
        {{ $t('studio.duplicate-layer') }}
      </Button>
      <Button
        :label="$t('studio.delete-layer')"
        variant="critical"
        @click="onDelete(layer)"
      >
        <Icon i="delete" />
        {{ $t('delete') }}
      </Button>
    </div>
  </Dropdown>
</template>

<style scoped>
.LayerSettings {
  width: 20rem;
  display: grid;
  justify-content: stretch;
  gap: var(--space-s);
}

.name {
  max-width: 100%;
  font-weight: bold;
  height: var(--space-xl);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.layer-visibility {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-s);
}

input {
  width: 100%;
}

.actions {
  display: grid;
  grid-auto-flow: row;
  gap: var(--space-s);
}
</style>
