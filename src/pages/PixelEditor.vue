<template>
  <div class="CONTAINER">
    <div class="SETTINGS">
      <Settings>
        <template #left>
          <SettingsButton />
          <Divider vertical />
          <ToolSettings :tool="pixelDocument.tool" />
        </template>
        <template #right>
          <Button
            label="Symmetry aid"
            variant="ghost"
            :active="pixelDocument.symmetry.axis !== null"
            @click="pixelDocument.toggleSymmetrySettings">
            <Icon i="symmetry-vertical" v-if="pixelDocument.symmetry.axis === 'vertical'" />
            <Icon i="symmetry-two-axis" v-else-if="pixelDocument.symmetry.axis === 'both'" />
            <Icon i="symmetry-horizontal" v-else />
          </Button>
          <SymmetrySettings v-if="pixelDocument.symmetrySettings" @close="pixelDocument.toggleSymmetrySettings" />
          <!--<PointerStatus />-->
          <Divider vertical />
          <Zoom />
          <Divider vertical />
          <Button label="Export document" variant="primary" @click="pixelDocument.exportAs">
            Export
          </Button>
        </template>
      </Settings>
    </div>
    <div class="TOOLS">
      <Tools />
    </div>
    <main class="BOARD" ref="center">
      <Document v-if="pixelDocument.canvas" />
    </main>
    <aside class="PANELS">
      <Panel title="Layers">
        <template #actions>
          <Button label="Add layer" variant="ghost" @click="pixelDocument.addLayer">
            <Icon i="add-item" />
          </Button>
        </template>
        <Layers :layers="pixelDocument.layers"></Layers>
      </Panel>
      <Panel title="Palette">
        <template #actions>
          <Button label="Load palette" variant="ghost" @click="pixelDocument.loadPalette">
            <Icon i="load" />
          </Button>
          <Button label="Save palette" variant="ghost" @click="pixelDocument.savePalette">
            <Icon i="save" />
          </Button>
          <Button label="Create new palette" variant="ghost" @click="pixelDocument.addPaletteColor">
            <Icon i="add-item" />
          </Button>
        </template>
        <Palette :palette="pixelDocument.palette" :selected-color="pixelDocument.color" @select="pixelDocument.setColor"></Palette>
      </Panel>
      <Panel title="preview" :scrollable="false" v-if="pixelDocument.canvas">
        <Preview></Preview>
      </Panel>
    </aside>
    <div class="ANIMATION">
      <Animation />
    </div>
  </div>
  <LayerSettings v-if="pixelDocument.layers.settings" :layer="pixelDocument.layers.settings" />
  <DocumentCreate v-if="!pixelDocument.canvas" />
</template>

<script setup>
import { onBeforeMount, onMounted, onUnmounted, watch, ref } from 'vue'
import { useDocumentStore } from '@/stores/PixelDocument'
import { useKeyShortcuts } from '@/composables/useKeyShortcuts'
import { useTouch } from '@/composables/useTouch'
import { useWheel } from '@/composables/useWheel'
import SettingsButton from '@components/SettingsButton.vue'
import ToolSettings from '@components/ToolSettings.vue'
import Tools from '@components/pixel/Tools.vue'
import Animation from '@components/Animation.vue'
import Zoom from '@components/Zoom.vue'
import Panel from '@components/Panel.vue'
import Palette from '@components/Palette.vue'
import Preview from '@components/Preview.vue'
import ColorPicker from '@components/ColorPicker.vue'
import PointerStatus from '@components/PointerStatus.vue'
import Layers from '@components/pixel/Layers.vue'
import Document from '@components/pixel/Document.vue'
import DocumentCreate from '@components/pixel/DocumentCreate.vue'
import LayerSettings from '@components/pixel/LayerSettings.vue'
import Settings from '@components/Settings.vue'
import Button from '@components/Button.vue'
import Divider from '@components/Divider.vue'
import SymmetrySettings from '@components/SymmetrySettings.vue'
import Icon from '@components/Icon.vue'

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
  [['0', 'ctrl'], () => pixelDocument.zoom.reset()],
  [['+'], () => pixelDocument.zoom.increase()],
  [['='], () => pixelDocument.zoom.increase()],
  [['z'], () => pixelDocument.zoom.increase()],
  [['-'], () => pixelDocument.zoom.decrease()],
  [['x'], () => pixelDocument.zoom.decrease()],
]))

</script>

<style scoped>
.CONTAINER {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: var(--widthToolbar) 1fr var(--widthPanels);
  grid-template-rows: var(--widthToolbar) 1fr auto;
}

.SETTINGS, .TOOLS, .PANELS, .ANIMATION {
  background-color: var(--colorLayer1);
  background-color: transparent;
}

.SETTINGS {
  grid-area: SETTINGS;
  grid-column: 1 / span 3;
  grid-row: 1;
  background-color: var(--colorLayer1);
  box-shadow: 0 var(--spaceXS) 0 var(--colorShadow);
  z-index: 3;
}
.TOOLS {
  display: grid;
  align-items: center;
  grid-area: TOOLS;
  grid-column: 1;
  grid-row: 2;
  z-index: 2;

}

.BOARD {
  grid-area: BOARD;
  grid-column: 1 / span 3;
  grid-row: 1 / span 3;
  display: grid;
  place-items: center;
  overflow: hidden;
  background-color: var(--colorLayer0);
  z-index: 1;
}

.PANELS {
  grid-area: PANELS;
  grid-column: 3;
  grid-row: 2;
  z-index: 2;
  background-color: var(--colorLayer1);
  box-shadow:
    inset 0 var(--spaceS) 0 var(--colorShadow),
    inset 0 calc(0rem - var(--spaceXS)) 0 var(--colorShadow);
}

.ANIMATION {
  grid-area: ANIMATION;
  grid-column: 1 / span 3;
  grid-row: 3;
  z-index: 2;
  background-color: var(--colorLayer1);
}
</style>
