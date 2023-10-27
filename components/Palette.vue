<template>
  <div class="Palette">
    <PaletteColor
      v-for="(color, index) in palette.colors"
      :key="index"
      :index="index"
      :color="color"
      :active="activeColor === color"
      @select="onSelectColor(color)"
      draggable="true"
      @dragstart="onDragStart(index, color)"
      @dragover="onDragOver"
      @dragend="onDragEnd"
      @drop.capture="onDrop"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'

const documentStore = useDocumentStore()
const { palette } = storeToRefs(documentStore)
const fromIndex = ref(null)
const fromColor = ref(null)

const activeColor = ref(null)
const current = useColor(documentStore.color)

function onDragStart(index, color) {
  fromIndex.value = index
  fromColor.value = color
}

function onDragOver(e) {
  e.preventDefault()
  const ownIndex = e.currentTarget.dataset.index
  console.log('Drag over', fromIndex.value, ownIndex)
}

function onDragEnd(e) {
}

function onDrop(e) {
  const destination = e.currentTarget
  const toIndex = parseInt(destination.dataset.index, 10)
  console.log('Drop data', fromIndex.value, toIndex)
  documentStore.palette.swap(fromIndex.value, toIndex)
}

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
