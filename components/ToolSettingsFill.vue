<template>
  <ToolButton
    tooltip-text="studio.tooltips.fill-fill"
    label="studio.fill"
    icon="droplet"
    :active="document.fill.type === 'fill'"
    @click="document.setFillType('fill')"
  />
  <ToolButton
    tooltip-text="studio.tooltips.fill-erase"
    label="studio.erase"
    icon="eraser"
    :active="document.fill.type === 'erase'"
    @click="document.setFillType('erase')"
  />
  <Divider
    vertical
    transparent
  />
  <ToolButton
    tooltip-text="studio.tooltips.contiguous"
    label="studio.contiguous"
    icon="contiguous"
    :active="document.fill.contiguous"
    @click="document.toggleFillContiguous()"
  />
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'

const document = useDocumentStore()
</script>
