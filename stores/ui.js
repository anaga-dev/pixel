import { useDocumentStore } from "./document.js"

export const useUIStore = defineStore('ui', () => {
  const documentStore = useDocumentStore()
  const emitterBox = ref({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })

  const showAnimation = ref(false)
  const showOverlay = ref(null)
  const showDocumentCreation = ref(false)
  const showSidePanel = ref(true)
  const showPanel = ref(null)
  const showColorPicker = ref(false)
  const showPalette = ref(true)
  const showLayers = ref(true)
  const showExportMenu = ref(false)
  const tooltip = ref(null)
  const showLayerSettings = ref(false)
  const expandedSidebar = ref(true)

  const ctrlDown = ref(false)
  const spaceDown = ref(false)

  function toggleOverlay(el) {
    if (showOverlay.value !== el) {
      showOverlay.value = el
    } else if (showOverlay.value === el) {
      showOverlay.value = null
    }
  }

  function toggleSidePanel() {
    showSidePanel.value = !showSidePanel.value
  }

  function togglePanel(panel) {
    if (showPanel.value !== null) {
      showPanel.value = null
    } else {
      showPanel.value = panel
    }
  }

  function toggleLayers() {
    showLayers.value = !showLayers.value
  }
  function togglePalette() {
    showPalette.value = !showPalette.value
  }

  function toggleColorPicker() {
    showColorPicker.value = !showColorPicker.value
  }

  function toggleExportMenu() {
    showExportMenu.value = !showExportMenu.value
  }

  function showTooltip(rect, message) {
    tooltip.value.rect = rect
    tooltip.value.message = message
  }

  function toggleAnimation() {
    showAnimation.value = !showAnimation.value
  }

  function showDocumentCreationModal() {
    showDocumentCreation.value = true
  }

  function closeOverlay() {
    showOverlay.value = null
  }

  return {
    showDocumentCreation,
    emitterBox,
    showAnimation,
    showOverlay,
    showPanel,
    showSidePanel,
    showColorPicker,
    showPalette,
    showLayers,
    showExportMenu,
    tooltip,
    showLayerSettings,
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
    showDocumentCreationModal,
    closeOverlay
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUIStore, import.meta.hot))
}
