<template>
  <Toolbar>
    <template #top>
      <ToolColor :color="pixelDocument.color" @click="pixelDocument.toggleColorPicker"></ToolColor>
      <ColorPicker class="color-picker" v-if="pixelDocument.colorPicker" @close="pixelDocument.toggleColorPicker" />
      <Divider />
      <ToolButton label="Pencil" :active="pixelDocument.tool === Tool.PENCIL" @click="pixelDocument.setTool(Tool.PENCIL)">
        <Icon i="pencil" />
      </ToolButton>
      <ToolButton label="Eraser" :active="pixelDocument.tool === Tool.ERASER" @click="pixelDocument.setTool(Tool.ERASER)">
        <Icon i="eraser" />
      </ToolButton>
      <ToolButton label="Fill with color" :active="pixelDocument.tool === Tool.FILL" @click="pixelDocument.setTool(Tool.FILL)">
        <Icon i="fill" />
      </ToolButton>
      <ToolButton label="Shapes" :active="pixelDocument.tool === Tool.SHAPE" @click="pixelDocument.setTool(Tool.SHAPE)">
        <Icon i="shapes" />
      </ToolButton>
      <ToolButton label="Pointer" :active="pixelDocument.tool === Tool.TRANSFORM" @click="pixelDocument.setTool(Tool.TRANSFORM)">
        <Icon i="pointer" />
      </ToolButton>
      <ToolButton label="Selection" :active="pixelDocument.tool === Tool.SELECT" @click="pixelDocument.setTool(Tool.SELECT)">
        <Icon i="selection" />
      </ToolButton>
      <ToolButton label="Eyedropper" :active="pixelDocument.tool === Tool.DROPPER" @click="pixelDocument.setTool(Tool.DROPPER)">
        <Icon i="eyedropper" />
      </ToolButton>
    </template>
    <!--
      FIXME: Aunque parezca que no, esto está siendo un agujero de rendimiento, supongo
      que porque `pixelDocument.history.canUndo` se recalcula cada vez que se pinta un pixel.
    -->
    <template #bottom>
      <ToolButton label="Undo" :disabled="!pixelDocument.history.canUndo" @click="pixelDocument.undo()">
        <Icon i="undo" />
      </ToolButton>
      <ToolButton label="Redo" :disabled="!pixelDocument.history.canRedo" @click="pixelDocument.redo()">
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
import { useDocumentStore } from '@/stores/Document'
import Icon from '@/components/Icon.vue'
import Divider from '@/components/Divider.vue'

const pixelDocument = useDocumentStore()
</script>

<style scoped>
.color-picker {
  left: calc(var(--widthToolbar) + var(--spaceS));
  top: calc(var(--widthToolbar) + var(--spaceS));
}
</style>
