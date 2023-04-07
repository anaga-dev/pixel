<template>
    <ToolButton
      label="Freehand selection"
      :active="document.select.type === 'freehand'"
      @click="document.setSelectType('freehand')">
      <Icon i="freehand" />
      Freehand
    </ToolButton>
    <ToolButton
      label="Rectangular selection"
      :active="document.select.type === 'rectangular'"
      @click="document.setSelectType('rectangular')">
      <Icon i="selection" />
      Rectangular
    </ToolButton>
    <ToolButton
      label="Color selection"
      :active="document.select.type === 'color'"
      @click="document.setSelectType('color')">
      <Icon i="color" />
      Color
    </ToolButton>
    <ToolButton
      v-if="document.select.type === 'color'"
      label="Contiguous color"
      :active="document.select.contiguous"
      @click="document.toggleSelectContiguous()">
      <Icon i="droplet" />
      Contiguous
    </ToolButton>
    <Divider vertical />
    <ToolButton
      label="Add to selection"
      :active="document.select.mode === 'add'"
      @click="document.setSelectMode('add')">
      <Icon i="selection-add" />
      Add
    </ToolButton>
    <ToolButton
      label="Substract from selection"
      :active="document.select.mode === 'subtract'"
      @click="document.setSelectMode('subtract')">
      <Icon i="selection-substract" />
      Subtract
    </ToolButton>
    <Divider vertical />
    <ToolButton
      label="Transform selection"
      :active="document.select.mode === 'transform'"
      @click="document.setSelectMode('transform')">
      <Icon i="transform" />
      Transform
    </ToolButton>
</template>

<script setup>
import { useDocumentStore } from '../stores/PixelDocument'
import ToolButton from '@/components/ToolButton.vue'
import Divider from '@/components/Divider.vue'
import Icon from '@/components/Icon.vue'

const document = useDocumentStore()
</script>
