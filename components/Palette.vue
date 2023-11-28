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

watch(
  () => current.style.value,
  (newValue) => {
    documentStore.setColor(newValue)
  }
)
</script>

<template>
  <!--   <div class="Palette" :class="{ remove: removeMode }">
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
  </div> -->
  <Sortable
    class="Palette"
    :class="{ remove: removeMode }"
    itemKey="id"
    :list="documentStore.palette.colors"
    :options="options"
    @end="handleUpdatePalette"
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
