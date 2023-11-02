<template>
  <div class="Palette" :class="{ remove: removeMode }">
    <PaletteColor
      v-for="(color, index) in palette.colors"
      :key="index"
      :index="index"
      :color="color"
      :active="activeColor === color"
      @select="onSelectColor(color)"
      @remove="onRemoveColor(index)"
      draggable="true"
      @dragstart="onDragStart(index, color)"
      @dragend="onDragEnd"
      @dragover="onDragOver"
      @drop="onDrop"
    />
  </div>
  <div
    v-if="draggingColor"
    class="remove-area"
    :class="{ over: overBin }"
    @drop.prevent="onDropToRemove"
    @dragenter.prevent
  >
    <Icon i="delete" />
    {{ $t('delete') }}
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'

const documentStore = useDocumentStore()

const { palette } = storeToRefs(documentStore)
const draggingColor = ref(false)
const fromIndex = ref(null)
const fromColor = ref(null)

const activeColor = ref(null)
const removeMode = ref(false)
const overBin = ref(false)
const current = useColor(documentStore.color)

function onDragStart(index, color) {
  draggingColor.value = true
  fromIndex.value = index
  fromColor.value = color
}

function onDragOver(e) {
  e.preventDefault()
  if(!draggingColor.value) return
  const ownIndex = e.currentTarget.dataset.index
}

function onDragEnd(e) {
  draggingColor.value = false
  console.log('Drag end')
}

function onDrop(e) {
  if(!draggingColor.value) return
  const destination = e.currentTarget
  console.log('Drop', destination)
  const toIndex = parseInt(destination.dataset.index, 10)
  documentStore.palette.swap(fromIndex.value, toIndex)
  draggingColor.value = false
}

function onDropToRemove(e) {
  console.log('Drop to remove!!!')
  documentStore.palette.removeAt(fromIndex.value)
  draggingColor.value = false
}

function onSelectColor(newStyle) {
  current.style.value = newStyle
  activeColor.value = newStyle
}

function onRemoveColor(index) {
  documentStore.palette.removeAt(index)
  draggingColor.value = false
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
  grid-template-columns: repeat(auto-fill, minmax(2rem, 1fr));
  gap: 2px;
}

.Palette.remove {
  cursor: grab;
}

.remove-area {
  display: grid;
  place-content: center;
  align-items: center;
  grid-auto-flow: column;
  gap: var(--spaceS);
  padding: var(--spaceL);
}

.remove-area.over {
  background-color: var(--colorShade);
  color: var(--colorTextPrimary);
}
</style>
