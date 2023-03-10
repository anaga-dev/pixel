<template>
  <div class="color-picker">
    <div class="tabs">
      <button class="tab" :class="{ active: mode === 'picker' }" @click="mode = 'picker'">
        Picker
      </button>
      <button class="tab" :class="{ active: mode === 'sliders' }" @click="mode = 'sliders'">
        Sliders
      </button>
      <button class="tab" :class="{ active: mode === 'hex-code' }" @click="mode = 'hex-code'">
        Hex Code
      </button>
      <button class="tab" :class="{ active: mode === 'palette' }" @click="mode = 'palette'">
        Palette
      </button>
    </div>
    <div class="colors">
      <div class="color previous" :style="{ backgroundColor: previous }">
        <div class="color-name" :style="{ color: previous }">previous</div>
      </div>
      <div class="color current" :style="{ backgroundColor: current }">
        <div class="color-name" :style="{ color: current }">current</div>
      </div>
    </div>
    <div class="content">
      <div class="picker" v-if="mode === 'picker'">
        <CombinedColorPicker :hue="combinedHue" v-model="current" />
        <HuePicker v-model="combinedHue" />
      </div>
      <div class="sliders" v-else-if="mode === 'sliders'">
        <ColorSliders v-model="current" />
      </div>
      <div class="hex-code" v-else-if="mode === 'hex-code'">
        #<input type="text" pattern="[A-Fa-f0-9]{6}" minlength="6" maxlength="6" v-model="hexColor" />
        <!-- TODO: Esto debería ser sólo visible desde tablet -->
        <div class="key-buttons">
          <button type="button" class="key-button" v-for="key in [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F']" :key="key" @click="onKeyButton(key)">{{ key}}</button>
        </div>
      </div>
      <div class="palette" v-else-if="mode === 'palette'">
        <Palette :selected-color="previous" :palette="document.palette" @select="onSelectColor" />
      </div>
    </div>
    <button type="button" class="pill" @click="onOk">
      Ok
    </button>
  </div>
</template>

<script setup>
import Color from '../color/Color'
import { readonly, ref } from 'vue'
import { useDocumentStore } from '../stores/PixelDocument'
import HuePicker from './HuePicker.vue'
import CombinedColorPicker from './CombinedColorPicker.vue'
import ColorSliders from './ColorSliders.vue'
import Palette from './Palette.vue'

const document = useDocumentStore()

const previous = readonly(document.color)
const current = ref(document.color)

const parsedColor = Color.parse(current.value)

const mode = ref('picker')
const hue = ref(Color.hue(parsedColor))
const combinedHue = ref(hue)
const saturation = ref(Color.saturation(parsedColor))
const lightness = ref(Color.lightness(parsedColor))
const red = ref(parsedColor[0] * 255)
const green = ref(parsedColor[1] * 255)
const blue = ref(parsedColor[2] * 255)
const hexColor = ref(Color.stringify(parsedColor, 'hex').slice(1, 7))

function onSelectColor(color) {
  current.value = color
}

function onKeyButton(key) {
  console.log(key)
}

function onOk() {
  document.setColor(current.value)
}
</script>

<style scoped>
.color-picker {
  position: fixed;
  top: 8rem;
  left: 4rem;
  width: 24rem;
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
  z-index: 1000;
}

.tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.key-buttons {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 1rem;
}

.key-button {
  padding: 1rem;
  font-size: 2rem;
  border-radius: 0.5rem;
  background: #4b4b4f;
}

.form-input {
  display: flex;
  justify-content: space-between;
}

.colors {
  display: flex;
}

.color {
  flex: 1 0 auto;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.color-name {
  filter: invert(100%);
  text-shadow: 1px 1px rgba(0,0,0,0.5);
}

.color:first-of-type {
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}
.color:last-of-type {
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}
</style>
