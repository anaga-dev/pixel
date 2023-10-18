<script setup>
import Tool from '@/pixel/enums/Tool'
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'

const documentStore = useDocumentStore()
const uiStore = useUIStore()

const handleColorPanel = () => {
  uiStore.showColorPicker = true
}
</script>

<template>
  <div class="Tools">
    <ToolButton
      label="Pencil"
      :active="documentStore.tool === Tool.PENCIL"
      @click="documentStore.setTool(Tool.PENCIL)"
    >
      <Icon i="pencil" />
    </ToolButton>
    <ToolButton
      label="Eraser"
      :active="documentStore.tool === Tool.ERASER"
      @click="documentStore.setTool(Tool.ERASER)"
    >
      <Icon i="eraser" />
    </ToolButton>
    <ToolButton
      label="Fill with color"
      :active="documentStore.tool === Tool.FILL"
      @click="documentStore.setTool(Tool.FILL)"
    >
      <Icon i="fill" />
    </ToolButton>
    <ToolButton
      label="Shapes"
      :active="documentStore.tool === Tool.SHAPE"
      @click="documentStore.setTool(Tool.SHAPE)"
    >
      <Icon i="shapes" />
    </ToolButton>
    <ToolButton
      label="Pointer"
      :active="documentStore.tool === Tool.TRANSFORM"
      @click="documentStore.setTool(Tool.TRANSFORM)"
    >
      <Icon i="pointer" />
    </ToolButton>
    <ToolButton
      label="Selection"
      :active="documentStore.tool === Tool.SELECT"
      @click="documentStore.setTool(Tool.SELECT)"
    >
      <Icon i="selection" />
    </ToolButton>
    <ToolColor
        :color="documentStore.color"
        @click="handleColorPanel"
      />
    <ToolButton
      label="Eyedropper"
      :active="documentStore.tool === Tool.DROPPER"
      @click="documentStore.setTool(Tool.DROPPER)"
    >
      <Icon i="eyedropper" />
    </ToolButton>
    <!--
        FIXME: This is a performance sinkhole, I guess it's because `documentStore.history.canUndo`
        is recalculated every time we paint a pixel.
            -->
    <Divider />
    <ToolButton
      label="Undo"
      :disabled="!documentStore.history.canUndo"
      @click="documentStore.undo()"
    >
      <Icon i="undo" />
    </ToolButton>
    <ToolButton
      label="Redo"
      :disabled="!documentStore.history.canRedo"
      @click="documentStore.redo()"
    >
      <Icon i="redo" />
    </ToolButton>
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
