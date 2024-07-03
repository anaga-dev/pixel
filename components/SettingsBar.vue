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
  padding: 0 var(--space-m);
}

div {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: var(--space-m);
}

.right {
  justify-content: end;
}
</style>