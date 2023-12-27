<script setup>
import { storeToRefs } from 'pinia'
import { useDocumentStore } from '@/stores/document'
import { useTransformStore } from '@/stores/transform'

const documentStore = useDocumentStore()
const transformStore = useTransformStore()

const { toggleTiling } = transformStore
const { tiling } = storeToRefs(transformStore)

const position = [0, 0]
const size = [120, 100]
const rotation = 0
</script>

<template>
  <ToolButton
    tooltipText="studio.tooltips.tiling"
    label="studio.tiling"
    icon="tiling"
    :active="tiling"
    @click="toggleTiling"
  />
</template>

<style scoped>
.tool-settings-transform {
  display: flex;
  gap: 1rem;
}
</style>
