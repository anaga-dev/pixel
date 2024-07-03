<template>
  <Dropdown class="ColorPicker">
    <div class="picker">
      <div class="colors">
        <div class="samples">
          <div
            class="sample previous"
            :style="{ backgroundColor: previous }"
          />
          <div
            class="sample current"
            :style="{ backgroundColor: current.style.value }"
          />
        </div>
        <Tooltip
          message="studio.tooltips.add-to-palette"
          position="right"
        >
          <Button
            :label="$t('studio.add-to-palette')"
            variant="ghost"
            @click="documentStore.addPaletteColor()"
          >
            <Icon i="add-to-palette" />
          </Button>
        </Tooltip>
      </div>
      <CombinedColorPicker :color="current" @update="onUpdate" />
      <HuePicker :color="current" @update="onUpdate" />
    </div>
    <div class="controls">
      <TabMenu>
        <Tab
          :active="documentStore.colorMode === ColorMode.HEX"
          @click="documentStore.setColorMode(ColorMode.HEX)"
        >
          Hex
        </Tab>
        <Tab
          :active="documentStore.colorMode === ColorMode.HSL"
          @click="documentStore.setColorMode(ColorMode.HSL)"
        >
          HSL
        </Tab>
        <Tab
          :active="documentStore.colorMode === ColorMode.RGB"
          @click="documentStore.setColorMode(ColorMode.RGB)"
        >
          RGB
        </Tab>
      </TabMenu>
      <ColorHex
        v-if="documentStore.colorMode === ColorMode.HEX"
        :color="current"
        @update="onUpdateHex"
      />
      <ColorHSL
        v-else-if="documentStore.colorMode === ColorMode.HSL"
        :color="current"
      />
      <ColorRGB
        v-else-if="documentStore.colorMode === ColorMode.RGB"
        :color="current"
      />
    </div>
  </Dropdown>
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'
import { useColor } from '@/composables/useColor'
import ColorMode from '@/pixel/enums/ColorMode'

const documentStore = useDocumentStore()

const previous = readonly(ref(documentStore.color))
const current = useColor(documentStore.color)

function onUpdateHex(color) {
  current.red.value = color.red
  current.green.value = color.green
  current.blue.value = color.blue
}

function onUpdate(color) {
  documentStore.setColor(color)
}

/*
watch(
  () => current.style.value,
  (newValue) => {
    documentStore.setColor(newValue)
  }
)
*/
</script>

<style scoped>
.ColorPicker {
  left: calc(var(--size-toolbar) + var(--space-s));
  top: 50%;
  translate: 0% -50%;
  display: grid;
  grid-auto-flow: row;
  gap: var(--space-m);
}

.form-input {
  display: flex;
  justify-content: space-between;
}

.colors {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-s);
  align-items: center;
}

.samples {
  display: grid;
  grid-template-columns: 1fr 2fr;
  clip-path: var(--clip-corners);
  overflow: hidden;
}

.sample {
  padding: var(--space-m);
  display: grid;
  place-content: center;
}

.color-name {
  text-transform: uppercase;
  font-weight: bold;
  filter: invert(100%);
}

.picker,
.controls {
  display: grid;
  grid-auto-flow: row;
  gap: var(--space-s);
}

@media (max-height: 640px) {
  .ColorPicker {
    grid-template-columns: 24vw 1fr;
    gap: var(--space-l);
    left: 9rem;
  }
}
</style>
