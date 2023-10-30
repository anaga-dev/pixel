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
    <Tooltip :message="$t('studio.tooltips.pencil')" position="right">
      <ToolButton
        label="Pencil"
        :active="documentStore.tool === Tool.PENCIL"
        @click="documentStore.setTool(Tool.PENCIL)"
      >
        <Icon i="pencil" />
      </ToolButton>
    </Tooltip>
    <Tooltip :message="$t('studio.tooltips.eraser')" position="right">
      <ToolButton
        label="Eraser"
        :active="documentStore.tool === Tool.ERASER"
        @click="documentStore.setTool(Tool.ERASER)"
      >
        <Icon i="eraser" />
      </ToolButton>
    </Tooltip>
    <Tooltip :message="$t('studio.tooltips.fill')" position="right">
      <ToolButton
        label="Fill with color"
        :active="documentStore.tool === Tool.FILL"
        @click="documentStore.setTool(Tool.FILL)"
      >
        <Icon i="fill" />
      </ToolButton>
    </Tooltip>
    <Tooltip :message="$t('studio.tooltips.shapes')" position="right">
      <ToolButton
        label="Shapes"
        :active="documentStore.tool === Tool.SHAPE"
        @click="documentStore.setTool(Tool.SHAPE)"
      >
        <Icon i="shapes" />
      </ToolButton>
    </Tooltip>
    <Tooltip :message="$t('studio.tooltips.transform')" position="right">
      <ToolButton
        label="Pointer"
        :active="documentStore.tool === Tool.TRANSFORM"
        @click="documentStore.setTool(Tool.TRANSFORM)"
      >
        <Icon i="pointer" />
      </ToolButton>
    </Tooltip>
    <Tooltip :message="$t('studio.tooltips.selection')" position="right">
      <ToolButton
        label="Selection"
        :active="documentStore.tool === Tool.SELECT"
        @click="documentStore.setTool(Tool.SELECT)"
      >
        <Icon i="selection" />
      </ToolButton>
    </Tooltip>
    <Tooltip :message="$t('studio.tooltips.color-picker')" position="right">
      <ToolColor :color="documentStore.color" />
    </Tooltip>
    <Tooltip :message="$t('studio.tooltips.eyedropper')" position="right">
      <ToolButton
        label="Eyedropper"
        :active="documentStore.tool === Tool.DROPPER"
        @click="documentStore.setTool(Tool.DROPPER)"
      >
        <Icon i="eyedropper" />
      </ToolButton>
    </Tooltip>
    <!--
        FIXME: This is a performance sinkhole, I guess it's because `documentStore.history.canUndo`
        is recalculated every time we paint a pixel.
            -->
    <Divider />
    <Tooltip :message="$t('studio.tooltips.undo')" position="right">
      <ToolButton
        label="Undo"
        :disabled="!documentStore.history.canUndo"
        @click="documentStore.undo()"
      >
        <Icon i="undo" />
      </ToolButton>
    </Tooltip>
    <Tooltip :message="$t('studio.tooltips.redo')" position="right">
      <ToolButton
        label="Redo"
        :disabled="!documentStore.history.canRedo"
        @click="documentStore.redo()"
      >
        <Icon i="redo" />
      </ToolButton>
    </Tooltip>
  </div>
</template>

<style scoped>
.Tools {
  display: grid;
  justify-content: center;
  gap: var(--spaceM);
  padding: var(--spaceM) 0;
  background-color: var(--colorLayer1);
  box-shadow: var(--shadowLayer);
}
</style>
