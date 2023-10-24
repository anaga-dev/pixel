<template>
  <ToolButton :active="document.dropper.selectCompositeColor" @click="document.toggleDropperCompositeColor()">
    <Icon i="composite" />
    {{ $t('studio.composite') }}
  </ToolButton>
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'

const document = useDocumentStore()
</script>
