<template>
  <div class="tool-settings-fill">
    <button class="pill" type="button" id="fill" :class="{ active: document.fill.type === 'fill' }" @click="document.setFillType('fill')">
      <i class="bx bxs-droplet"></i>
      Fill
    </button>
    <button class="pill" type="button" id="eraser" :class="{ active: document.fill.type === 'erase' }" @click="document.setFillType('erase')">
      <i class="bx bxs-eraser"></i>
      Erase
    </button>
    <button class="pill" type="button" id="contiguous" :class="{ active: document.fill.contiguous }" @click="document.toggleFillContiguous()">
      <i class="bx bx-tone"></i>
      Contiguous
    </button>
  </div>
</template>

<script setup>
import { useDocumentStore } from '../stores/PixelDocument'

const document = useDocumentStore()
</script>
