<template>
  <div class="CONTAINER" :class="{ expanded: uiStore.expandedSidebar }">
    <div class="SETTINGS">
      <Settings />
    </div>
    <div class="TOOLS">
      <Tools />
    </div>
    <main class="BOARD" ref="board">
      <Document v-if="documentStore.canvas" :board="board" />
      <Selection v-if="documentStore.canvas && documentStore.tool === Tool.SELECT" />
    </main>
    <!--
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
    -->
    <aside class="PANELS">
      <Panel v-if="uiStore.showPanel === 'color-picker'" @close="uiStore.toggleColorPicker">
        <ColorPicker />
      </Panel>
      <Panel scrollable v-if="uiStore.showPanel === 'layers'" title="Layers">
        <template #actions>
          <Button label="Add layer" variant="ghost" @click="documentStore.addLayer">
            <Icon i="add-item" />
          </Button>
        </template>
        <Layers :layers="documentStore.layers"></Layers>
      </Panel>
      <!--
      <Panel v-if="uiStore.isShowingPalettePanel" title="Palette">
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
      <Panel v-if="uiStore.isShowingPreviewPanel" title="preview" :scrollable="false">
        <Preview></Preview>
      </Panel>
      -->
    </aside>
  </div>
  <LayerSettings v-if="documentStore.layers.settings" :layer="documentStore.layers.settings" />
  <SymmetrySettings v-if="uiStore.showOverlay === 'symmetry-settings'" />
  <DocumentCreate v-if="!documentStore.canvas" />
  <Splash v-if="uiStore.isShowingSplash" />
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'
import { useKeyShortcuts } from '@/composables/useKeyShortcuts'
import { useWheel } from '@/composables/useWheel'
import { useTouch } from '@/composables/useTouch'
import Tool from '@/pixel/enums/Tool'

const board = ref(null)
const showingAnimation = ref(false)

const MIN_TOUCHES = 2

const uiStore = useUIStore()
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
  [['q'], () => documentStore.flipHorizontally()],
  [['w'], () => documentStore.flipVertically()],
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
  width: 100svw;
  height: 100svh;
  overflow: hidden;
  display: grid;
  grid-template-columns: var(--widthToolbar) 1fr var(--widthSidebar);
  grid-template-rows: var(--widthToolbar) 1fr auto;
}

.SETTINGS,
.TOOLS,
.ANIMATION {
  background-color: var(--colorLayer1);
}

.SETTINGS {
  grid-column: 1 / span 3;
  grid-row: 1;
  z-index: 3;
  box-shadow: calc(var(--spaceXS) * -1) var(--spaceXS) 0 var(--colorShadow);
}

.TOOLS {
  display: grid;
  align-items: stretch;
  grid-column: 1;
  grid-row: 2;
  z-index: 2;
}

.BOARD {
  grid-column: 1 / span 3;
  grid-row: 1 / span 3;
  display: grid;
  place-items: center;
  overflow: hidden;
  background-color: var(--colorLayer0);
  z-index: 0;
  cursor: url('@/assets/cursors/crosshair.svg') 12 12, auto;
}

.ANIMATION {
  grid-column: 1 / span 3;
  grid-row: 3;
  z-index: 2;
  position: relative;
}

.PANELS {
  grid-column: 3;
  grid-row: 2;
  z-index: 1;
  position: relative;
  pointer-events: none;
  overflow: hidden;
  padding: var(--spaceS);
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
