<template>
  <div class="tool-settings-pencil">
    <button class="pill" type="button" id="shape" @click="showing = 'brush-type'">
      <svg v-if="document.pencil.shape === 'round'" width="8" height="8" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="8" fill="#fff"></circle>
      </svg>
      <svg v-else-if="document.pencil.shape === 'square'" width="8" height="8" viewBox="0 0 16 16">
        <rect x="0" cy="0" width="16" height="16" fill="#fff"></rect>
      </svg>
      <svg v-else-if="document.pencil.shape === 'dither'" width="8" height="8" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="8" stroke="#fff"></circle>
      </svg>
    </button>
    <button class="pill" type="button" id="size" @click="showing = 'brush-size'">
      {{ document.pencil.size }}px
    </button>
    <BrushSelector v-if="showing === 'brush-type'" @select="onBrushShape" />
    <BrushSize v-else-if="showing === 'brush-size'" :current-size="document.pencil.size" @select="onBrushSize" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDocumentStore } from '../stores/PixelDocument'
import BrushSelector from './BrushSelector.vue'
import BrushSize from './BrushSize.vue'

const document = useDocumentStore()
const showing = ref('')

function onBrushShape(shape) {
  document.setPencilShape(shape)
  showing.value = ''
}

function onBrushSize(size) {
  document.setPencilSize(size)
  showing.value = ''
}
</script>
