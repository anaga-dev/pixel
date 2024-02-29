export const useUIStore = defineStore('ui', () => {
  const emitterBox = ref({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })

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

  const toggleOverlay = (el) => {
    if (showOverlay.value !== el) {
      showOverlay.value = el
    } else if (showOverlay.value === el) {
      showOverlay.value = null
    }
  }

  const toggleSidePanel = () => {
    showSidePanel.value = !showSidePanel.value
  }

  const togglePanel = (panel) => {
    if (showPanel.value !== null) {
      showPanel.value = null
    } else {
      showPanel.value = panel
    }
  }

  const toggleLayers = () => {
    showLayers.value = !showLayers.value
  }
  const togglePalette = () => {
    showPalette.value = !showPalette.value
  }

  const toggleColorPicker = () => {
    showColorPicker.value = !showColorPicker.value
  }

  const toggleExportMenu = () => {
    showExportMenu.value = !showExportMenu.value
  }

  const showTooltip = (rect, message) => {
    tooltip.value.rect = rect
    tooltip.value.message = message
  }

  return {
    showDocumentCreation,
    emitterBox,
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
    toggleOverlay,
    toggleLayers,
    togglePalette,
    toggleSidePanel,
    togglePanel,
    toggleColorPicker,
    toggleExportMenu,
    showTooltip
  }
})

/* if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUIStore, import.meta.hot))
}
 */
