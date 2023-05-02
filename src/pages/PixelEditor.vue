<template>
  <div class="CONTAINER">
    <div class="SETTINGS">
      <SettingsBar>
        <template #left>
          <ToolSettings :tool="documentStore.tool" />
        </template>
        <template #right>
          <Button
            label="Symmetry aid"
            variant="ghost"
            :active="pixelDocument.symmetry.axis !== null"
            @click.stop="pixelDocument.toggleSymmetrySettings">
            <Icon i="symmetry-vertical" v-if="pixelDocument.symmetry.axis === 'vertical'" />
            <Icon i="symmetry-two-axis" v-else-if="pixelDocument.symmetry.axis === 'both'" />
            <Icon i="symmetry-horizontal" v-else />
          </Button>
          <Divider vertical />
          <Zoom />
          <Divider vertical />
          <SettingsButton />
        </template>
      </SettingsBar>
    </div>
    <div class="TOOLS">
      <Tools />
    </div>
    <main class="BOARD" ref="board">
      <Document v-if="documentStore.canvas" />
      <Selection v-if="documentStore.canvas && documentStore.tool === Tool.SELECT" />
    </main>
    <aside class="PANELS">
      <Panel title="Layers" @collapse="$event => ui.collapsePanelLayers($event)" :collapsed="ui.panels.layers">
        <template #actions>
          <Button label="Add layer" variant="ghost" @click="documentStore.addLayer">
            <Icon i="add-item" />
          </Button>
        </template>
        <Layers :layers="documentStore.layers"></Layers>
      </Panel>
      <Panel title="Palette" @collapse="$event => ui.collapsePanelPalette($event)" :collapsed="ui.panels.palette">
        <template #actions>
          <Button label="Load palette" variant="ghost" @click="documentStore.loadPalette">
            <Icon i="load" />
          </Button>
          <Button label="Save palette" variant="ghost" @click="documentStore.savePalette">
            <Icon i="save" />
          </Button>
          <Button label="Create new palette" variant="ghost" @click="documentStore.addPaletteColor">
            <Icon i="add-item" />
          </Button>
        </template>
        <Palette :palette="documentStore.palette" :selected-color="documentStore.color" @select="documentStore.setColor"></Palette>
      </Panel>
      <Panel title="preview"  @collapse="$event => ui.collapsePanelPreview($event)" :collapsed="ui.panels.preview" :scrollable="false" v-if="documentStore.canvas">
        <Preview></Preview>
      </Panel>
    </aside>
    <div class="ANIMATION">
      <button
        class="button-show"
        :class="{ expanded: showingAnimation }"
        type="button"
        :aria-label="showingAnimation ? 'Hide animation panel' : 'Show animation panel'"
        @click="toggleShowAnimation">
        <Icon :i="showingAnimation ? 'arrow-down' : 'arrow-up'" />
      </button>
      <Animation v-if="showingAnimation" />
    </div>
  </div>
  <SymmetrySettings v-if="documentStore.symmetrySettings" />
  <LayerSettings v-if="documentStore.layers.settings" :layer="documentStore.layers.settings" />
  <DocumentCreate v-if="!documentStore.canvas" />
  <Splash v-if="ui.isShowingSplash" />
</template>

<script setup>
import { ref } from 'vue'
import { useDocumentStore } from '@/stores/PixelDocument'
import { useUIStore } from '@/stores/UI'
import { useKeyShortcuts } from '@/composables/useKeyShortcuts'
import { useWheel } from '@/composables/useWheel'
import { useTouch } from '@/composables/useTouch'
import SettingsButton from '@/components/SettingsButton.vue'
import Tool from '@/enums/Tool'
import ToolSettings from '@/components/ToolSettings.vue'
import Tools from '@/components/Tools.vue'
import Animation from '@/components/Animation.vue'
import Zoom from '@/components/Zoom.vue'
import Panel from '@/components/Panel.vue'
import Palette from '@/components/Palette.vue'
import Preview from '@/components/Preview.vue'
import Layers from '@/components/Layers.vue'
import Selection from '@/components/Selection.vue'
import Document from '@/components/Document.vue'
import DocumentCreate from '@/components/DocumentCreate.vue'
import LayerSettings from '@/components/LayerSettings.vue'
import SettingsBar from '@/components/SettingsBar.vue'
import Button from '@/components/Button.vue'
import Divider from '@/components/Divider.vue'
import Splash from '@/components/Splash.vue'
import Icon from '@/components/Icon.vue'
import SymmetrySettings from '../components/SymmetrySettings.vue'

