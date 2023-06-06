<template>
  <Dropdown class="SymmetrySettings" @close="uiStore.toggleOverlay('symmetry-settings')">
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
import { useDocumentStore } from '@/stores/DocumentStore'
import { useUIStore } from '@/stores/UIStore'
import Button from '@/components/Button.vue'
import Dropdown from '@/components/Dropdown.vue'
import Icon from '@/components/Icon.vue'

const documentStore = useDocumentStore()
const uiStore = useUIStore()

const axis = ref(documentStore.symmetry.axis)

function onClick(axis) {
  documentStore.setSymmetrySettings(axis)
  uiStore.toggleOverlay('symmetry-settings')
}
</script>

<style scoped>
.SymmetrySettings {
  top: calc(var(--widthToolbar) + var(--spaceS));
  right: 9rem;
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
