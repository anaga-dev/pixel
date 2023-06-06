import { defineStore, acceptHMRUpdate } from 'pinia'

export const useUIStore = defineStore('UIStore', {
  state: () => ({
    emitterBox: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    },
    showOverlay: null,
    showPanel: null,
    showSplash: false,
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
    togglePanel(el) {
      if (this.showPanel !== el) {
        this.showPanel = el  
      } else if (this.showPanel === el) {
        this.showPanel = null
      }
    },
    toggleColorPicker() {
      this.showPanel = !this.showColorPicker
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
