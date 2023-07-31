<template>
    <ToolButton
      label="Freehand selection"
      :active="documentStore.select.type === 'freehand'"
      @click="documentStore.setSelectType('freehand')">
      <Icon i="freehand" />
      Freehand
    </ToolButton>
    <ToolButton
      label="Rectangular selection"
      :active="documentStore.select.type === 'rectangular'"
      @click="documentStore.setSelectType('rectangular')">
      <Icon i="selection" />
      Rectangular
    </ToolButton>
    <ToolButton
      label="Color selection"
      :active="documentStore.select.type === 'color'"
      @click="documentStore.setSelectType('color')">
      <Icon i="color" />
      Color
    </ToolButton>
    <ToolButton
      v-if="documentStore.select.type === 'color'"
      label="Contiguous color"
      :active="documentStore.select.contiguous"
      @click="documentStore.toggleSelectContiguous()">
      <Icon i="droplet" />
      Contiguous
    </ToolButton>
    <Divider vertical />
    <ToolButton
      label="Add to selection"
      :active="documentStore.select.mode === 'add'"
      @click="documentStore.setSelectMode('add')">
      <Icon i="selection-add" />
      Add
    </ToolButton>
    <ToolButton
      label="Substract from selection"
      :active="documentStore.select.mode === 'subtract'"
      @click="documentStore.setSelectMode('subtract')">
      <Icon i="selection-substract" />
      Subtract
    </ToolButton>
    <Divider vertical />
    <Button
      variant="ghost"
      label="Deselect"
      @click="documentStore.setSelectMode('transform')">
      <Icon i="deselect" />
    </Button>
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'

const documentStore = useDocumentStore()
</script>
