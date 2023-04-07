<template>
  <Button label="Brush shape" id="shape">
    <svg v-if="document.eraser.shape === 'round'" width="8" height="8" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="8" fill="#fff"></circle>
    </svg>
    <svg v-else-if="document.eraser.shape === 'square'" width="8" height="8" viewBox="0 0 16 16">
      <rect x="0" cy="0" width="16" height="16" fill="#fff"></rect>
    </svg>
    <svg v-else-if="document.eraser.shape === 'dither'" width="8" height="8" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="8" stroke="#fff"></circle>
    </svg>
  </Button>
  <Button label="Brush size" id="size">
    {{ document.eraser.size }}px
  </Button>
</template>

<script setup>
import { useDocumentStore } from '../stores/PixelDocument'
import Button from '@/components/Button.vue'

const document = useDocumentStore()
</script>
