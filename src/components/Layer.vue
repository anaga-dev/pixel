<template>
  <div
    class="Layer"
    draggable="true"
    :class="{ active: active }"
    :data-index="index"
    @click="$emit('activate', layer)"
    @drag="onDrag"
    @dragstart="onDragStart"
    @dragover="onDragOver"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @dragend="onDragEnd"
    @drop.capture="onDrop">
    <div class="actions">
      <Button class="action" label="Layer settings" :active="settings" variant="ghost" @click="$emit('settings', layer)" @drop="onDrop">
        <Icon i="arrow-left" />
      </Button>
      <Button class="action" :label="layer.visible ? 'Hide label' : 'Show label'" variant="ghost" @click="$emit('visible', layer)">
        <Icon :i="layer.visible ? 'visible' : 'hidden'" />
      </Button>
    </div>
    <div class="name">
      {{ layer.name.value }}
    </div>
    <!--
    <div class="collapse">
      <i class="bx bx-chevron-down"></i>
    </div>
    -->
    <div class="preview" ref="preview">
      <!-- Añadimos una vista del canvas -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useDocumentStore } from '@/stores/PixelDocument'
import Button from '@components/Button.vue'
import Icon from '@components/Icon.vue'

const document = useDocumentStore()

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  layer: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    required: false
  },
  settings: {
    type: Boolean,
    required: false
  }
})

const preview = ref()

onMounted(() => preview.value.appendChild(props.layer.canvas))

function onDrag(e) {
  console.log(e.type, e)
}

function onDragStart(e) {
  console.log(e.type, e)
  e.dataTransfer.setData('text/plain', JSON.stringify({
    index: props.index,
    layer: {
      id: props.layer.id
    }
  }))
}

function onDragOver(e) {
  console.log(e.type, e)
  e.preventDefault()
}

function onDragEnd(e) {
  console.log(e.type, e)
}

function onDragEnter(e) {
  console.log(e.type, e)
}

function onDragLeave(e) {
  console.log(e.type, e)
}

function onDrop(e) {
  console.log(e.type, e)
  const payload = e.dataTransfer.getData('text/plain')
  console.log(payload)
  if (!payload) {
    return
  }
  const { index: fromIndex, layer } = JSON.parse(payload)
  // console.log(index, layer)
  const destination = e.target
  const toIndex = parseInt(destination.dataset.index, 10)
  console.log('from', fromIndex, 'to', toIndex)
  document.layers.swap(fromIndex, toIndex)
}
</script>

<style scoped>
.Layer {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
}

.Layer.active {
  background-color: var(--colorLayer2);
  color: var(--colorText);
}

.actions {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
}

.name {
  font-weight: bold;
  padding: var(--spaceS);
}

.preview {
  display: grid;
  place-items: stretch;
  width: 4rem;
  aspect-ratio: 1;
  overflow: hidden;
  background: url('@/assets/checkers.svg');
}

canvas {
  width: 100%;
  height: auto;
}
</style>
