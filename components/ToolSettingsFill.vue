<template>
  <ToolButton :active="document.fill.type === 'fill'" @click="document.setFillType('fill')">
    <Icon i="droplet" />
    Fill
  </ToolButton>
  <ToolButton :active="document.fill.type === 'erase'" @click="document.setFillType('erase')">
    <Icon i="eraser" />
    Erase
  </ToolButton>
  <Divider vertical />
  <ToolButton :active="document.fill.contiguous" @click="document.toggleFillContiguous()">
    <Icon i="droplet" />
    Contiguous
  </ToolButton>
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'

const document = useDocumentStore()
</script>
