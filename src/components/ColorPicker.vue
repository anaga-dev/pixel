<template>
  <Dropdown>
    <TabMenu>
      <Tab :active="mode === 'picker'" @click="mode = 'picker'">Picker</Tab>
      <Tab :active="mode === 'sliders'" @click="mode = 'sliders'">Sliders</Tab>
      <Tab :active="mode === 'hex-code'" @click="mode = 'hex-code'">Hex Code</Tab>
      <Tab :active="mode === 'palette'" @click="mode = 'palette'">Palette</Tab>
    </TabMenu>
    <div class="colors">
      <div class="color previous" :style="{ backgroundColor: previous }">
        <div class="color-name" :style="{ color: previous }">Previous</div>
      </div>
      <div class="color current" :style="{ backgroundColor: current }">
        <div class="color-name" :style="{ color: current }">Current</div>
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
          <Button v-for="key in [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F']" :key="key" @click="onKeyButton(key)">{{ key}}</Button>
        </div>
      </div>
      <div class="palette" v-else-if="mode === 'palette'">
        <Palette :selected-color="previous" :palette="document.palette" @select="onSelectColor" />
      </div>
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
import ColorSliders from '@components/ColorSliders.vue'
import Palette from '@components/Palette.vue'
import Button from '@components/Button.vue'
import Dropdown from '@components/Dropdown.vue'
import TabMenu from '@components/TabMenu.vue'
import Tab from '@components/Tab.vue'

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
.key-buttons {
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 1rem;
  display: none;
}

.key-button {
  padding: 1rem;
  font-size: 2rem;
  background: #4b4b4f;
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

@media (hover: none) {
  .key-buttons {
    display: grid;
  }
}
</style>
