<template>
  <ToolButton
    tooltipText="studio.tooltips.freehand-selection"
    label="studio.freehand"
    icon="freehand"
    :active="documentStore.selection.type === SelectType.FREEHAND"
    @click="documentStore.setSelectType(SelectType.FREEHAND)"
  />
  <ToolButton
    tooltipText="studio.tooltips.rectangle-selection"
    label="studio.rectangle"
    icon="selection"
    :active="documentStore.selection.type === SelectType.RECTANGLE"
    @click="documentStore.setSelectType(SelectType.RECTANGLE)"
  />
  <ToolButton
    tooltipText="studio.tooltips.ellipse-selection"
    label="studio.ellipse"
    icon="selection-ellipse"
    :active="documentStore.selection.type === SelectType.ELLIPSE"
    @click="documentStore.setSelectType(SelectType.ELLIPSE)"
  />
  <ToolButton
    tooltipText="studio.tooltips.color-selection"
    label="studio.color"
    icon="color"
    :active="documentStore.selection.type === SelectType.COLOR"
    @click="documentStore.setSelectType(SelectType.COLOR)"
  />
  <ToolButton
    v-if="documentStore.selection.type === SelectType.COLOR"
    tooltipText="studio.tooltips.contiguous"
    label="studio.contiguous"
    icon="droplet"
    :active="documentStore.selection.contiguous"
    @click="documentStore.toggleSelectContiguous()"
  />
  <Divider vertical />
  <ToolButton
    tooltipText="studio.tooltips.add-to-selection"
    label="studio.add-to-selection"
    icon="selection-add"
    :active="documentStore.selection.mode === SelectMode.ADD"
    @click="documentStore.setSelectMode(SelectMode.ADD)"
  />
  <ToolButton
    tooltipText="studio.tooltips.subtract-from-selection"
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
