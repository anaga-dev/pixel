<script setup>
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'
import { useKeyShortcuts } from '@/composables/useKeyShortcuts'
import { useWheel } from '@/composables/useWheel'
import { useBeforeUnload } from '@/composables/useBeforeUnload'
import { useTouch } from '@/composables/useTouch'
import Tool from '@/pixel/enums/Tool'
import { onKeyDown, onKeyUp } from '@vueuse/core'
import { storeToRefs } from 'pinia'

const documentStore = useDocumentStore()
const uiStore = useUIStore()

const route = useRoute()
const board = ref(null)
const showingAnimation = ref(false)

const MIN_TOUCHES = 2

const props = defineProps({
  offline: Boolean
})

const {
  showPanel,
  showSidePanel,
  ctrlDown,
  spaceDown,
  showPalette,
  showLayers,
  showOverlay,
  showColorPicker,
  showDocumentCreation,
  showExportMenu
} = storeToRefs(uiStore)

const {
  toggleSidePanel,
  togglePanel,
  togglePalette,
  toggleOverlay,
  toggleLayers,
  toggleColorPicker,
  toggleExportMenu
} = uiStore

onMounted(() => {
  const paramsId = route.params.id
  if (!paramsId) {
    showDocumentCreation.value = true
  }
  documentStore.setBoard(board)
})
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
    if (e.type === 'touchend' || e.type === 'touchcancel') {
      documentStore.stopMoving()
    }
    if (e.touches < MIN_TOUCHES) {
      documentStore.stopMoving()
      return
    }
    if (e.type === 'touchstart') {
      documentStore.startMoving()
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
    [['b'], () => documentStore.setTool('pencil')],
    [['2'], () => documentStore.setTool('eraser')],
    [['e'], () => documentStore.setTool('eraser')],
    [['3'], () => documentStore.setTool('fill')],
    [['g'], () => documentStore.setTool('fill')],
    [['4'], () => documentStore.setTool('shape')],
    [['s'], () => documentStore.setTool('shape')],
    [['5'], () => documentStore.setTool('transform')],
    [['v'], () => documentStore.setTool('transform')],
    [['6'], () => documentStore.setTool('select')],
    [['m'], () => documentStore.setTool('select')],
    [['7'], () => documentStore.toggleColorPicker()],
    [['c'], () => documentStore.toggleColorPicker()],
    [['q'], () => documentStore.flipHorizontally()],
    [['w'], () => documentStore.flipVertically()],
    [['z', 'ctrl'], () => documentStore.undo()],
    [['y', 'ctrl'], () => documentStore.redo()],
    [['arrowup'], () => documentStore.moveLayerUp()],
    [['arrowdown'], () => documentStore.moveLayerDown()],
    [['arrowleft'], () => documentStore.goToPreviousFrame()],
    [['arrowright'], () => documentStore.goToNextFrame()],
    [['y'], () => documentStore.toggleSymmetry()],
    [['p'], () => documentStore.toggleAnimation()],
    [['0', 'ctrl'], () => documentStore.zoom.reset()],
    [['0'], () => documentStore.zoom.reset()],
    [['+'], () => documentStore.zoom.increase()],
    [['='], () => documentStore.zoom.increase()],
    [['z'], () => documentStore.zoom.increase()],
    [['-'], () => documentStore.zoom.decrease()],
    [['x'], () => documentStore.zoom.decrease()]
  ])
)

onKeyDown('Control', () => (ctrlDown.value = true))
onKeyUp('Control', () => (ctrlDown.value = false))

function loadPalette() {
  documentStore.loadPalette()
  uiStore.showOverlay = null
}

function savePalette() {
  documentStore.savePaletteAs()
  uiStore.showOverlay = null
}

function clearPalette() {
  documentStore.clearPalette()
  uiStore.showOverlay = null
}

const icon = computed(() => {
  return showSidePanel.value ? 'collapse-side-panel' : 'expand-side-panel'
})

const sidePanelMessage = computed(() => {
  return showSidePanel.value
    ? 'studio.tooltips.collapse-side-panel'
    : 'studio.tooltips.expand-side-panel'
})
</script>

