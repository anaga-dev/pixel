<template>
    <ToolButton :class="{ active: document.select.type === 'freehand' }" @click="document.setSelectType('freehand')">
      <Icon i="freehand" />
      Freehand
    </ToolButton>
    <ToolButton :class="{ active: document.select.type === 'rectangular' }"  @click="document.setSelectType('rectangular')">
      <Icon i="selection" />
      Rectangular
    </ToolButton>
    <ToolButton :class="{ active: document.select.type === 'color' }"  @click="document.setSelectType('color')">
      <Icon i="color" />
      Color
    </ToolButton>
    <Divider vertical />
    <ToolButton v-if="document.select.type === 'color'" :class="{ active: document.select.contiguous }"  @click="document.toggleSelectContiguous()">
      <Icon i="droplet" />
      Contiguous
    </ToolButton>
    <ToolButton :class="{ active: document.select.mode === 'add' }"  @click="document.setSelectMode('add')">
      <Icon i="selection-add" />
      Add
    </ToolButton>
    <ToolButton :class="{ active: document.select.mode === 'subtract' }"  @click="document.setSelectMode('subtract')">
      <Icon i="selection-substract" />
      Subtract
    </ToolButton>
    <ToolButton :class="{ active: document.select.mode === 'transform' }"  @click="document.setSelectMode('transform')">
      <Icon i="selection-transform" />
      Transform
    </ToolButton>
</template>

<script setup>
import { useDocumentStore } from '../stores/PixelDocument'
import ToolButton from '@components/ToolButton.vue'
import Divider from '@components/Divider.vue'
import Icon from '@components/Icon.vue'

const document = useDocumentStore()
</script>
