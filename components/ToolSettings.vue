<script setup>
import Tool from '@/pixel/enums/Tool'

const props = defineProps({
  tool: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="ToolSettings" role="toolbar">
    <ToolSettingsPencil v-if="props.tool === Tool.PENCIL" />
    <ToolSettingsEraser v-else-if="props.tool === Tool.ERASER" />
    <ToolSettingsFill v-else-if="props.tool === Tool.FILL" />
    <ToolSettingsShape v-else-if="props.tool === Tool.SHAPE" />
    <ToolSettingsTransform v-else-if="props.tool === Tool.TRANSFORM" />
    <ToolSettingsSelect v-else-if="props.tool === Tool.SELECT" />
    <ToolSettingsEyedropper v-else-if="props.tool === Tool.EYEDROPPER" />
  </div>
</template>

<style scoped>
.ToolSettings {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: var(--space-s);
}
</style>
