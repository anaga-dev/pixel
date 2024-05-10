<template>
  <div class="Spinner">
    <div class="pixel"></div>
    <div class="pixel"></div>
    <div class="pixel"></div>
  </div>
</template>

<style scoped>
.Spinner {
  display: grid;
  grid-auto-flow: column;
  place-content: center;
  gap: 0.25rem;
  position: absolute;
  inset: 0;
}

.pixel {
  background-color: currentColor;
  width: 0.25rem;
  height: 0.25rem;
  animation: bounce 800ms infinite linear;
}

.pixel:nth-child(2) {
  animation-delay: 200ms;
}

.pixel:nth-child(3) {
  animation-delay: 400ms;
}

@keyframes bounce {
  0%, 100% {
    translate: 0 0;
  }
  33% {
    translate : 0 -0.25rem;
  }
  67% {
    translate: 0 0.25rem;
  }
}
</style>