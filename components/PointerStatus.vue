<template>
  <section v-if="document.pointer" class="PointerStatus">
    {{ document.pointer.offset.x.toFixed(0) }}, {{ document.pointer.offset.y.toFixed(0) }}
  </section>
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'

const document = useDocumentStore()
</script>
