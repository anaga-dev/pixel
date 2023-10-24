<template>
  <div class="Palette">
    <PaletteColor
      v-for="(color, index) in palette.colors"
      :key="index"
      :color="color"
      :active="activeColor === color"
      @select="onSelectColor(color)"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import PaletteColor from './PaletteColor.vue'
import { useDocumentStore } from '@/stores/document'

const documentStore = useDocumentStore()
const { palette } = storeToRefs(documentStore)

const activeColor = ref(null)
const current = useColor(documentStore.color)

function onSelectColor(newStyle) {
  current.style.value = newStyle
  activeColor.value = newStyle
}

watch(
  () => current.style.value,
  (newValue) => {
    documentStore.setColor(newValue)
  }
)
</script>

<style scoped>
.Palette {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--spaceL), 1fr));
  gap: 2px;
}
</style>
