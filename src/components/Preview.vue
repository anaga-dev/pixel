<template>
  <div class="preview" ref="preview">
    <!-- inyectamos el canvas -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDocumentStore } from '../stores/PixelDocument'

const document = useDocumentStore()

const preview = ref()

onMounted(() => preview.value.appendChild(document.previewCanvas))
</script>
