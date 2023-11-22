<template>
  <Dropdown class="SymmetrySettings" @close="toggleOverlay('symmetry-settings')">
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
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'

const documentStore = useDocumentStore()
const uiStore = useUIStore()

const { toggleOverlay } = uiStore

const axis = ref(documentStore.symmetry.axis)

function onClick(axis) {
  documentStore.setSymmetrySettings(axis)
  toggleOverlay('symmetry-settings')
}
</script>

<style scoped>
.SymmetrySettings {
  right: calc(var(--widthToolbar) + var(--spaceS));
  bottom: 9rem;
}
</style>
