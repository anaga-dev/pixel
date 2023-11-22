<template>
  <div class="Divider" :class="{ vertical: vertical, transparent: transparent }"></div>
</template>

<script setup>
const props = defineProps({
  vertical: {
    type: Boolean
  },
  transparent: {
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

.Divider.transparent {
  background: transparent;
}
</style>