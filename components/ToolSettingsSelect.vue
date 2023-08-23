<template>
    <ToolButton
      label="Freehand selection"
      :active="documentStore.selection.type === SelectType.FREEHAND"
      @click="documentStore.setSelectType(SelectType.FREEHAND)">
      <Icon i="freehand" />
      Freehand
    </ToolButton>
    <ToolButton
      label="Rectangular selection"
      :active="documentStore.selection.type === SelectType.RECTANGULAR"
      @click="documentStore.setSelectType(SelectType.RECTANGULAR)">
      <Icon i="selection" />
      Rectangular
    </ToolButton>
    <ToolButton
      label="Color selection"
      :active="documentStore.selection.type === SelectType.COLOR"
      @click="documentStore.setSelectType(SelectType.COLOR)">
      <Icon i="color" />
      Color
    </ToolButton>
    <ToolButton
      v-if="documentStore.selection.type === SelectType.COLOR"
      label="Contiguous color"
      :active="documentStore.selection.contiguous"
      @click="documentStore.toggleSelectContiguous()">
      <Icon i="droplet" />
      Contiguous
    </ToolButton>
    <Divider vertical />
    <ToolButton
      label="Add to selection"
      :active="documentStore.selection.mode === SelectMode.ADD"
      @click="documentStore.setSelectMode(SelectMode.ADD)">
      <Icon i="selection-add" />
      Add
    </ToolButton>
    <ToolButton
      label="Substract from selection"
      :active="documentStore.selection.mode === SelectMode.SUBTRACT"
      @click="documentStore.setSelectMode(SelectMode.SUBTRACT)">
      <Icon i="selection-substract" />
      Subtract
    </ToolButton>
    <Divider vertical />
    <Button
      variant="ghost"
      label="Deselect"
      @click="documentStore.deselect()">
      <Icon i="deselect" />
    </Button>
</template>

<script setup>
import { SelectType } from '@/pixel/enums/SelectType'
import { SelectMode } from '@/pixel/enums/SelectMode'
import { useDocumentStore } from '@/stores/document'

const documentStore = useDocumentStore()
</script>
