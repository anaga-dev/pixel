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
    }
  },
  actions: {
    toggleGeneralSettings() {
      console.log('toggle!')
      this.showGeneralSettings = !this.showGeneralSettings
    }
  }
})