const board = ref(null)
const showingAnimation = ref(false)

const MIN_TOUCHES = 2

const ui = useUIStore()
const documentStore = useDocumentStore()

function toggleShowAnimation() {
  showingAnimation.value = !showingAnimation.value
}

useWheel((e) => {
  console.log(e.deltaX, e.deltaY, e.deltaZ, e.deltaMode)
  if (e.deltaY < 0) {
    documentStore.zoom.increase()
  } else {
    documentStore.zoom.decrease()
  }
}, { target: board })

useTouch((e) => {
  if (e.touches < MIN_TOUCHES) {
    return
  }
  const [x, y] = e.movement
  const z = e.distance
  documentStore.moveAndZoom(x, y, z)
}, { target: board, passive: true })

// TODO: Esto no tiene sentido que esté aquí
useKeyShortcuts(new Map([
  [['1'], () => documentStore.setTool('pencil')],
  [['p'], () => documentStore.setTool('pencil')],
  [['2'], () => documentStore.setTool('eraser')],
  [['e'], () => documentStore.setTool('eraser')],
  [['3'], () => documentStore.setTool('fill')],
  [['f'], () => documentStore.setTool('fill')],
  [['4'], () => documentStore.setTool('shape')],
  [['r'], () => documentStore.setTool('shape')],
  [['5'], () => documentStore.setTool('transform')],
  [['h'], () => documentStore.setTool('transform')],
  [['6'], () => documentStore.setTool('select')],
  [['s'], () => documentStore.setTool('select')],
  [['7'], () => documentStore.toggleColorPicker()],
  [['c'], () => documentStore.toggleColorPicker()],
  [['z', 'ctrl'], () => documentStore.undo()],
  [['y', 'ctrl'], () => documentStore.redo()],
  [['arrowup'], () => documentStore.moveLayerUp()],
  [['arrowdown'], () => documentStore.moveLayerDown()],
  [['y'], () => documentStore.toggleSymmetry()],
  [[' '], () => documentStore.toggleAnimation()],
  [['0', 'ctrl'], () => documentStore.zoom.reset()],
  [['0'], () => documentStore.zoom.reset()],
  [['+'], () => documentStore.zoom.increase()],
  [['='], () => documentStore.zoom.increase()],
  [['z'], () => documentStore.zoom.increase()],
  [['-'], () => documentStore.zoom.decrease()],
  [['x'], () => documentStore.zoom.decrease()],
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
  grid-column: 1 / span 2;
  grid-row: 1 / span 3;
  display: grid;
  place-items: center;
  overflow: hidden;
  background-color: var(--colorLayer0);
  z-index: 1;
  cursor: url('@/assets/cursors/crosshair.svg') 12 12, auto;
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
  position: relative;
}

.button-show {
  position: absolute;
  top: 0;
  left: 50%;
  height: var(--spaceXL);
  padding: 0 var(--spaceL);
  background-color: var(--colorLayer1);
  box-shadow: calc(var(--spaceS) * -1) var(--spaceS) 0 var(--colorShadow);
  transform: translate(-50%, calc(var(--spaceXL) * -1));
}

.button-show.expanded {
  box-shadow: none;
  transform: translate(-50%, calc(var(--spaceM) * -1));
}
</style>
