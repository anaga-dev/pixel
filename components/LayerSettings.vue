<template>
  <Dropdown class="LayerSettings" @close="document.hideLayerSettings()">
    <div v-if="!editLayerName" class="name" @click="onToggleLayerNameEdit">
      {{ layer.name.value }}
    </div>
    <input
      v-else
      type="text"
      v-focus
      v-model="layerName"
      @keydown="onKeyDown"
    />
    <!-- TODO: Many of these elements need to make a call to `redrawAll` -->
    <Field :label="$t('opacity')" for="opacity" class="opacity">
      <div class="layer-visibility">
        <Slider
          id="opacity"
          :min="0"
          :max="100"
          :step="1"
          :modelValue="layer.opacityPercentage.value"
          @update:modelValue="document.setLayerOpacity(layer, $event)"
        />
        <Button
          :label="
            layer.visible.value
              ? $t('studio.hide-layer')
              : $t('studio.show-layer')
          "
          variant="ghost"
          @click="document.toggleLayer(layer)"
        >
          <Icon :i="layer.visible.value ? 'visible' : 'hidden'" />
        </Button>
      </div>
    </Field>
    <!-- TODO: Many of these elements need to make a call to `redrawAll` -->
    <Field :label="$t('blend-mode')" for="blend-mode">
      <Select
        id="blend-mode"
        :modelValue="layer.blendMode.value"
        @update:modelValue="document.setLayerBlendMode(layer, $event)"
      >
        <option v-for="[value, text] in blendModes" :key="value" :value="value">
          {{ text }}
        </option>
      </Select>
    </Field>
    <div class="actions">
      <Button
        :label="$t('studio.duplicate-layer')"
        @click="document.duplicateLayer(layer)"
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

<script setup>
import { useDocumentStore } from '@/stores/document'

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
  ['luminosity', 'Luminosity']
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
.LayerSettings {
  top: calc(var(--widthToolbar) + var(--spaceS));
  right: calc(var(--widthSidebar) + var(--widthToolbar) + var(--spaceS));
  width: 20rem;
  display: grid;
  justify-content: stretch;
  gap: var(--spaceS);
}

.name {
  max-width: 100%;
  font-weight: bold;
  height: var(--spaceXL);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
