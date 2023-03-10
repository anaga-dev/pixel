<template>
  <div
    class="layer"
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
    @drop="onDrop">
    <div class="actions">
      <div class="settings" @click="$emit('settings', layer)">
        <i v-if="settings" class="bx bx-chevron-right"></i>
        <i v-else class="bx bx-chevron-left"></i>
      </div>
      <div class="visibility" @click="$emit('visible', layer)">
        <i v-if="layer.visible" class="bx bx-show"></i>
        <i v-else class="bx bx-hide"></i>
      </div>
    </div>
    <div class="name">
      {{ layer.name.value }}
    </div>
    <!--
    <div class="collapse">
      <i class="bx bx-chevron-down"></i>
    </div>
    -->
    <div class="preview preview-canvas" ref="preview">
      <!-- Añadimos una vista del canvas -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useDocumentStore } from '../../stores/PixelDocument'

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
  const destination = e.path.find((element) => element.classList.contains('layer'))
  const toIndex = parseInt(destination.dataset.index, 10)
  console.log('from', fromIndex, 'to', toIndex)
  document.swapLayers(fromIndex, toIndex)
}
</script>

<style scoped>
.layer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
}

.active {
  background: #3b3b3f;
}

.name {
  margin-left: 0.5rem;
}

.preview {
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  overflow: hidden;
  padding: 0.125rem;
}

.background {
  width: 4rem;
  height: 4rem;
  border: 1px solid #000;
}

canvas {
  width: 100%;
  height: auto;
  background: url('/transparent.png');
  border: 1px solid #000;
}
</style>