<template>
  <div class="CONTAINER">
    <div class="SETTINGS">
      <Settings />
    </div>
    <div class="TOOLS">
      <Tools />
    </div>
    <main class="BOARD" ref="board" :class="{ dragging: spaceDown }">
      <Document v-if="documentStore.canvas" />
      <Selection
        v-if="
          documentStore.canvas &&
          (documentStore.selection.visible ||
            documentStore.tool === Tool.SELECT)
        "
      />
      <PixelGrid v-if="documentStore.zoom.current >= 8" />
      <BoundingBox
        v-if="
          documentStore.canvas &&
          documentStore.tool === Tool.TRANSFORM &&
          documentStore.transform.getLayerBoundaries() !== null
        "
      />
    </main>
    <!--     <div class="ANIMATION">
      <button
        class="button-show"
        :class="{ expanded: showingAnimation }"
        type="button"
        :aria-label="
          showingAnimation ? 'Hide animation panel' : 'Show animation panel'
        "
        @click="toggleShowAnimation"
      >
        <Icon :i="showingAnimation ? 'arrow-down' : 'arrow-up'" />
      </button>
      <Animation v-if="showingAnimation" />
    </div> -->
    <Transition name="slide">
      <section v-if="showSidePanel" class="PANELS">
        <Panel
          scrollable
          :title="$t('palette')"
          :expanded="showPalette"
          @toggle="togglePalette"
        >
          <template #actions>
            <Tooltip
              :message="$t('studio.tooltips.more-options')"
              position="bottom left"
            >
              <Button
                :label="$t('studio.more-options')"
                variant="ghost"
                @click="toggleOverlay('palette-options')"
              >
                <Icon i="more" />
              </Button>
            </Tooltip>
          </template>
          <Palette />
        </Panel>
        <Dropdown
          v-if="showOverlay === 'palette-options'"
          class="palette-menu"
          @close="toggleOverlay('palette-options')"
        >
          <Button @click="loadPalette">{{ $t('studio.load-palette') }}</Button>
          <Button @click="savePalette">{{ $t('studio.save-palette') }}</Button>
          <Button @click="clearPalette">{{
            $t('studio.clear-palette')
          }}</Button>
        </Dropdown>
        <Divider />
        <Panel
          scrollable
          :title="$t('studio.layers')"
          :expanded="showLayers"
          @toggle="toggleLayers"
        >
          <template #actions>
            <Tooltip
              :message="$t('studio.tooltips.new-layer')"
              position="bottom left"
            >
              <Button
                :label="$t('studio.add-layer')"
                variant="ghost"
                @click="documentStore.addLayer"
              >
                <Icon i="add-item" />
              </Button>
            </Tooltip>
          </template>
          <Layers />
        </Panel>
      </section>
    </Transition>
    <aside class="SIDEBAR-DESKTOP">
      <div class="group">
        <Button
          :label="$t('settings')"
          variant="ghost"
          @click.stop="uiStore.toggleOverlay('settings-menu')"
        >
          <Icon i="menu" />
        </Button>
        <Divider />
        <Tooltip :message="$t(sidePanelMessage)" position="left bottom">
          <Button variant="ghost" @click="toggleSidePanel">
            <Icon :i="icon" />
          </Button>
        </Tooltip>
        <Tooltip
          v-if="offline"
          :message="$t('studio.tooltips.offline')"
          position="left bottom"
          class="badge-offline"
        >
          :message="$t('studio.tooltips.offline')" position="left bottom" >
          <Icon class="badge-offline" i="offline" />
        </Tooltip>
      </div>
      <div class="group">
        <Tooltip
          :message="$t('studio.tooltips.symmetry')"
          position="left bottom"
        >
          <Button
            :label="$t('studio.symmetry-aid')"
            variant="ghost"
            :active="documentStore.symmetry.axis !== null"
            @click="toggleOverlay('symmetry-settings')"
          >
            <Icon
              i="symmetry-vertical"
              v-if="documentStore.symmetry.axis === 'vertical'"
            />
            <Icon
              i="symmetry-two-axis"
              v-else-if="documentStore.symmetry.axis === 'both'"
            />
            <Icon i="symmetry-horizontal" v-else />
          </Button>
        </Tooltip>
        <Divider />
        <Tooltip :message="$t('studio.tooltips.zoom')" position="left bottom">
          <Zoom class="zoom-button" />
        </Tooltip>
        <Divider class="zoom-divider" />
        <ToolButton
          tooltipText="studio.tooltips.undo"
          tooltipPosition="right"
          label="studio.undo"
          icon="undo"
          variant="icon"
          :disabled="!documentStore.history.canUndo"
          @click="documentStore.undo()"
        />
        <ToolButton
          tooltipText="studio.tooltips.redo"
          tooltipPosition="right"
          label="studio.redo"
          icon="redo"
          variant="icon"
          :disabled="!documentStore.history.canRedo"
          @click="documentStore.redo()"
        />
      </div>
    </aside>
    <aside class="SIDEBAR-MOBILE">
      <div class="group">
        <Button
          :label="$t('settings')"
          variant="ghost"
          @click.stop="uiStore.toggleOverlay('settings-menu')"
        >
          <Icon i="menu" />
        </Button>
      </div>
      <div class="group">
        <Tooltip
          v-if="offline"
          :message="$t('studio.tooltips.offline')"
          position="bottom"
          class="badge-offline"
        >
          :message="$t('studio.tooltips.offline')" position="left bottom" >
          <Icon class="badge-offline" i="offline" />
        </Tooltip>
        <Tooltip
          :message="$t('studio.tooltips.symmetry')"
          position="bottom"
        >
          <Button
            :label="$t('studio.symmetry-aid')"
            variant="ghost"
            :active="documentStore.symmetry.axis !== null"
            @click="toggleOverlay('symmetry-settings')"
          >
            <Icon
              i="symmetry-vertical"
              v-if="documentStore.symmetry.axis === 'vertical'"
            />
            <Icon
              i="symmetry-two-axis"
              v-else-if="documentStore.symmetry.axis === 'both'"
            />
            <Icon i="symmetry-horizontal" v-else />
          </Button>
        </Tooltip>
        <Divider vertical />
        <ToolButton
          tooltipText="studio.tooltips.undo"
          tooltipPosition="bottom"
          label="studio.undo"
          icon="undo"
          variant="icon"
          :disabled="!documentStore.history.canUndo"
          @click="documentStore.undo()"
        />
        <ToolButton
          tooltipText="studio.tooltips.redo"
          tooltipPosition="bottom"
          label="studio.redo"
          icon="redo"
          variant="icon"
          :disabled="!documentStore.history.canRedo"
          @click="documentStore.redo()"
        />
        <Divider vertical />
        <Tooltip :message="$t('studio.tooltips.toggle-palette')" position="left bottom">
          <Button
            :label="$t('studio.show-palette')"
            variant="ghost"
            :active="showPanel === 'palette'"
            @click="togglePanel('palette')"
          >
            <Icon i="palette" />
          </Button>
        </Tooltip>
        <Tooltip :message="$t('studio.tooltips.toggle-layers')" position="left bottom">
          <Button
            :label="$t('studio.show-layers')"
            variant="ghost"
            :active="showPanel === 'layers'"
            @click="togglePanel('layers')"
          >
            <Icon i="layers" />
          </Button>
        </Tooltip>
      </div>
    </aside>
  </div>
  <SettingsMenu class="settings-menu" v-if="showOverlay === 'settings-menu'" />
  <LayerSettings
    v-if="documentStore.layers.settings"
    class="layer-settings"
    :layer="documentStore.layers.settings"
  />
  <SymmetrySettings v-if="showOverlay === 'symmetry-settings'" class="symmetry-settings" />
  <DocumentCreate
    v-if="showDocumentCreation"
    @created="showDocumentCreation = false"
  />
  <ColorPicker v-if="showColorPicker" @close="toggleColorPicker()" />
  <FloatingPanel
    v-if="showPanel === 'palette'"
    :title="$t('palette')"
    class="single-panel-palette"
    @close="showPanel = null"
  >
    <template #actions>
      <Tooltip
        :message="$t('studio.tooltips.more-options')"
        position="bottom left"
      >
        <Button
          :label="$t('studio.more-options')"
          variant="ghost"
          @click="toggleOverlay('palette-options')"
        >
          <Icon i="more" />
        </Button>
      </Tooltip>
    </template>
    <Palette />
  </FloatingPanel>
  <FloatingPanel
    v-if="showPanel === 'layers'"
    :title="$t('studio.layers')"
    class="single-panel-layers"
    @close="showPanel = null"
  >
    <template #actions>
      <Tooltip
        :message="$t('studio.tooltips.new-layer')"
        position="bottom left"
      >
        <Button
          :label="$t('studio.add-layer')"
          variant="ghost"
          @click="documentStore.addLayer"
        >
          <Icon i="add-item" />
        </Button>
      </Tooltip>
    </template>
    <Layers />
  </FloatingPanel>
  <ExportMenu v-if="showExportMenu" @close="toggleExportMenu()" />
