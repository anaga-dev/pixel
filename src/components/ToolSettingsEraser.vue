<template>
  <div class="tool-settings-eraser">
    <button class="pill" type="button" id="shape">
      <svg v-if="document.eraser.shape === 'round'" width="8" height="8" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="8" fill="#fff"></circle>
      </svg>
      <svg v-else-if="document.eraser.shape === 'square'" width="8" height="8" viewBox="0 0 16 16">
        <rect x="0" cy="0" width="16" height="16" fill="#fff"></rect>
      </svg>
      <svg v-else-if="document.eraser.shape === 'dither'" width="8" height="8" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="8" stroke="#fff"></circle>
      </svg>
    </button>
    <button class="pill" type="button" id="size">
      {{ document.eraser.size }}px
    </button>
  </div>
</template>

<script setup>
import { useDocumentStore } from '../stores/PixelDocument'

const document = useDocumentStore()
</script>
