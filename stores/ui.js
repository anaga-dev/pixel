import { useDocumentStore } from "./document.js"

export const useUIStore = defineStore('ui', () => {
  const documentStore = useDocumentStore()
  const emitterBox = ref({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })

  const isAnimationVisible = ref(false)
  const isOverlayVisible = ref(null)
  const isDocumentCreationVisible = ref(false)
  const isSidebarExpanded = ref(true)
  const isPanelVisible = ref(null)
  const isColorPickerVisible = ref(false)
  const isPaletteVisible = ref(true)
  const isLayersOverlayVisible = ref(true)
  const isExportMenuVisible = ref(false)
  const tooltip = ref(null)
  const isLayerSettingsVisible = ref(false)

  const ctrlDown = ref(false)
  const spaceDown = ref(false)

  function toggleOverlay(el) {
    if (isOverlayVisible.value !== el) {
      isOverlayVisible.value = el
    } else if (isOverlayVisible.value === el) {
      isOverlayVisible.value = null
    }
  }

  function toggleSidePanel() {
    isSidebarExpanded.value = !isSidebarExpanded.value
  }

  function togglePanel(panel) {
    if (isPanelVisible.value !== null) {
      isPanelVisible.value = null
    } else {
      isPanelVisible.value = panel
    }
  }

  function toggleLayers() {
    isLayersOverlayVisible.value = !isLayersOverlayVisible.value
  }
  function togglePalette() {
    isPaletteVisible.value = !isPaletteVisible.value
  }

  function toggleColorPicker() {
    isColorPickerVisible.value = !isColorPickerVisible.value
  }

  function toggleExportMenu() {
    isExportMenuVisible.value = !isExportMenuVisible.value
  }

  function showTooltip(rect, message) {
    tooltip.value.rect = rect
    tooltip.value.message = message
  }

  function toggleAnimation() {
    isAnimationVisible.value = !isAnimationVisible.value
  }

  function isDocumentCreationVisibleModal() {
    isDocumentCreationVisible.value = true
  }

  function closeOverlay() {
    isOverlayVisible.value = null
  }

  return {
    isDocumentCreationVisible,
    emitterBox,
    isAnimationVisible,
    isOverlayVisible,
    isPanelVisible,
    isSidebarExpanded,
    isColorPickerVisible,
    isPaletteVisible,
    isLayersOverlayVisible,
    isExportMenuVisible,
    tooltip,
    isLayerSettingsVisible,
    expandedSidebar,
    ctrlDown,
    spaceDown,
    toggleAnimation,
    toggleOverlay,
    toggleLayers,
    togglePalette,
    toggleSidePanel,
    togglePanel,
    toggleColorPicker,
    toggleExportMenu,
    showTooltip,
    isDocumentCreationVisibleModal,
    closeOverlay
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUIStore, import.meta.hot))
}
