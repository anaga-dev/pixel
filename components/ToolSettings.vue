<template>
  <div class="ToolSettings">
    <ToolSettingsPencil v-if="tool === Tool.PENCIL" />
    <ToolSettingsEraser v-else-if="tool === Tool.ERASER" />
    <ToolSettingsFill v-else-if="tool === Tool.FILL" />
    <ToolSettingsShape v-else-if="tool === Tool.SHAPE" />
    <ToolSettingsTransform v-else-if="tool === Tool.TRANSFORM" />
    <ToolSettingsSelect v-else-if="tool === Tool.SELECT" />
    <ToolSettingsEyedropper v-else-if="tool === Tool.DROPPER" />
  </div>
</template>

<script setup>
import Tool from '@/pixel/enums/Tool'

const props = defineProps({
  tool: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.ToolSettings {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: var(--spaceS);
}
</style>
