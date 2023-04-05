<template>
  <section class="SettingsBar">
    <div class="left">
      <slot name="left" />
    </div>
    <div class="right">
      <slot name="right" />
    </div>
  </section>
</template>

<style scoped>
.SettingsBar {
  height: 100%;
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spaceM);
}

div {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: var(--spaceM);
}

.right {
  justify-content: end;
}
</style>