</template>

<style scoped>
.CONTAINER {
  width: 100svw;
  height: 100svh;
  overflow: hidden;
  display: grid;
  user-select: none;
  grid-template-columns: auto 1fr var(--widthSidebar) auto;
  grid-template-rows: auto 1fr auto;
}

.TOOLS,
.ANIMATION,
aside {
  background-color: var(--colorLayer1);
}

.SETTINGS {
  grid-column: 1 / span 3;
  grid-row: 1;
  z-index: 3;
  display: grid;
  justify-self: start;
}
.TOOLS {
  display: grid;
  align-self: center;
  grid-column: 1;
  grid-row: 1 / span 2;
  z-index: 2;
}

.BOARD {
  grid-column: 1 / span 4;
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
  grid-row: 1 / span 2;
  z-index: 4;
  position: relative;
  overflow: hidden;
  padding: var(--spaceM);
  background-color: var(--colorLayer1);
  box-shadow: calc(var(--spaceXS) * -1) 0 0 var(--colorShadow);
  display: grid;
  gap: var(--spaceM);
  align-content: start;
}

aside {
  z-index: 5;
  display: grid;
  padding: var(--spaceS);
  box-shadow: calc(var(--spaceXS) * -1) 0 0 var(--colorShadow);
  gap: var(--spaceS);
  align-content: space-between;
}
.SIDEBAR-DESKTOP {
  grid-column: 4;
  grid-row: 1 / span 2;
}

