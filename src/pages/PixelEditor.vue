<template>
  <div class="pixel-editor">
    <div class="top">
      <SettingsButton />
      <ToolSettings :tool="pixelDocument.tool" />
      <Zoom />
      <PointerStatus />
      <button @click="pixelDocument.exportAs">
        <i class="bx bx-download"></i>
      </button>
    </div>
    <div class="left">
      <Tools />
    </div>
    <div class="center" ref="center">
      <Document v-if="pixelDocument.canvas" />
    </div>
    <div class="right">
      <Panels>
        <Panel title="layers">
          <template v-slot:actions>
            <button type="button" @click="pixelDocument.addLayer">
              <i class="bx bx-add-to-queue"></i>
            </button>
          </template>
          <Layers :layers="pixelDocument.layers"></Layers>
        </Panel>
        <Panel title="palette">
          <template v-slot:actions>
            <button type="button" @click="pixelDocument.loadPalette">
              <i class="bx bx-file"></i>
            </button>
            <button type="button" @click="pixelDocument.savePalette">
              <i class="bx bx-file"></i>
            </button>
            <button type="button" @click="pixelDocument.addPaletteColor">
              <i class="bx bx-add-to-queue"></i>
            </button>
          </template>
          <Palette :palette="pixelDocument.palette" :selected-color="pixelDocument.color" @select="pixelDocument.setColor"></Palette>
        </Panel>
        <Panel title="preview" :scrollable="false" v-if="pixelDocument.canvas">
          <Preview></Preview>
        </Panel>
      </Panels>
    </div>
    <div class="bottom">
      <Animation />
    </div>
  </div>
  <LayerSettings v-if="pixelDocument.layers.settings" :layer="pixelDocument.layers.settings" />
  <Overlay v-if="pixelDocument.modal || !pixelDocument.canvas">
    <Modal v-if="!pixelDocument.canvas" title="Create document">
      <DocumentCreate />
    </Modal>
  </Overlay>
</template>

<script setup>
import { onBeforeMount, onMounted, onUnmounted, watch, ref } from 'vue'
import { useDocumentStore } from '../stores/PixelDocument'
import { useKeyShortcuts } from '../composables/useKeyShortcuts'
import { useTouch } from '../composables/useTouch'
import { useWheel } from '../composables/useWheel'
import SettingsButton from '../components/SettingsButton.vue'
import ToolSettings from '../components/ToolSettings.vue'
import Tools from '../components/pixel/Tools.vue'
import Panels from '../components/Panels.vue'
import Animation from '../components/Animation.vue'
import Zoom from '../components/Zoom.vue'
import Overlay from '../components/Overlay.vue'
import Modal from '../components/Modal.vue'
import Panel from '../components/Panel.vue'
import Palette from '../components/Palette.vue'
import Preview from '../components/Preview.vue'
import ColorPicker from '../components/ColorPicker.vue'
import PointerStatus from '../components/PointerStatus.vue'
import DownloadFile from '../components/DownloadFile.vue'
import Layers from '../components/pixel/Layers.vue'
import Document from '../components/pixel/Document.vue'
import DocumentCreate from '../components/pixel/DocumentCreate.vue'
import LayerSettings from '../components/pixel/LayerSettings.vue'

const center = ref()

const pixelDocument = useDocumentStore()

const touch = useTouch(document.body)
if (touch.supported) {
  watch(touch.distance, (value) => pixelDocument.zoom.relative(value))
  watch(touch.movement, (value) => pixelDocument.moveBy(value[0], value[1]))
}

useWheel((e) => {
  console.log(e.deltaX, e.deltaY, e.deltaZ, e.deltaMode)
  if (e.deltaY < 0) {
    pixelDocument.zoom.increase()
  } else {
    pixelDocument.zoom.decrease()
  }
}, center)

// TODO: Esto no tiene sentido que esté aquí
useKeyShortcuts(new Map([
  [['1'], () => pixelDocument.setTool('pencil')],
  [['2'], () => pixelDocument.setTool('eraser')],
  [['3'], () => pixelDocument.setTool('fill')],
  [['4'], () => pixelDocument.setTool('shape')],
  [['5'], () => pixelDocument.setTool('transform')],
  [['6'], () => pixelDocument.setTool('select')],
  [['7'], () => pixelDocument.toggleColorPicker()],
  [['z', 'ctrl'], () => pixelDocument.undo()],
  [['y', 'ctrl'], () => pixelDocument.redo()],
  [['arrowup'], () => pixelDocument.moveLayerUp()],
  [['arrowdown'], () => pixelDocument.moveLayerDown()],
  [['s'], () => pixelDocument.toggleSymmetry()],
  [[' '], () => pixelDocument.toggleAnimation()],
  [['+'], () => pixelDocument.zoom.increase()],
  [['-'], () => pixelDocument.zoom.decrease()],
  [['z'], () => pixelDocument.zoom.increase()],
  [['x'], () => pixelDocument.zoom.decrease()],
]))

</script>

<style scoped>
.pixel-editor {
  width: 100%;
  height: 100%;
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 2rem 1fr 16rem;
  grid-template-rows: 4rem 1fr 8rem;
  grid-template-areas:
    "top top top"
    "left center right"
    "bottom bottom bottom";
}

.top, .left, .right, .bottom {
  box-sizing: border-box;
  background: #2b2b2f;
}

.top {
  padding: 1rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-area: top;
  border-bottom: 1px solid #111;
}
.left {
  grid-area: left;
  padding-top: 1rem;
}

.center {
  grid-area: center;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.right {
  grid-area: right;
}

.bottom {
  grid-area: bottom;
  border-top: 1px solid #111;
  height: 8rem;
}
</style>
