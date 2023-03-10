<template>
  <div class="modal">
    <div class="header">
      <div class="title">{{ title }}</div>
      <button type="button" class="close">
        <i class="bx bxs-message-square-x"></i>
      </button>
    </div>
    <div class="body">
      <slot></slot>
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.modal {
  min-width: 10vw;
  min-height: 10vh;
  background: #2b2b2f;
  border-radius: 0.25rem;
  box-shadow:
    0 0 1px rgba(0, 0, 0, 0.1),
    0 0 2px rgba(0, 0, 0, 0.1),
    0 0 4px rgba(0, 0, 0, 0.1),
    0 0 8px rgba(0, 0, 0, 0.1),
    0 0 16px rgba(0, 0, 0, 0.1),
    0 0 32px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  text-transform: uppercase;
}

.header, .body, .footer {
  padding: 1rem;
}
</style>
