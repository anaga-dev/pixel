<template>
  <div class="document-create">
    <form class="form" @submit.prevent="onSubmit">
      <!--

        Tamaños típicos:

        8x8
        16x16
        32x32
        64x64
        128x128
        256x256
        512x512

        240x160 GBA
        160x144 GB
        256x192 Canvas
        480x270 Widescreen
        640x360

      -->
      <div class="presets">
        <label for="preset">Preset</label>
        <select id="preset" v-model="preset">
          <option value="custom">Custom</option>
          <option value="8x8">8x8</option>
          <option value="16x16">16x16</option>
          <option value="32x32">32x32</option>
          <option value="64x64">64x64</option>
          <option value="128x128">128x128</option>
          <option value="256x256">256x256</option>
          <option value="512x512">512x512</option>
          <option value="240x160">Gameboy Advance</option>
          <option value="160x144">Gameboy</option>
          <option value="256x192">Canvas</option>
          <option value="480x270">Widescreen</option>
          <option value="640x360">16:9</option>
        </select>
      </div>
      <div class="size">
        <div class="form-input">
          <label for="width">Width</label>
          <input type="number" min="1" max="4096" v-model="width" />
        </div>
        <button type="button" class="pill" @click="onLink">
          <i v-if="!linked" class="bx bx-link"></i>
          <i v-else class="bx bx-unlink"></i>
        </button>
        <div class="form-input">
          <label for="height">Height</label>
          <input type="number" min="1" max="4096" v-model="height" :disabled="linked" />
        </div>
      </div>
      <div class="palette">
        <label for="palette">Palette</label>
        <select id="palette" v-model="palette">
          <option value="palettes/cga.json">CGA</option>
          <option value="palettes/gameboy.json">Gameboy</option>
          <option value="palettes/edg77.json">EDG77</option>
          <option value="palettes/edg32.json">EDG32</option>
          <option value="palettes/edg16.json">EDG16</option>
          <option value="palettes/lospec500.json">LOSPEC 500</option>
          <option value="palettes/pico8.json">PICO-8</option>
          <option value="palettes/resurrect64.json">Resurrect 64</option>
          <option value="palettes/sweetie16.json">Sweetie 16</option>
          <option value="palettes/vinik24.json">Vinik 24</option>
          <option value="palettes/zughy32.json">Ziggy 32</option>
          <option value="palettes/commodore64.json">Commodore 64</option>
        </select>
      </div>
      <button type="submit" class="pill">
        Create
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDocumentStore } from '../../stores/PixelDocument'

const document = useDocumentStore()

const preset = ref('custom')
const palette = ref('palettes/edg77.json')
const width = ref(32)
const height = ref(32)
const linked = ref(false)

watch(preset, (value) => {
  if (value !== 'custom') {
    const [w, h] = value.split('x')
    linked.value = false
    width.value = parseInt(w, 10)
    height.value = parseInt(h, 10)
  }
})

watch(width, (value) => {
  if (linked.value) {
    height.value = value
  }
})

function onLink() {
  linked.value = !linked.value
  if (linked.value) {
    height.value = width.value
  }
}

// TODO: ¿Debería mover esto a la store del documento?
async function loadPalette(url) {
  const baseURL = import.meta.env.BASE_URL
  const response = await fetch(`${baseURL}${url}`)
  return response.json()
}

async function onSubmit() {
  const paletteData = await loadPalette(palette.value)
  document.create(width.value, height.value, paletteData)
}
</script>

<style scoped>
.document-create, .form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.size {
  display: flex;
  gap: 1rem;
}

label {
  margin-right: 0.5rem;
}
</style>
