<template>
  <div class="position">
    <i class="bx bxs-shape-square"></i>
    {{ position.join(',') }}
  </div>
  <div class="size">
    <i class="bx bxs-shape-square"></i>
    {{ size.join('x') }}
  </div>
  <div class="rotation">
    <i class="bx bxs-shape-square"></i>
    {{ rotation }}º
  </div>
</template>

<script setup>

const position = [0, 0]
const size = [120, 100]
const rotation = 0
</script>

<style scoped>
.tool-settings-transform {
  display: flex;
  gap: 1rem;
}
</style>

