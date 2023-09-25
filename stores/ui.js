export const useUIStore = defineStore('ui', {
  state: () => ({
    emitterBox: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    },
    showOverlay: null,
    showPanel: true,
    showColorPicker: true,
    showLayers: true,
    showSplash: false,
    showTooltip: null,
    showLayerSettings: false
  }),
  getters: {
    isShowingAnyPanels() {
      return this.showLayers || this.showColorPicker || this.showPreview
    },
    isShowingLayerSettings() {
      return this.showOverlay === 'layer-settings'
    },
    isShowingSplash() {
      return this.showSplash
    },
    isShowingLayersPanel() {
      return this.showPanel === 'layers'
    },
    isShowingPanel() {
      return this.showPanel === true
    },
    isShowingPalettePanel() {
      return this.showPalette
    },
    isShowingPreviewPanel() {
      return this.showPreview
    }
  },
  actions: {
    toggleOverlay(el) {
      if (this.showOverlay !== el) {
        this.showOverlay = el
      } else if (this.showOverlay === el) {
        this.showOverlay = null
      }
    },
    togglePanel() {
      this.showPanel = !this.showPanel
    },
    toggleLayers() {
      this.showLayers = !this.showLayers
    },
    toggleColorPicker() {
      this.showColorPicker = !this.showColorPicker
    },
    togglePalettePanel() {
      this.showPalette = !this.showPalette
    },
    togglePreviewPanel() {
      this.showPreview = !this.showPreview
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUIStore, import.meta.hot))
}
