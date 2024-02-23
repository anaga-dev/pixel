<script setup>
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'
import { useTransformStore } from '@/stores/transform'

const documentStore = useDocumentStore()
const transformStore = useTransformStore()

const { flipHorizontally, flipVertically } = documentStore
const { toggleTiling } = transformStore
const { tiling } = storeToRefs(transformStore)
</script>

<template>
  <ToolButton
    tooltip-text="studio.tooltips.tiling"
    label="studio.tiling"
    icon="tiling"
    :active="tiling"
    @click="toggleTiling"
  />
  <Divider
    vertical
    transparent
  />
  <ToolButton
    tooltip-text="studio.tooltips.flip-horizontal"
    label="studio.flip-horizontal"
    icon="flip-horizontal"
    @click="flipHorizontally()"
  />
  <ToolButton
    tooltip-text="studio.tooltips.flip-vertical"
    label="studio.flip-vertical"
    icon="flip-vertical"
    @click="flipVertically()"
  />
</template>

<style scoped>
.tool-settings-transform {
  display: flex;
  gap: 1rem;
}
</style>
