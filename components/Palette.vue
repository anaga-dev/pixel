<script setup>
import { useDocumentStore } from '@/stores/document'
import { Sortable } from 'sortablejs-vue3'

const documentStore = useDocumentStore()

const draggingColor = ref(false)

const activeColor = ref(null)
const removeMode = ref(false)
const overBin = ref(false)
const current = useColor(documentStore.color)

const handleUpdatePalette = (e) => {
  console.log('Update palette', e.oldIndex, e.newIndex)
  documentStore.swapPaletteColors(e.oldIndex, e.newIndex)
}

const onDropToRemove = (e) => {
  documentStore.palette.removeAt(e.oldIndex)
}

const handleSelectColor = (newStyle) => {
  console.log('Select color', newStyle)
  current.style.value = newStyle
  activeColor.value = newStyle
}

const handleRemoveColor = (index) => {
  documentStore.palette.removeAt(index)
}

const options = {
  delay: 250,
  delayOnTouchOnly: true
}

const onPointerOver = (e) => {
  addEventListener('keydown', handleKeyDown)
  addEventListener('keyup', handleKeyUp)
}

const onPointerOut = (e) => {
  removeEventListener('keydown', handleKeyDown)
  removeEventListener('keyup', handleKeyUp)
}

const handleKeyDown = (e) => {
  removeMode.value = documentStore.keys.current.has('control')
}

const handleKeyUp = (e) => {
  removeMode.value = false
}

watch(
  () => current.style.value,
  (newValue) => {
    documentStore.setColor(newValue)
  }
)
</script>

<template>
  <Sortable
    class="Palette"
    :class="{ remove: removeMode }"
    itemKey="id"
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
  background-color: var(--colorLayer1);
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

.remove {
  cursor: url('@/assets/cursors/delete.svg') 12 12, auto;
}
</style>
