<template>
  <section class="Settings">
    <div class="group">
      <SettingsButton />
      <Divider vertical />
      <ToolSettings :tool="documentStore.tool" />
    </div>
    <div class="group">
      <Tooltip :message="$t('studio.tooltips.deselect')" position="bottom">
        <Button
          variant="ghost"
          :label="$t('studio.deselect')"
          :disabled="!documentStore.selection.visible"
          @click="documentStore.deselect()"
        >
          <Icon i="deselect" />
        </Button>
      </Tooltip>
      <Divider vertical />
      <Tooltip :message="$t('studio.tooltips.symmetry')" position="left bottom">
        <Button
          :label="$t('studio.symmetry-aid')"
          variant="dropdown"
          :active="documentStore.symmetry.axis !== null"
          @click="toggleOverlay('symmetry-settings')"
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
      </Tooltip>
      <Tooltip :message="$t('studio.tooltips.zoom')" position="left bottom">
        <Zoom />
      </Tooltip>
      <Divider vertical />
      <Tooltip :message="$t(sidePanelMessage)" position="left bottom">
        <Button
          variant="ghost"
          @click="togglePanel"
        >
          <Icon :i="icon" />
        </Button>
      </Tooltip>
    </div>
  </section>
</template>

<script setup>
import { useDocumentStore } from '@/stores/document'
import { useUIStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'

const documentStore = useDocumentStore()
const uiStore = useUIStore()

const { showPanel } = storeToRefs(uiStore)
const { togglePanel, toggleOverlay } = uiStore

const icon = computed(() => {
  return showPanel.value ? 'collapse-side-panel' : 'expand-side-panel'
})

const sidePanelMessage = computed(() => {
  return showPanel.value ? 'studio.tooltips.collapse-side-panel' : 'studio.tooltips.expand-side-panel'
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
  padding: var(--spaceS);
}

.group {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  gap: var(--spaceS);
}

.group > *:last-child {
  margin-right: 0;
}

.group:first-child {
  justify-content: start;
}

.group:last-child {
  justify-content: end;
}
</style>
