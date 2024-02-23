<template>
  <Dropdown
    class="SymmetrySettings"
    @close="toggleOverlay('symmetry-settings')"
  >
    <h3>{{ $t('studio.symmetry.title') }}</h3>
    <Button
      label="Horizontal symmetry"
      :active="axis === 'horizontal'"
      @click="onClick('horizontal')"
    >
      <Icon i="symmetry-horizontal" />
      {{ $t('studio.symmetry.horizontal') }}
    </Button>
    <Button
      label="Vertical symmetry"
      :active="axis === 'vertical'"
      @click="onClick('vertical')"
    >
      <Icon i="symmetry-vertical" />
      {{ $t('studio.symmetry.vertical') }}
    </Button>
    <Button
      label="Two axis symmetry"
      :active="axis === 'both'"
      @click="onClick('both')"
    >
      <Icon i="symmetry-two-axis" />
      {{ $t('studio.symmetry.both') }}
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
