<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="ButtonSelect">
    <button
      v-for="item of props.data"
      :key="item.value"
      :class="{ selected: props.modelValue === item.value }"
      @click.stop="emit('update:modelValue', item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<style scoped>
.ButtonSelect {
  display: flex;
  flex-direction: row;
  gap: 2px;
}
button {
  flex: 1;
  padding: var(--spaceM);
  text-transform: uppercase;
  background-color: var(--colorShade);
}

.selected {
  background-color: var(--colorAccent);
  color: var(--colorLayer0);
}
</style>
