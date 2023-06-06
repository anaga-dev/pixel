<template>
  <Toolbar>
    <template #center>
      <ToolButton label="Pencil" :active="documentStore.tool === Tool.PENCIL" @click="documentStore.setTool(Tool.PENCIL)">
        <Icon i="pencil" />
      </ToolButton>
      <ToolButton label="Eraser" :active="documentStore.tool === Tool.ERASER" @click="documentStore.setTool(Tool.ERASER)">
        <Icon i="eraser" />
      </ToolButton>
      <ToolButton label="Fill with color" :active="documentStore.tool === Tool.FILL" @click="documentStore.setTool(Tool.FILL)">
        <Icon i="fill" />
      </ToolButton>
      <ToolButton label="Shapes" :active="documentStore.tool === Tool.SHAPE" @click="documentStore.setTool(Tool.SHAPE)">
        <Icon i="shapes" />
      </ToolButton>
      <ToolButton label="Pointer" :active="documentStore.tool === Tool.TRANSFORM" @click="documentStore.setTool(Tool.TRANSFORM)">
        <Icon i="pointer" />
      </ToolButton>
      <ToolButton label="Selection" :active="documentStore.tool === Tool.SELECT" @click="documentStore.setTool(Tool.SELECT)">
        <Icon i="selection" />
      </ToolButton>
      <ToolButton label="Eyedropper" :active="documentStore.tool === Tool.DROPPER" @click="documentStore.setTool(Tool.DROPPER)">
        <Icon i="eyedropper" />
      </ToolButton>
    </template>
          <!--
      FIXME: Aunque parezca que no, esto está siendo un agujero de rendimiento, supongo
      que porque `documentStore.history.canUndo` se recalcula cada vez que se pinta un pixel.
    -->
    <template #bottom>
      <ToolButton label="Undo" :disabled="!documentStore.history.canUndo" @click="documentStore.undo()">
        <Icon i="undo" />
      </ToolButton>
      <ToolButton label="Redo" :disabled="!documentStore.history.canRedo" @click="documentStore.redo()">
        <Icon i="redo" />
      </ToolButton>
    </template>
  </Toolbar>
</template>

<script setup>
import Tool from '@/enums/Tool'
import Toolbar from '@/components/Toolbar.vue'
import ToolButton from '@/components/ToolButton.vue'
import ToolColor from '@/components/ToolColor.vue'
import ColorPicker from '@/components/ColorPicker.vue'
import { useDocumentStore } from '@/stores/DocumentStore'
import Icon from '@/components/Icon.vue'
import Divider from '@/components/Divider.vue'

const documentStore = useDocumentStore()
</script>