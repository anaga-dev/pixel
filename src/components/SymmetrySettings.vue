<template>
  <Dropdown class="SymmetrySettings" @close="document.toggleSymmetrySettings">
    <Button label="Horizontal symmetry" :active="axis === 'horizontal'" @click="onClick('horizontal')">
      <Icon i="symmetry-horizontal" /> Horizontal
    </Button>
    <Button label="Vertical symmetry" :active="axis === 'vertical'" @click="onClick('vertical')">
      <Icon i="symmetry-vertical" /> Vertical
    </Button>
    <Button label="Two axis symmetry" :active="axis === 'both'" @click="onClick('both')">
      <Icon i="symmetry-two-axis" /> Both
    </Button>
  </Dropdown>
</template>

<script setup>
import { ref } from 'vue'
import { useDocumentStore } from '../stores/PixelDocument'
import Button from '@/components/Button.vue'
import Dropdown from '@/components/Dropdown.vue'
import Icon from '@/components/Icon.vue'

const document = useDocumentStore()

const axis = ref(document.symmetry.axis)

function onClick(axis) {
  document.setSymmetrySettings(axis)
}
</script>

<style scoped>
.SymmetrySettings {
  top: var(--widthToolbar);
  right: var(--widthPanels);
}

.enabled {
  display: flex;
  gap: 0.5rem;
}

.axis {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 1rem;
}
</style>
