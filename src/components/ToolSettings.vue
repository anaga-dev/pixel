<template>
  <div class="tool-settings">
    <ToolSettingsPencil v-if="tool === Tool.PENCIL" />
    <ToolSettingsEraser v-else-if="tool === Tool.ERASER" />
    <ToolSettingsFill v-else-if="tool === Tool.FILL" />
    <ToolSettingsShape v-else-if="tool === Tool.SHAPE" />
    <ToolSettingsTransform v-else-if="tool === Tool.TRANSFORM" />
    <ToolSettingsSelect v-else-if="tool === Tool.SELECT" />
  </div>
</template>

<script setup>
import ToolSettingsPencil from './ToolSettingsPencil.vue'
import ToolSettingsEraser from './ToolSettingsEraser.vue'
import ToolSettingsFill from './ToolSettingsFill.vue'
import ToolSettingsShape from './ToolSettingsShape.vue'
import ToolSettingsTransform from './ToolSettingsTransform.vue'
import ToolSettingsSelect from './ToolSettingsSelect.vue'
import Tool from '../enums/Tool'

const props = defineProps({
  tool: {
    type: String,
    required: true
  }
})
</script>
