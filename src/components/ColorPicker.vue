<template>
  <Dropdown>
    <div class="colors">
      <div class="color previous" :style="{ backgroundColor: previous }">
        <div class="color-name" :style="{ color: previous }">Previous</div>
      </div>
      <div class="color current" :style="{ backgroundColor: current }">
        <div class="color-name" :style="{ color: current }">Current</div>
      </div>
    </div>
    <div class="content">
      <CombinedColorPicker :hue="combinedHue" v-model="current" />
      <HuePicker v-model="combinedHue" />
      <TabMenu>
        <Tab :active="mode === 'hex'" @click="mode = 'hex'">Hex</Tab>
        <Tab :active="mode === 'hsl'" @click="mode = 'hsl'">HSL</Tab>
        <Tab :active="mode === 'rgb'" @click="mode = 'rgb'">RGB</Tab>
        <Tab :active="mode === 'palette'" @click="mode = 'palette'">Palette</Tab>
      </TabMenu>
      <ColorHex v-if="mode === 'hex'" v-model="current" />
      <ColorHSL v-else-if="mode === 'hsl'" v-model="current" />
      <ColorRGB v-else-if="mode === 'rgb'" v-model="current" />
      <Palette v-else-if="mode === 'palette'" :selected-color="previous" :palette="document.palette" @select="onSelectColor" />
    </div>
    <Button label="Accept" @click="onOk">
      Accept
    </Button>
  </Dropdown>
</template>

<script setup>
import Color from '@/color/Color'
import { readonly, ref } from 'vue'
import { useDocumentStore } from '@/stores/PixelDocument'
import HuePicker from '@components/HuePicker.vue'
import CombinedColorPicker from '@components/CombinedColorPicker.vue'
import ColorHex from '@components/ColorHex.vue'
import ColorHSL from '@components/ColorHSL.vue'
import ColorRGB from '@components/ColorRGB.vue'
import Palette from '@components/Palette.vue'
import Button from '@components/Button.vue'
import Dropdown from '@components/Dropdown.vue'
import TabMenu from '@components/TabMenu.vue'
import Tab from '@components/Tab.vue'

const document = useDocumentStore()

const previous = readonly(document.color)
const current = ref(document.color)

const parsedColor = ref(Color.parse(current.value))

const mode = ref('hex')
const hue = ref(Color.hue(parsedColor.value))
const combinedHue = ref(hue)
const hexColor = ref(Color.stringify(parsedColor.value, 'hex').slice(1, 7))

function onSelectColor(color) {
  current.value = color
}

function onOk() {
  document.setColor(current.value)
}
</script>

<style scoped>
.content {
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
