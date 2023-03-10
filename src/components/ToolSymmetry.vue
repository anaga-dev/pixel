<template>
  <div class="tool" :class="{ active: document.symmetry.enabled }">
    <i class="bx bx-collapse-horizontal" v-if="document.symmetry.axis === 'horizontal'"></i>
    <i class="bx bx-collapse-vertical" v-else-if="document.symmetry.axis === 'vertical'"></i>
    <i class="bx bx-collapse-alt" v-else-if="document.symmetry.axis === 'both'"></i>
  </div>
</template>

<script setup>
import { useDocumentStore } from '../stores/PixelDocument'

const document = useDocumentStore()
</script>
