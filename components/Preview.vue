<template>
  <section
    ref="preview"
    class="Preview"
  >
    <!-- inyectamos el canvas -->
  </section>
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'

const document = useDocumentStore()

const preview = ref()

onMounted(() => preview.value.appendChild(document.previewCanvas))
</script>
