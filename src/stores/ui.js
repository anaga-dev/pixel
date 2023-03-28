import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    emitterBox: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    },
    showLayerSettings: false,
    showDropdown: false
  }),
  getters: {
    isShowingLayerSettings() {
      return this.showLayerSettings
    },
    isShowingDropdown() {
      return this.showLayerSettings
    }
  }
})