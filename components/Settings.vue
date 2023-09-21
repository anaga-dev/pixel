<template>
  <section class="Settings">
    <div class="group">
      <SettingsButton />
      <Divider vertical />
      <ToolSettings :tool="documentStore.tool" />
    </div>
    <div class="group">
      <Button
        variant="ghost"
        label="Deselect"
        :disabled="!documentStore.selection.visible"
        @click="documentStore.deselect()"
      >
        <Icon i="deselect" />
      </Button>
      <Divider vertical />
      <Button
        label="Symmetry aid"
        variant="dropdown"
        :active="documentStore.symmetry.axis !== null"
        @click="uiStore.toggleOverlay('symmetry-settings')"
      >
        <Icon
          i="symmetry-vertical"
          v-if="documentStore.symmetry.axis === 'vertical'"
        />
        <Icon
          i="symmetry-two-axis"
          v-else-if="documentStore.symmetry.axis === 'both'"
        />
        <Icon i="symmetry-horizontal" v-else />
      </Button>
      <Zoom />
      <Divider vertical />
      <ToolColor
        :color="documentStore.color"
        :active="uiStore.isShowingColorPanel"
        @click="handleColorPanel"
      />
      <Button
        variant="ghost"
        :active="uiStore.isShowingLayersPanel"
        @click="uiStore.togglePanel"
      >
        <Icon :i="icon" />
      </Button>
    </div>
  </section>
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'

const documentStore = useDocumentStore()
const uiStore = useUIStore()

const handleColorPanel = () => {
  uiStore.showColorPicker = true
  uiStore.showPanel = true
}

const icon = computed(() => {
  return uiStore.isShowingPanel ? 'collapse-side-panel' : 'expand-side-panel'
})
</script>

<style scoped>
.Settings {
  height: 100%;
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  gap: var(--spaceS);
  padding: 0 var(--spaceM);
}

.group {
  display: grid;
  grid-auto-flow: column;
  gap: var(--spaceM);
  align-items: center;
}

.group:first-child {
  justify-content: start;
}

.group:last-child {
  justify-content: end;
}
</style>
