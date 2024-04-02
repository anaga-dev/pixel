<script setup>
import { useDocumentStore } from '@/stores/document'

const documentStore = useDocumentStore()

const emit = defineEmits(['created'])

const name = ref('Untitled')
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

// TODO: Show we move this to the document store?
async function loadPalette(url) {
  const baseURL = import.meta.env.BASE_URL
  const response = await fetch(`${baseURL}${url}`)
  return response.json()
}

async function onSubmit() {
  const paletteData = await loadPalette(palette.value)
  documentStore.create({
    width: width.value,
    height: height.value,
    palette: paletteData,
    name: name.value
  })
  emit('created')
}
</script>

<template>
  <Modal :title="$t('create-new-document')" nondismissable>
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
      <Field :label="$t('name')" for="name">
        <input id="name" type="text" v-model="name" />
      </Field>
      <Field :label="$t('studio.preset')" for="preset">
        <Select id="preset" v-model="preset">
          <option value="custom">{{ $t('custom') }}</option>
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
        </Select>
      </Field>
      <div class="size">
        <Field :label="$t('width')" for="width">
          <input type="number" min="1" max="4096" v-model="width" />
        </Field>
        <Button
          :label="$t('studio.lock-aspect-ratio')"
          variant="ghost"
          @click="onLink"
        >
          <Icon i="linked" v-if="linked" />
          <Icon i="unlinked" v-else />
        </Button>
        <Field :label="$t('height')" for="height">
          <input
            type="number"
            min="1"
            max="4096"
            v-model="height"
            :disabled="linked"
          />
        </Field>
      </div>
      <Field :label="$t('palette')" for="palette">
        <Select id="palette" v-model="palette">
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
        </Select>
      </Field>
      <Button
        :label="$t('create-new-document')"
        type="submit"
        variant="primary"
        >{{ $t('create') }}</Button
      >
    </form>
  </Modal>
</template>

<style scoped>
form {
  display: grid;
  grid-auto-flow: row;
  gap: var(--spaceL);
}
.size {
  display: grid;
  grid-auto-flow: column;
  align-items: end;
  justify-content: start;
  gap: var(--spaceM);
}
</style>
