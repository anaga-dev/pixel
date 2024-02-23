<template>
  <ToolButton
    tooltip-text="studio.tooltips.freehand-selection"
    label="studio.freehand"
    icon="freehand"
    :active="documentStore.selection.type === SelectType.FREEHAND"
    @click="documentStore.setSelectType(SelectType.FREEHAND)"
  />
  <ToolButton
    tooltip-text="studio.tooltips.rectangle-selection"
    label="studio.rectangle"
    icon="selection"
    :active="documentStore.selection.type === SelectType.RECTANGLE"
    @click="documentStore.setSelectType(SelectType.RECTANGLE)"
  />
  <ToolButton
    tooltip-text="studio.tooltips.ellipse-selection"
    label="studio.ellipse"
    icon="selection-ellipse"
    :active="documentStore.selection.type === SelectType.ELLIPSE"
    @click="documentStore.setSelectType(SelectType.ELLIPSE)"
  />
  <ToolButton
    tooltip-text="studio.tooltips.color-selection"
    label="studio.color"
    icon="palette"
    :active="documentStore.selection.type === SelectType.COLOR"
    @click="documentStore.setSelectType(SelectType.COLOR)"
  />
  <ToolButton
    v-if="documentStore.selection.type === SelectType.COLOR"
    tooltip-text="studio.tooltips.contiguous"
    label="studio.contiguous"
    icon="contiguous"
    :active="documentStore.selection.contiguous"
    @click="documentStore.toggleSelectContiguous()"
  />
  <Divider
    vertical
    transparent
  />
  <ToolButton
    tooltip-text="studio.tooltips.add-to-selection"
    label="studio.add-to-selection"
    icon="selection-add"
    :active="documentStore.selection.mode === SelectMode.ADD"
    @click="documentStore.setSelectMode(SelectMode.ADD)"
  />
  <ToolButton
    tooltip-text="studio.tooltips.subtract-from-selection"
    label="studio.subtract-from-selection"
    icon="selection-substract"
    :active="documentStore.selection.mode === SelectMode.SUBTRACT"
    @click="documentStore.setSelectMode(SelectMode.SUBTRACT)"
  />
</template>

<script setup>
import { SelectType } from '@/pixel/enums/SelectType'
import { SelectMode } from '@/pixel/enums/SelectMode'
import { useDocumentStore } from '@/stores/document'

const documentStore = useDocumentStore()
</script>
