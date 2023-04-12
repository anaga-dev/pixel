import { defineStore, acceptHMRUpdate } from 'pinia'

export const useUIStore = defineStore('UI', {
  state: () => ({
    emitterBox: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    },
    panels: {
      layers: true,
      palette: true,
      preview: true
    },
    showSplash: false,
    showLayerSettings: false,
    showDropdown: false,
    showGeneralSettings: false
  }),
  getters: {
    isShowingLayerSettings() {
      return this.showLayerSettings
    },
    isShowingGeneralSettings() {
      return this.showGeneralSettings
    },
    isShowingDropdown() {
      return this.showLayerSettings
    },
    isShowingSplash() {
      return this.showSplash
    }
  },
  actions: {
    toggleGeneralSettings() {
      console.log('toggle!')
      this.showGeneralSettings = !this.showGeneralSettings
    },
    collapsePanelLayers(value) {
      this.panels.layers = value
    },
    collapsePanelPreview(value) {
      this.panels.preview = value
    },
    collapsePanelPalette(value) {
      this.panels.palette = value
    },
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUIStore, import.meta.hot))
}

