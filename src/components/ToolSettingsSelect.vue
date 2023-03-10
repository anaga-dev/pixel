<template>
  <div class="tool-settings-select">
    <button class="pill" type="button" id="freehand" :class="{ active: document.select.type === 'freehand' }" @click="document.setSelectType('freehand')">
      <i class="bx bx-shape-square"></i>
      Freehand
    </button>
    <button class="pill" type="button" id="rectangular" :class="{ active: document.select.type === 'rectangular' }"  @click="document.setSelectType('rectangular')">
      <i class="bx bx-shape-square"></i>
      Rectangular
    </button>
    <button class="pill" type="button" id="color" :class="{ active: document.select.type === 'color' }"  @click="document.setSelectType('color')">
      <i class="bx bx-shape-square"></i>
      Color
    </button>
    <button v-if="document.select.type === 'color'" class="pill" type="button" id="fill" :class="{ active: document.select.contiguous }"  @click="document.toggleSelectContiguous()">
      <i class="bx bxs-droplet"></i>
      Contiguous
    </button>
    <button class="pill" type="button" id="add" :class="{ active: document.select.mode === 'add' }"  @click="document.setSelectMode('add')">
      <i class="bx bxs-lock-alt"></i>
      Add
    </button>
    <button class="pill" type="button" id="subtract" :class="{ active: document.select.mode === 'subtract' }"  @click="document.setSelectMode('subtract')">
      <i class="bx bxs-lock-alt"></i>
      Subtract
    </button>
    <button class="pill" type="button" id="transform" :class="{ active: document.select.mode === 'transform' }"  @click="document.setSelectMode('transform')">
      <i class="bx bxs-lock-alt"></i>
      Transform
    </button>
  </div>
</template>

<script setup>
import { useDocumentStore } from '../stores/PixelDocument'

const document = useDocumentStore()
</script>
