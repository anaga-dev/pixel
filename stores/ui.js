import { useDocumentStore } from './document.js'

export const useUIStore = defineStore('ui', () => {
  const documentStore = useDocumentStore()
  const emitterBox = ref({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })

  const isAnimationVisible = ref(false)
  const visibleOverlay = ref(null)
  const isDocumentCreationVisible = ref(true)
  const isSidebarExpanded = ref(true)
  const visiblePanel = ref(null)
  const isColorPickerVisible = ref(false)
  const isPaletteVisible = ref(true)
  const isLayersOverlayVisible = ref(true)
  const isExportMenuVisible = ref(false)
  const tooltip = ref(null)
  const isLayerSettingsVisible = ref(false)

  const ctrlDown = ref(false)
  const spaceDown = ref(false)

  function toggleOverlay(newValue) {
    if (visibleOverlay.value !== newValue) {
      visibleOverlay.value = newValue
    } else if (visibleOverlay.value === newValue) {
      visibleOverlay.value = null
    }
  }

  function togglePanel(panel) {
    if (visiblePanel.value !== null) {
      visiblePanel.value = null
    } else {
      visiblePanel.value = panel
    }
  }

  function toggleSidebar(newValue = !isSidebarExpanded.value) {
    isSidebarExpanded.value = newValue
  }

  function toggleLayers(newValue = !isLayersOverlayVisible.value) {
    isLayersOverlayVisible.value = newValue
  }
  function togglePalette(newValue = !isPaletteVisible.value) {
    isPaletteVisible.value = newValue
  }

  function toggleColorPicker(newValue = !isColorPickerVisible.value) {
    isColorPickerVisible.value = newValue
  }

  function toggleExportMenu(newValue = !isExportMenuVisible.value) {
    isExportMenuVisible.value = newValue
  }

  function showTooltip(rect, message) {
    tooltip.value.rect = rect
    tooltip.value.message = message
  }

  function toggleAnimation() {
    isAnimationVisible.value = !isAnimationVisible.value
  }

  function showDocumentCreation() {
    isDocumentCreationVisible.value = true
  }

  function hideDocumentCreation() {
    isDocumentCreationVisible.value = false
  }

  function closeOverlay() {
    visibleOverlay.value = null
  }

  function closePanel() {
    visiblePanel.value = null
  }

  return {
    isDocumentCreationVisible,
    emitterBox,
    isAnimationVisible,
    visibleOverlay,
    visiblePanel,
    isSidebarExpanded,
    isColorPickerVisible,
    isPaletteVisible,
    isLayersOverlayVisible,
    isExportMenuVisible,
    tooltip,
    isLayerSettingsVisible,
    ctrlDown,
    spaceDown,
    toggleAnimation,
    toggleOverlay,
    toggleLayers,
    togglePalette,
    toggleSidebar,
    togglePanel,
    toggleColorPicker,
    toggleExportMenu,
    showTooltip,
    showDocumentCreation,
    hideDocumentCreation,
    closeOverlay,
    closePanel
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUIStore, import.meta.hot))
}
