<template>
  <Tools>
    <ToolToggle id="pencil" :active="pixelDocument.tool === Tool.PENCIL" @click="pixelDocument.setTool(Tool.PENCIL)">
      <i class="bx bx-pencil"></i>
    </ToolToggle>
    <ToolToggle id="eraser" :active="pixelDocument.tool === Tool.ERASER" @click="pixelDocument.setTool(Tool.ERASER)">
      <i class="bx bx-eraser"></i>
    </ToolToggle>
    <ToolToggle id="fill" :active="pixelDocument.tool === Tool.FILL" @click="pixelDocument.setTool(Tool.FILL)">
      <i class="bx bx-color-fill"></i>
    </ToolToggle>
    <ToolToggle id="shape" :active="pixelDocument.tool === Tool.SHAPE" @click="pixelDocument.setTool(Tool.SHAPE)">
      <i class="bx bxs-shapes"></i>
    </ToolToggle>
    <ToolToggle id="transform" :active="pixelDocument.tool === Tool.TRANSFORM" @click="pixelDocument.setTool(Tool.TRANSFORM)">
      <i class="bx bx-pointer"></i>
    </ToolToggle>
    <ToolToggle id="select" :active="pixelDocument.tool === Tool.SELECT" @click="pixelDocument.setTool(Tool.SELECT)">
      <i class="bx bx-selection"></i>
    </ToolToggle>
    <ToolSymmetry @click="pixelDocument.toggleSymmetrySettings"></ToolSymmetry>
    <SymmetrySettings v-if="pixelDocument.symmetrySettings" />
    <ToolColor :color="pixelDocument.color" @click="pixelDocument.toggleColorPicker"></ToolColor>
    <ColorPicker v-if="pixelDocument.colorPicker" />
    <ToolToggle id="dropper" :active="pixelDocument.tool === Tool.DROPPER" @click="pixelDocument.setTool(Tool.DROPPER)">
      <i class="bx bxs-eyedropper"></i>
    </ToolToggle>
    <!--
      FIXME: Aunque parezca que no, esto está siendo un agujero de rendimiento, supongo
      que porque `pixelDocument.history.canUndo` se recalcula cada vez que se pinta un pixel.
    -->
    <ToolButton id="undo" :disabled="!pixelDocument.history.canUndo" @click="pixelDocument.undo()">
      <i class="bx bx-undo"></i>
    </ToolButton>
    <ToolButton id="redo" :disabled="!pixelDocument.history.canRedo" @click="pixelDocument.redo()">
      <i class="bx bx-redo"></i>
    </ToolButton>
  </Tools>
</template>

<script setup>
import Tool from '../../enums/Tool'
import Tools from '../Tools.vue'
import ToolToggle from '../ToolToggle.vue'
import ToolButton from '../ToolButton.vue'
import ToolColor from '../ToolColor.vue'
import ToolSymmetry from '../ToolSymmetry.vue'
import ColorPicker from '../ColorPicker.vue'
import SymmetrySettings from '../SymmetrySettings.vue'
import { useDocumentStore } from '../../stores/PixelDocument'

const pixelDocument = useDocumentStore()
</script>
