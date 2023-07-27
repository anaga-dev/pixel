<template>
  <div class="Divider" :class="{ vertical: vertical }"></div>
</template>

<script setup>
const props = defineProps({
  vertical: {
    type: Boolean
  }
})
</script>

<style scoped>
.Divider {
  width: 100%;
  height: var(--spaceXXS);
  background: var(--colorShade);
}

.Divider.vertical {
  height: 100%;
  width: var(--spaceXXS);
  background: var(--colorShade);
}
</style>