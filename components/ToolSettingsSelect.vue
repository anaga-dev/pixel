<template>
  <ToolButton
    label="Freehand selection"
    :active="documentStore.selection.type === SelectType.FREEHAND"
    @click="documentStore.setSelectType(SelectType.FREEHAND)"
  >
    <Icon i="freehand" />
    {{ $t('studio.freehand') }}
  </ToolButton>
  <ToolButton
    label="Rectangular selection"
    :active="documentStore.selection.type === SelectType.RECTANGLE"
    @click="documentStore.setSelectType(SelectType.RECTANGLE)"
  >
    <Icon i="selection" />
    Rectangular
  </ToolButton>
  <ToolButton
    label="Elliptical selection"
    :active="documentStore.selection.type === SelectType.ELLIPSE"
    @click="documentStore.setSelectType(SelectType.ELLIPSE)"
  >
    <Icon i="selection" />
    Ellipse
  </ToolButton>
  <ToolButton
    label="Color selection"
    :active="documentStore.selection.type === SelectType.COLOR"
    @click="documentStore.setSelectType(SelectType.COLOR)"
  >
    <Icon i="color" />
    Color
  </ToolButton>
  <ToolButton
    v-if="documentStore.selection.type === SelectType.COLOR"
    label="Contiguous color"
    :active="documentStore.selection.contiguous"
    @click="documentStore.toggleSelectContiguous()"
  >
    <Icon i="droplet" />
    Contiguous
  </ToolButton>
  <Divider vertical />
  <ToolButton
    label="Add to selection"
    :active="documentStore.selection.mode === SelectMode.ADD"
    @click="documentStore.setSelectMode(SelectMode.ADD)"
  >
    <Icon i="selection-add" />
    Add
  </ToolButton>
  <ToolButton
    label="Substract from selection"
    :active="documentStore.selection.mode === SelectMode.SUBTRACT"
    @click="documentStore.setSelectMode(SelectMode.SUBTRACT)"
  >
    <Icon i="selection-substract" />
    Subtract
  </ToolButton>
</template>

<script setup>
import { SelectType } from '@/pixel/enums/SelectType'
import { SelectMode } from '@/pixel/enums/SelectMode'
import { useDocumentStore } from '@/stores/document'

const documentStore = useDocumentStore()
</script>
