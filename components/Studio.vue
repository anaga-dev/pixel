<template>
  <div class="CONTAINER" :class="{ expanded: uiStore.expandedSidebar }">
    <div class="SETTINGS">
      <Settings />
    </div>
    <div class="TOOLS">
      <Tools />
    </div>
    <main class="BOARD" ref="board" :class="{ dragging: draggingCanvas }" @keydown.ctrl="draggingCanvas = true">
      <Document v-if="documentStore.canvas" />
      <Selection
        v-if="
          documentStore.canvas &&
          (documentStore.selection.visible ||
            documentStore.tool === Tool.SELECT)
        "
      />
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
    <Transition name="slide">
      <aside v-if="uiStore.showPanel" class="PANELS">
        <Panel
          :title="$t('palette')"
          :expanded="uiStore.showPalette"
          @toggle="uiStore.togglePalette"
        >
          <Palette />
        </Panel>
        <Divider />
        <Panel
          scrollable
          :title="$t('studio.layers')"
          :expanded="uiStore.showLayers"
          @toggle="uiStore.toggleLayers"
        >
          <template #actions>
            <Button
              :label="$t('studio.add-layer')"
              variant="ghost"
              @click="documentStore.addLayer"
            >
              <Icon i="add-item" />
            </Button>
          </template>
          <Layers :layers="documentStore.layers"></Layers>
        </Panel>
      </aside>
    </Transition>
  </div>
  <LayerSettings
    v-if="documentStore.layers.settings"
    :layer="documentStore.layers.settings"
  />
  <SymmetrySettings v-if="uiStore.showOverlay === 'symmetry-settings'" />
  <DocumentCreate v-if="!documentStore.canvas" />
  <ColorPicker
    v-if="uiStore.showColorPicker"
    @close="uiStore.toggleColorPicker()"
  />
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'
import { useKeyShortcuts } from '@/composables/useKeyShortcuts'
import { useWheel } from '@/composables/useWheel'
import { useBeforeUnload } from '@/composables/useBeforeUnload'
import { useTouch } from '@/composables/useTouch'
import Tool from '@/pixel/enums/Tool'
import { onKeyDown, onKeyUp } from '@vueuse/core'

const board = ref(null)
const showingAnimation = ref(false)

const MIN_TOUCHES = 2

const uiStore = useUIStore()
const documentStore = useDocumentStore()
const draggingCanvas = ref(false)

onMounted(() => documentStore.setBoard(board))
onUnmounted(() => documentStore.unsetBoard())

useBeforeUnload(
  () => true,
  () => 'Are you sure you want to leave? Your changes will be lost.'
)

// TODO: this will show/hide the animation panel
function toggleShowAnimation() {
  showingAnimation.value = !showingAnimation.value
}

useResizeObserver(board, () => documentStore.updateCanvasRect())

useWheel(
  (e) => {
    documentStore.zoom.fromEvent(e)
  },
  { domTarget: board, passive: true }
)

useTouch(
  (e) => {
    if (e.touches < MIN_TOUCHES) {
      return
    }
    const { x: currentX, y: currentY } = e.currentCenter
    const { x: previousX, y: previousY } = e.previousCenter
    const deltaX = currentX.value - previousX.value
    const deltaY = currentY.value - previousY.value
    const z = e.distance

    documentStore.moveAndZoom(deltaX, deltaY, z)
  },
  { domTarget: board }
)

// TODO: This shouldn't be here
useKeyShortcuts(
  new Map([
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
    [['x'], () => documentStore.zoom.decrease()]
  ])
)

/* onKeyDown(' ', () => {
  draggingCanvas.value = true
})

onKeyUp(' ', () => {
  draggingCanvas.value = false
}) */
</script>

<style scoped>
.CONTAINER {
  width: 100svw;
  height: 100svh;
  overflow: hidden;
  display: grid;
  user-select: none;
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
  align-self: center;
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
}

.BOARD:not(.dragging) {
  cursor: url('@/assets/cursors/crosshair.svg') 12 12, auto;
}
.BOARD.dragging {
  background-color: red;
  cursor: url('@/assets/cursors/dragging.svg') 12 12, auto;
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
  overflow: hidden;
  padding: var(--spaceM);
  background-color: var(--colorLayer1);
  box-shadow: calc(var(--spaceXS) * -1) 0 0 var(--colorShadow);
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: var(--spaceL);
  align-content: start;
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
