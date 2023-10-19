<template>
  <Dropdown class="ColorPicker">
    <div class="colors">
      <div class="color previous" :style="{ backgroundColor: previous }">
        <div class="color-name" :style="{ color: previous }">
          {{ $t('previous') }}
        </div>
      </div>
      <div
        class="color current"
        :style="{ backgroundColor: current.style.value }"
      >
        <div class="color-name" :style="{ color: previous }">
          {{ $t('current') }}
        </div>
      </div>
    </div>
    <CombinedColorPicker :color="current" />
    <HuePicker :color="current" />
    <TabMenu>
      <Tab
        :active="documentStore.colorMode === ColorMode.HEX"
        @click="documentStore.setColorMode(ColorMode.HEX)"
        >Hex</Tab
      >
      <Tab
        :active="documentStore.colorMode === ColorMode.HSL"
        @click="documentStore.setColorMode(ColorMode.HSL)"
        >HSL</Tab
      >
      <Tab
        :active="documentStore.colorMode === ColorMode.RGB"
        @click="documentStore.setColorMode(ColorMode.RGB)"
        >RGB</Tab
      >
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

watch(
  () => current.style.value,
  (newValue) => {
    documentStore.setColor(newValue)
  }
)
</script>

<style scoped>
.ColorPicker {
  left: calc(var(--widthToolbar) + var(--spaceS));
  top: 50%;
  translate: 0% -50%;
  display: grid;
  grid-auto-flow: row;
  gap: var(--spaceM);
}

.form-input {
  display: flex;
  justify-content: space-between;
}

.colors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  clip-path: var(--pixelCorners);
  overflow: hidden;
}

.color {
  padding: var(--spaceM);
  display: grid;
  place-content: center;
}

.color-name {
  text-transform: uppercase;
  font-weight: bold;
  filter: invert(100%);
}
</style>
