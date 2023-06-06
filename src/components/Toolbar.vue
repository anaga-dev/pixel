<template>
  <div class="Toolbar">
    <div class="group">
      <slot name="top"></slot>
    </div>
    <div class="group">
      <slot name="center"></slot>
    </div>
    <div class="group">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<style scoped>
.Toolbar {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 3fr 1fr;
  justify-content: center;
  gap: var(--spaceM);
  padding: var(--spaceM) 0;
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

.group:nth-child(2) {
  align-content: center;
}

.group:last-child {
  align-content: end;
}
</style>
