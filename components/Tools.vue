<script setup>
import Tool from '@/pixel/enums/Tool'
import { useDocumentStore } from '@/stores/document'

const documentStore = useDocumentStore()
</script>

<template>
  <div class="Tools">
    <ToolButton
      tooltip-text="studio.tooltips.pencil"
      tooltip-position="right"
      label="studio.pencil"
      icon="pencil"
      variant="icon"
      :active="documentStore.tool === Tool.PENCIL"
      @click="documentStore.setTool(Tool.PENCIL)"
    />
    <ToolButton
      tooltip-text="studio.tooltips.eraser"
      tooltip-position="right"
      label="studio.eraser"
      icon="eraser"
      variant="icon"
      :active="documentStore.tool === Tool.ERASER"
      @click="documentStore.setTool(Tool.ERASER)"
    />
    <ToolButton
      tooltip-text="studio.tooltips.fill"
      tooltip-position="right"
      label="studio.fill"
      icon="fill"
      variant="icon"
      :active="documentStore.tool === Tool.FILL"
      @click="documentStore.setTool(Tool.FILL)"
    />
    <ToolButton
      tooltip-text="studio.tooltips.shapes.shapes"
      tooltip-position="right"
      label="studio.shapes"
      icon="shapes"
      variant="icon"
      :active="documentStore.tool === Tool.SHAPE"
      @click="documentStore.setTool(Tool.SHAPE)"
    />
    <!-- TODO: show selection and transform when finished -->
    <!--
    <ToolButton
      tooltip-text="studio.tooltips.transform"
      tooltip-position="right"
      label="studio.transform"
      icon="transform"
      variant="icon"
      :active="documentStore.tool === Tool.TRANSFORM"
      @click="documentStore.setTool(Tool.TRANSFORM)"
    />
    <ToolButton
      tooltip-text="studio.tooltips.selection"
      tooltip-position="right"
      label="studio.selection"
      icon="selection"
      variant="icon"
      :active="documentStore.tool === Tool.SELECT"
      @click="documentStore.setTool(Tool.SELECT)"
    />
    -->
    <Tooltip
      message="studio.tooltips.color-picker"
      position="right"
    >
      <ToolColor :color="documentStore.color" />
    </Tooltip>
    <ToolButton
      tooltip-text="studio.tooltips.eyedropper"
      tooltip-position="right"
      label="studio.eyedropper"
      icon="eyedropper"
      variant="icon"
      :active="documentStore.tool === Tool.EYEDROPPER"
      @click="documentStore.setTool(Tool.EYEDROPPER)"
    />
  </div>
</template>

<style scoped>
.Tools {
  display: grid;
  justify-content: center;
  gap: var(--spaceM);
  padding: var(--spaceM) var(--spaceS);
  background-color: var(--colorLayer1);
  box-shadow: calc(var(--spaceXS) * -1) 0 0 var(--colorShadow);
}

@media (max-height: 480px) {
  .Tools {
    gap: var(--spaceM);
    padding: var(--spaceM);
    grid-template-columns: repeat(2, 1fr);
  }
  .divider {
    grid-column: 1 / span 2;
  }
}
</style>
