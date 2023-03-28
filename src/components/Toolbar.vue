<template>
  <div class="Toolbar">
    <div class="group">
      <slot name="top"></slot>
    </div>
    <Divider />
    <div class="group">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script setup>
import Divider from '@components/Divider.vue'
</script>

<style scoped>
.Toolbar {
  width: 100%;
  display: grid;
  grid-auto-flow: row;
  place-content: center;
  gap: var(--spaceM);
  padding: var(--spaceL) 0;
  background-color: var(--colorLayer1);
  box-shadow: var(--shadowLayer);
}

.group {
  display: grid;
  grid-auto-flow: row;
  justify-items: center;
  gap: var(--spaceM);
}

.group:first-child {
  align-content: start;
}

.group:last-child {
  align-content: end;
}
</style>
