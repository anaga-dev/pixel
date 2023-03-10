<template>
  <div class="brush-selector">
    <button type="button" class="pill brush-type" @click="$emit('select', 'round')">
      <svg width="8" height="8" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="8" fill="#fff"></circle>
      </svg>
      Round
    </button>
    <button type="button" class="pill brush-type" @click="$emit('select', 'square')">
      <svg width="8" height="8" viewBox="0 0 16 16">
        <rect x="0" cy="0" width="16" height="16" fill="#fff"></rect>
      </svg>
      Square
    </button>
    <button type="button" class="pill brush-type" @click="$emit('select', 'dither')">
      <svg width="8" height="8" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="8" stroke="#fff"></circle>
      </svg>
      Dither
    </button>
  </div>
</template>

<style scoped>
.brush-selector {
  position: fixed;
  top: 4rem;
  min-width: 16rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #2b2b2f;
  border-radius: 0.5rem;
  box-shadow:
    0 0 1px rgba(0, 0, 0, 0.1),
    0 0 2px rgba(0, 0, 0, 0.1),
    0 0 4px rgba(0, 0, 0, 0.1),
    0 0 8px rgba(0, 0, 0, 0.1),
    0 0 16px rgba(0, 0, 0, 0.1),
    0 0 32px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
</style>
