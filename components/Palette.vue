<script setup>
import { useDocumentStore } from '@/stores/document'
import { Sortable } from 'sortablejs-vue3'

const documentStore = useDocumentStore()
const uiStore = useUIStore()

const draggingColor = ref(false)

const activeColor = ref(null)
const removeMode = ref(false)
const overBin = ref(false)

const emit = defineEmits(['select'])

const options = {
  delay: 250,
  delayOnTouchOnly: true
}

function handleUpdatePalette(e) {
  documentStore.swapPaletteColors(e.oldIndex, e.newIndex)
}

function onDropToRemove(e) {
  documentStore.palette.removeAt(e.oldIndex)
}

function handleSelectColor(newStyle) {
  documentStore.setColor(newStyle)
  activeColor.value = newStyle
  if (uiStore.visiblePanel) {
    uiStore.closePanel() // TODO: find a better way to do this.. uiStore.closePanel()
  }
}

function handleRemoveColor(index) {
  documentStore.palette.removeAt(index)
}

function onPointerOver(e) {
  addEventListener('keydown', handleKeyDown)
  addEventListener('keyup', handleKeyUp)
}

function onPointerOut(e) {
  removeEventListener('keydown', handleKeyDown)
  removeEventListener('keyup', handleKeyUp)
}

function handleKeyDown(e) {
  removeMode.value = documentStore.keys.current.has('control')
}

function handleKeyUp(e) {
  removeMode.value = false
}
</script>

<template>
  <Sortable
    class="Palette"
    :class="{ remove: removeMode }"
    item-key="id"
    :list="documentStore.palette.colors"
    :options="options"
    @end="handleUpdatePalette"
    @pointerover="onPointerOver"
    @pointerout="onPointerOut"
  >
    <template #item="{ element, index }">
      <PaletteColor
        :index="index"
        :color="element"
        :active="activeColor === element.color"
        @select="handleSelectColor(element.color)"
        @remove="handleRemoveColor(index)"
      />
    </template>
  </Sortable>
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

<style scoped>
.Palette {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(2rem, 1fr));
  gap: 2px;
  padding: 2px;
  background-color: var(--color-base-900);
}

.remove-area {
  display: grid;
  place-content: center;
  align-items: center;
  grid-auto-flow: column;
  gap: var(--space-s);
  padding: var(--space-l);
}

.remove-area.over {
  background-color: var(--color-highlight);
  color: var(--color-base-50);
}

.remove {
  cursor: url('@/assets/cursors/delete.svg') 12 12, auto;
}
</style>
