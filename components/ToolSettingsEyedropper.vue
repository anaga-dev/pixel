<script setup>
import { useDocumentStore } from '@/stores/document'

const documentStore = useDocumentStore()
</script>

<template>
  <ToolButton
    tooltip-text="studio.tooltips.all-layers"
    label="studio.composite"
    icon="composite"
    :active="documentStore.dropper.selectCompositeColor"
    @click="documentStore.toggleDropperCompositeColor()"
  />
</template>
