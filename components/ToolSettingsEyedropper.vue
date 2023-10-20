<template>
  <ToolButton :active="document.fill.contiguous" @click="document.toggleFillContiguous()">
    <Icon i="droplet" />
    Composite
  </ToolButton>
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'

const document = useDocumentStore()
</script>
