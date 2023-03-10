<template>
  <a :href="url" :download="filename">
    <i class="bx bx-download"></i>
  </a>
</template>

<script setup>
const props = defineProps({
  url: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  }
})
</script>
