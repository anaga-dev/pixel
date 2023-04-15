<template>
  <ToolButton :active="document.shape.type === 'line'" @click="document.setShapeType('line')">
    <Icon i="line" />
    Line
  </ToolButton>
  <ToolButton :active="document.shape.type === 'rectangle'" @click="document.setShapeType('rectangle')">
    <Icon i="square" />
    Rectangle
  </ToolButton>
  <ToolButton :active="document.shape.type === 'ellipse'" @click="document.setShapeType('ellipse')">
    <Icon i="circle" />
    Ellipse
  </ToolButton>
  <Divider vertical />
  <ToolButton :active="document.shape.filled" @click="document.toggleShapeFill()">
    <Icon i="droplet" />
    Fill shape
  </ToolButton>
  <ToolButton :active="document.shape.lockAspectRatio" @click="document.toggleShapeLockAspectRatio()">
    <Icon i="lock" />
    Lock aspect ratio
  </ToolButton>
</template>

<script setup>
import { useDocumentStore } from '@/stores/PixelDocument'
import ToolButton from '@/components/ToolButton.vue'
import Divider from '@/components/Divider.vue'
import Icon from '@/components/Icon.vue'

const document = useDocumentStore()
</script>

<style scoped>
.ToolSettingsShape {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: var(--spaceS);
}
</style>
