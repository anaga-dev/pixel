<template>
  <section class="Preview" ref="preview">
    <!-- inyectamos el canvas -->
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDocumentStore } from '../stores/PixelDocument'

const document = useDocumentStore()

const preview = ref()

onMounted(() => preview.value.appendChild(document.previewCanvas))
</script>

<style scoped>
.Preview {
  padding: 0 var(--spaceM);
}
</style>