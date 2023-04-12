<template>
  <div class="ToolSettings">
    <ToolSettingsPencil v-if="tool === Tool.PENCIL" />
    <ToolSettingsEraser v-else-if="tool === Tool.ERASER" />
    <ToolSettingsFill v-else-if="tool === Tool.FILL" />
    <ToolSettingsShape v-else-if="tool === Tool.SHAPE" />
    <ToolSettingsTransform v-else-if="tool === Tool.TRANSFORM" />
    <ToolSettingsSelect v-else-if="tool === Tool.SELECT" />
  </div>
</template>

<script setup>
import ToolSettingsPencil from '@/components/ToolSettingsPencil.vue'
import ToolSettingsEraser from '@/components/ToolSettingsEraser.vue'
import ToolSettingsFill from '@/components/ToolSettingsFill.vue'
import ToolSettingsShape from '@/components/ToolSettingsShape.vue'
import ToolSettingsTransform from '@/components/ToolSettingsTransform.vue'
import ToolSettingsSelect from '@/components/ToolSettingsSelect.vue'
import Tool from '@/enums/Tool'

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
  gap: var(--spaceM);
}
</style>