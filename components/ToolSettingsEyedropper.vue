<template>
  <ToolButton
    tooltipText="studio.tooltips.all-layers"
    label="studio.composite"
    icon="composite"
    :active="document.dropper.selectCompositeColor"
    @click="document.toggleDropperCompositeColor()"
  />
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'

const document = useDocumentStore()
</script>
