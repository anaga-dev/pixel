<template>
  <div class="panel">
    <div class="header">
      <div class="title">{{ title }}</div>
      <div class="actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="content" :class="{ scrollable }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  scrollable: {
    type: Boolean,
    default: true,
    required: false
  }
})
</script>

<style scoped>
.panel {
  border-bottom: 1px solid #111;
}

.header {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #111;
  justify-content: space-between;
  align-items: center;
}

.title {
  text-transform: uppercase;
}

.content {
  overflow: hidden;
  max-height: 25vh;
}

.scrollable {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
