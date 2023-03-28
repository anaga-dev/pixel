<template>
  <ToolButton :class="{ active: document.fill.type === 'fill' }" @click="document.setFillType('fill')">
    <Icon i="droplet" />
    Fill
  </ToolButton>
  <ToolButton :class="{ active: document.fill.type === 'erase' }" @click="document.setFillType('erase')">
    <Icon i="eraser" />
    Erase
  </ToolButton>
  <Divider vertical />
  <ToolButton :class="{ active: document.fill.contiguous }" @click="document.toggleFillContiguous()">
    <Icon i="contiguous" />
    Contiguous
  </ToolButton>
</template>

<script setup>
import { useDocumentStore } from '../stores/PixelDocument'
import ToolButton from '@components/ToolButton.vue'
import Divider from '@components/Divider.vue'
import Icon from '@components/Icon.vue'

const document = useDocumentStore()
</script>
