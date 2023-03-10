<template>
  <div v-if="document.pointer" class="pointer-status">
    {{ document.pointer.offset.x.toFixed(0) }}, {{ document.pointer.offset.y.toFixed(0) }}
  </div>
</template>

<script setup>
import { useDocumentStore } from '../stores/PixelDocument'

const document = useDocumentStore()
</script>

<style scoped>
.pointer-status {
  min-width: 8rem;
}
</style>
