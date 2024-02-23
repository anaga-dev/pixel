<template>
  <ToolButton
    tooltip-text="studio.tooltips.shapes.line"
    label="studio.line"
    icon="line"
    :active="document.shape.type === 'line'"
    @click="document.setShapeType('line')"
  />
  <ToolButton
    tooltip-text="studio.tooltips.shapes.rectangle"
    label="studio.rectangle"
    icon="square"
    :active="document.shape.type === 'rectangle'"
    @click="document.setShapeType('rectangle')"
  />
  <ToolButton
    tooltip-text="studio.tooltips.shapes.ellipse"
    label="studio.ellipse"
    icon="circle"
    :active="document.shape.type === 'ellipse'"
    @click="document.setShapeType('ellipse')"
  />
  <Divider
    vertical
    transparent
  />
  <ToolButton
    tooltip-text="studio.tooltips.shapes.fill"
    label="studio.fill"
    icon="droplet"
    :active="document.shape.filled"
    @click="document.toggleShapeFill()"
  />
  <ToolButton
    tooltip-text="studio.tooltips.shapes.lock-aspect-ratio"
    label="studio.lock-aspect-ratio"
    icon="lock"
    :active="document.shape.lockAspectRatio"
    @click="document.toggleShapeLockAspectRatio()"
  />
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'

const document = useDocumentStore()
</script>

<style scoped>

@media screen and (max-width: 768px) {
  span {
    display: none;
  }
}
</style>
