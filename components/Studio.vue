<script setup>
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'
import { useKeyShortcuts } from '@/composables/useKeyShortcuts'
import { useWheel } from '@/composables/useWheel'
import { useBeforeUnload } from '@/composables/useBeforeUnload'
import { useTouch } from '@/composables/useTouch'
import { onKeyDown, onKeyUp, set } from '@vueuse/core'
import Tool from '@/pixel/enums/Tool'
import { onMounted } from 'vue'

const documentStore = useDocumentStore()
const uiStore = useUIStore()

const board = ref(null)

const MIN_TOUCHES = 2

const props = defineProps({
  offline: {
    type: Boolean,
    default: false
  },
  preventCreation: {
    type: Boolean,
    default: false
  }
})

onMounted(() => documentStore.setBoard(board.value))
onUnmounted(() => documentStore.unsetBoard())

useBeforeUnload(
  () => true,
  () => 'Are you sure you want to leave? Your changes will be lost.'
)

useResizeObserver(board, () => documentStore.updateCanvasRect())

useWheel((e) => documentStore.zoom.fromEvent(e), {
  domTarget: board,
  passive: true
})

useTouch(
  (e) => {
    if (e.type === 'touchend' || e.type === 'touchcancel') {
      documentStore.stopMoving()
    }
    setTimeout(() => {
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
    }, 150)
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

onKeyDown(' ', () => documentStore.startMoving())
onKeyUp(' ', () => documentStore.stopMoving())

function loadPalette() {
  documentStore.loadPalette()
  uiStore.closeOverlay()
}

function savePalette() {
  documentStore.savePaletteAs()
  uiStore.closeOverlay()
}

function clearPalette() {
  documentStore.clearPalette()
  uiStore.closeOverlay()
}

const expandSidePanelIcon = computed(() => {
  return uiStore.isSidebarExpanded ? 'collapse-side-panel' : 'expand-side-panel'
})

const sidePanelMessage = computed(() => {
  return uiStore.isSidebarExpanded.value
    ? 'studio.tooltips.collapse-side-panel'
    : 'studio.tooltips.expand-side-panel'
})

onMounted(() => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera
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
    <!-- UI Canvas -->
    <canvas ref="board" class="BOARD"></canvas>
    <!-- / UI Canvas -->
    <div class="ANIMATION">
      <button
        class="button-show"
        type="button"
        :class="{ expanded: uiStore.isAnimationVisible }"
        :aria-label="
          uiStore.isAnimationVisible
            ? $t('studio.anim')
            : 'Show animation panel'
        "
        @click="uiStore.toggleAnimation"
      >
        <Icon :i="uiStore.isAnimationVisible ? 'arrow-down' : 'arrow-up'" />
      </button>
      <Animation v-if="uiStore.isAnimationVisible" />
    </div>
    <Transition name="slide">
      <section v-if="uiStore.isSidebarExpanded" class="PANELS">
        <Panel
          :title="$t('palette')"
          :expanded="uiStore.isPaletteVisible"
          scrollable
          @toggle="uiStore.togglePalette"
        >
          <template #actions>
            <Tooltip
              message="studio.tooltips.more-options"
              position="bottom left"
            >
              <Button
                :label="$t('studio.more-options')"
                variant="ghost"
                @click="uiStore.toggleOverlay('palette-options')"
              >
                <Icon i="more" />
              </Button>
            </Tooltip>
          </template>
          <Palette />
        </Panel>
        <Dropdown
          v-if="uiStore.visibleOverlay === 'palette-options'"
          class="palette-menu"
          @close="uiStore.toggleOverlay('palette-options')"
        >
          <Button @click="loadPalette">
            {{ $t('studio.load-palette') }}
          </Button>
          <Button @click="savePalette">
            {{ $t('studio.save-palette') }}
          </Button>
          <Button @click="clearPalette">
            {{ $t('studio.clear-palette') }}
          </Button>
        </Dropdown>
        <Divider />
        <Panel
          :title="$t('studio.layers')"
          :expanded="uiStore.isLayersOverlayVisible"
          scrollable
          @toggle="uiStore.toggleLayers"
        >
          <template #actions>
            <Tooltip message="studio.tooltips.new-layer" position="bottom left">
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
        <Tooltip :message="sidePanelMessage" position="left bottom">
          <Button variant="ghost" @click="uiStore.toggleSidebar()">
            <Icon :i="expandSidePanelIcon" />
          </Button>
        </Tooltip>
        <Tooltip
          v-if="props.offline"
          position="left bottom"
          class="badge-offline"
          message="studio.tooltips.offline"
        >
          <Icon class="badge-offline" i="offline" />
        </Tooltip>
      </div>
      <div class="group">
        <Tooltip message="studio.tooltips.symmetry" position="left bottom">
          <Button
            variant="ghost"
            :label="$t('studio.symmetry-aid')"
            :active="documentStore.symmetry.axis !== null"
            @click="uiStore.toggleOverlay('symmetry-settings')"
          >
            <Icon
              v-if="documentStore.symmetry.axis === 'vertical'"
              i="symmetry-vertical"
            />
            <Icon
              v-else-if="documentStore.symmetry.axis === 'both'"
              i="symmetry-two-axis"
            />
            <Icon v-else i="symmetry-horizontal" />
          </Button>
        </Tooltip>
        <Divider />
        <Tooltip message="studio.tooltips.zoom" position="left bottom">
          <Zoom />
        </Tooltip>
        <Divider class="zoom-divider" />
        <ToolButton
          tooltip-text="studio.tooltips.undo"
          tooltip-position="right"
          label="studio.undo"
          icon="undo"
          variant="icon"
          :disabled="!documentStore.history.canUndo"
          @click="documentStore.undo()"
        />
        <ToolButton
          tooltip-text="studio.tooltips.redo"
          tooltip-position="right"
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
          message="studio.tooltips.offline"
          position="bottom"
          class="badge-offline"
        >
          <Icon class="badge-offline" i="offline" />
        </Tooltip>
        <Tooltip message="studio.tooltips.symmetry" position="bottom">
          <Button
            variant="ghost"
            :label="$t('studio.symmetry-aid')"
            :active="documentStore.symmetry.axis !== null"
            @click="uiStore.toggleOverlay('symmetry-settings')"
          >
            <Icon
              v-if="documentStore.symmetry.axis === 'vertical'"
              i="symmetry-vertical"
            />
            <Icon
              v-else-if="documentStore.symmetry.axis === 'both'"
              i="symmetry-two-axis"
            />
            <Icon v-else i="symmetry-horizontal" />
          </Button>
        </Tooltip>
        <Divider vertical />
        <ToolButton
          tooltip-text="studio.tooltips.undo"
          tooltip-position="bottom"
          label="studio.undo"
          icon="undo"
          variant="icon"
          :disabled="!documentStore.history.canUndo"
          @click="documentStore.undo()"
        />
        <ToolButton
          tooltip-text="studio.tooltips.redo"
          tooltip-position="bottom"
          label="studio.redo"
          icon="redo"
          variant="icon"
          :disabled="!documentStore.history.canRedo"
          @click="documentStore.redo()"
        />
        <Divider vertical />
        <Tooltip
          message="studio.tooltips.toggle-palette"
          position="left bottom"
        >
          <Button
            variant="ghost"
            :label="$t('studio.show-palette')"
            :active="uiStore.visiblePanel === 'palette'"
            @click="uiStore.togglePanel('palette')"
          >
            <Icon i="palette" />
          </Button>
        </Tooltip>
        <Tooltip message="studio.tooltips.toggle-layers" position="left bottom">
          <Button
            :label="$t('studio.show-layers')"
            variant="ghost"
            :active="uiStore.visiblePanel === 'layers'"
            @click="uiStore.togglePanel('layers')"
          >
            <Icon i="layers" />
          </Button>
        </Tooltip>
      </div>
    </aside>
  </div>
  <SettingsMenu
    v-if="uiStore.visibleOverlay === 'settings-menu'"
    class="settings-menu"
  />
  <LayerSettings
    v-if="documentStore.layers.settings"
    :layer="documentStore.layers.settings"
    class="layer-settings"
  />
  <SymmetrySettings
    v-if="uiStore.visibleOverlay === 'symmetry-settings'"
    class="symmetry-settings"
  />
  <DocumentCreate
    v-if="!props.preventCreation && uiStore.isDocumentCreationVisible"
    @created="uiStore.hideDocumentCreation()"
  />
  <ColorPicker
    v-if="uiStore.isColorPickerVisible"
    @close="uiStore.toggleColorPicker()"
  />
  <FloatingPanel
    v-if="uiStore.visiblePanel === 'palette'"
    :title="$t('palette')"
    class="single-panel-palette"
    @close="uiStore.closePanel()"
  >
    <template #actions>
      <Tooltip message="studio.tooltips.more-options" position="bottom left">
        <Button
          :label="$t('studio.more-options')"
          variant="ghost"
          @click="uiStore.toggleOverlay('palette-options')"
        >
          <Icon i="more" />
        </Button>
      </Tooltip>
    </template>
    <Palette />
  </FloatingPanel>
  <FloatingPanel
    v-if="uiStore.visiblePanel === 'layers'"
    :title="$t('studio.layers')"
    class="single-panel-layers"
    @close="uiStore.closePanel()"
  >
    <template #actions>
      <Tooltip message="studio.tooltips.new-layer" position="bottom left">
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
  <ExportMenu
    v-if="uiStore.isExportMenuVisible"
    @close="uiStore.toggleExportMenu()"
  />
  <!-- Overlay for debugging -->
<!--   <div style="position: fixed; left: 2rem; bottom: 2rem">
    <p>Is iOS: {{ $device.isIos }}</p>
    <p>Is Apple: {{ $device.isApple }}</p>
    <p>Is Tablet: {{ $device.isTablet }}</p>
    <p>Is Mobile: {{ $device.isMobile }}</p>
    <p>Is Desktop: {{ $device.isDesktop }}</p>
    <p>Is iPad: {{ $device.isIpadOs }}</p>
    <p>Is MacOS: {{ $device.isMacOS }}</p>
    <p>Is iPadOS: {{ $device.isiPadOS }}</p>
  </div> -->
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  touch-action: none;
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
    grid-template-rows: auto auto 1fr auto;
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
  .ANIMATION {
    grid-column: 1 / span 2;
    grid-row: 4;
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
