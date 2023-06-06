<template>
  <div class="ColorPicker">
    <div class="colors">
      <div class="color previous" :style="{ backgroundColor: previous }">
        <div class="color-name" :style="{ color: previous }">Previous</div>
      </div>
      <div class="color current" :style="{ backgroundColor: current.style.value }">
        <div class="color-name" :style="{ color: previous }">Current</div>
      </div>
    </div>
    <CombinedColorPicker :color="current" />
    <HuePicker :color="current" />
    <TabMenu>
      <Tab :active="documentStore.colorMode === ColorMode.PALETTE" @click="documentStore.setColorMode(ColorMode.PALETTE)">Palette</Tab>
      <Tab :active="documentStore.colorMode === ColorMode.HEX" @click="documentStore.setColorMode(ColorMode.HEX)">Hex</Tab>
      <Tab :active="documentStore.colorMode === ColorMode.HSL" @click="documentStore.setColorMode(ColorMode.HSL)">HSL</Tab>
      <Tab :active="documentStore.colorMode === ColorMode.RGB" @click="documentStore.setColorMode(ColorMode.RGB)">RGB</Tab>
    </TabMenu>
    <ColorHex v-if="documentStore.colorMode === ColorMode.HEX" :color="current" @update="onUpdateHex" />
    <ColorHSL v-else-if="documentStore.colorMode === ColorMode.HSL" :color="current" />
    <ColorRGB v-else-if="documentStore.colorMode === ColorMode.RGB" :color="current" />
    <Palette v-else-if="documentStore.colorMode === ColorMode.PALETTE" :selected-color="previous" :palette="documentStore.palette" @select="onSelectColor" />
  </div>
</template>

<script setup>
import { onMounted, readonly, ref, watch } from 'vue'
import { useDocumentStore } from '@/stores/DocumentStore'
import { useColor } from '@/composables/useColor'
import HuePicker from '@/components/HuePicker.vue'
import CombinedColorPicker from '@/components/CombinedColorPicker.vue'
import ColorHex from '@/components/ColorHex.vue'
import ColorHSL from '@/components/ColorHSL.vue'
import ColorRGB from '@/components/ColorRGB.vue'
import ColorMode from '@/enums/ColorMode'
import Palette from '@/components/Palette.vue'
import Button from '@/components/Button.vue'
import TabMenu from '@/components/TabMenu.vue'
import Tab from '@/components/Tab.vue'

const documentStore = useDocumentStore()

const previous = readonly(ref(documentStore.color))
const current = useColor(documentStore.color)

function onUpdateHex(color) {
  current.red.value = color.red
  current.green.value = color.green
  current.blue.value = color.blue
}

function onSelectColor(newStyle) {
  current.style.value = newStyle
}

function onUpdate() {
  documentStore.setColor(current.style.value)
}

watch(() => current.style.value, (oldValue, newValue) => {
  console.log('new value', newValue)
  documentStore.setColor(current.style.value)
})

onMounted(() => {
  console.log('current color', current.style.value)
})
</script>

<style scoped>
.ColorPicker   {
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
