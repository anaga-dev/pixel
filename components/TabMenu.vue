<template>
  <ul class="TabMenu">
    <slot></slot>
  </ul>
</template>

<style scoped>
.TabMenu {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
}
</style>