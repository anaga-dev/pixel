<template>
  <div class="tool color" :style="{ backgroundColor: color }"></div>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  color: {
    type: String,
    required: true
  }
})

const active = ref(false)

function onToggle() {
  active.value = !active.value
}
</script>

<style scoped>
.tool {
  width: 1rem;
  height: 1rem;
  border-radius: 100px;
  border: 1px solid #fff;
}
</style>
