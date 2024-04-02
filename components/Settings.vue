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

<template>
  <section class="Settings">
    <ToolSettings :tool="documentStore.tool" />
    <Divider v-if="documentStore.selection.visible" vertical transparent />
    <Tooltip v-if="documentStore.selection.visible" message="studio.tooltips.deselect" position="bottom">
        <Button
          variant="setting"
          :label="$t('studio.deselect')"
          @click="documentStore.deselect()"
        >
          <Icon i="deselect" />
        </Button>
      </Tooltip>
  </section>
</template>

<style scoped>
.Settings {
  height: 100%;
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  gap: var(--spaceS);
  padding: var(--spaceS);
  overflow-x: auto;
  scrollbar-width: none;
}

.Settings::-webkit-scrollbar {
  display: none;
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