.layer-settings {
  top: calc(var(--widthToolbar) + var(--spaceS));
  right: calc(var(--widthSidebar) + var(--widthToolbar) + var(--spaceS));
}

.group {
  display: grid;
  gap: var(--spaceS);
  justify-content: center;
}

.badge-offline {
  color: var(--colorCritical);
  margin: var(--spaceS) auto 0;
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

.palette-menu {
  position: absolute;
  top: 4.5rem;
  right: 1rem;
  z-index: 1000;
}

.SIDEBAR-MOBILE {
  display: none;
  grid-auto-flow: column;
  grid-column: 1 / span 3;
  grid-row: 1;
  justify-content: space-between;
  align-items: center;
}

.SIDEBAR-MOBILE .group {
  grid-auto-flow: column;
}

.settings-menu {
  top: var(--spaceS);
  right: calc(var(--spaceXL) + var(--spaceM));
}

.single-panel-layers,
.single-panel-palette {
  top: 4.5rem;
  right: var(--spaceS);
  display: none;
}

@media (orientation: portrait) {
  .CONTAINER {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto 1fr;
  }
  .SETTINGS {
    grid-column: 1 / span 2;
    grid-row: 2;
  }
  .TOOLS {
    grid-column: 1;
    grid-row: 3;
  }
  .SIDEBAR-DESKTOP {
    display: none;
  }
  .SIDEBAR-MOBILE {
    display: grid;
  }
  .PANELS {
    display: none;
  }
  .settings-menu {
    top: 4.5rem;
    right: auto;
    left: var(--spaceS);
  }
  .single-panel-palette,
  .single-panel-layers {
    display: flex;
  }

  .layer-settings {
    right: calc(var(--widthSidebar) + var(--spaceS) * 2);
  }
  .symmetry-settings {
    top: 4.5rem;
    bottom: auto;
    right: var(--spaceXXL);
  }
}

@media (max-width: 1023px) {
  .zoom-button,
  .zoom-divider {
    display: none;
  }
}

/* @media (orientation: portrait) {
  .PANELS {
    grid-row: 2;
  }
} */
</style>
