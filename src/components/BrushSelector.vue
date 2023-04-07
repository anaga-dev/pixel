<template>
  <Dropdown class="BrushSelector">
    <Button label="Round brush" @click="$emit('select', 'round')">
      <Icon i="brush-round" />
      Round
    </Button>
    <Button label="Square brush" @click="$emit('select', 'square')">
      <Icon i="brush-square" />
      Square
    </Button>
    <Button label="Dither brush" @click="$emit('select', 'dither')">
      <Icon i="brush-dither" />
      Dither
    </Button>
  </Dropdown>
</template>

<script setup>
import Button from '@/components/Button.vue'
import Dropdown from '@/components/Dropdown.vue'
import Icon from '@/components/Icon.vue'
</script>

<style scoped>
.BrushSelector {
  top: calc(var(--widthToolbar) + var(--spaceS));
}
</style>
