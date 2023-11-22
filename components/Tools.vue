<script setup>
import Tool from '@/pixel/enums/Tool'
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'

const documentStore = useDocumentStore()
const uiStore = useUIStore()

const { showTooltip } = uiStore
const { tooltip } = storeToRefs(uiStore)
</script>

<template>
  <div class="Tools">
    <ToolButton
      tooltipText="studio.tooltips.pencil"
      tooltipPosition="right"
      label="studio.pencil"
      icon="pencil"
      variant="icon"
      :active="documentStore.tool === Tool.PENCIL"
      @click="documentStore.setTool(Tool.PENCIL)"
    />
    <ToolButton
      tooltipText="studio.tooltips.eraser"
      tooltipPosition="right"
      label="studio.eraser"
      icon="eraser"
      variant="icon"
      :active="documentStore.tool === Tool.ERASER"
      @click="documentStore.setTool(Tool.ERASER)"
    />
    <ToolButton
      tooltipText="studio.tooltips.fill"
      tooltipPosition="right"
      label="studio.fill"
      icon="fill"
      variant="icon"
      :active="documentStore.tool === Tool.FILL"
      @click="documentStore.setTool(Tool.FILL)"
    />
    <ToolButton
      tooltipText="studio.tooltips.shapes"
      tooltipPosition="right"
      label="studio.shapes"
      icon="shapes"
      variant="icon"
      :active="documentStore.tool === Tool.SHAPE"
      @click="documentStore.setTool(Tool.SHAPE)"
    />
    <ToolButton
      tooltipText="studio.tooltips.transform"
      tooltipPosition="right"
      label="studio.transform"
      icon="pointer"
      variant="icon"
      :active="documentStore.tool === Tool.TRANSFORM"
      @click="documentStore.setTool(Tool.TRANSFORM)"
    />
    <ToolButton
      tooltipText="studio.tooltips.selection"
      tooltipPosition="right"
      label="studio.selection"
      icon="selection"
      variant="icon"
      :active="documentStore.tool === Tool.SELECT"
      @click="documentStore.setTool(Tool.SELECT)"
    />
    <Tooltip :message="$t('studio.tooltips.color-picker')" position="right">
      <ToolColor :color="documentStore.color" />
    </Tooltip>
    <ToolButton
      tooltipText="studio.tooltips.eyedropper"
      tooltipPosition="right"
      label="studio.eyedropper"
      icon="eyedropper"
      variant="icon"
      :active="documentStore.tool === Tool.DROPPER"
      @click="documentStore.setTool(Tool.DROPPER)"
    />
    <!--
        FIXME: This is a performance sinkhole, I guess it's because `documentStore.history.canUndo`
        is recalculated every time we paint a pixel.
            -->
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
