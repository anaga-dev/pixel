<template>
  <Overlay />
  <div class="wrapper">
    <section class="Splash">
      <h1>Pixelat</h1>
    </section>
  </div>
</template>

<style scoped>
.wrapper {
  position: fixed;
  inset: 0;
  display: grid;
  place-content: center;
  z-index: 1000;
}
.Splash {
  width: 33vw;
  aspect-ratio: 4 / 3;
  display: grid;
  grid-auto-flow: row;
  justify-content: stretch;
  gap: var(--spaceM);
  padding: var(--spaceL) var(--spaceXL);
  background-color: var(--colorAccent);
  box-shadow: var(--shadowLayer);
  z-index: 1002;
}

h1 {
  color: var(--colorLayer0);
  line-height: 1;
  font-size: 6vw;
}
</style>