<template>
  <Dropdown class="BrushDither">
    <Button v-for="dither of patterns" label="Dither" @click="$emit('select', dither)">
      <Icon :i="`dither-${dither}`" />
    </Button>
  </Dropdown>
</template>

<script setup>
import { readonly } from 'vue'
import Button from '@/components/Button.vue'
import Dropdown from '@/components/Dropdown.vue'
import Icon from '@/components/Icon.vue'

const patterns = readonly(Array.of(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15))
</script>

<style scoped>
.BrushDither {
  top: calc(var(--widthToolbar) + var(--spaceS));
}
</style>
