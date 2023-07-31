<template>
  <Button label="Settings menu" variant="ghost" @click.stop="uiStore.toggleOverlay(overlay)">
    <Icon i="menu" />
  </Button>
  <Dropdown v-if="uiStore.showOverlay === overlay" class="menu" @close="uiStore.toggleOverlay(overlay)">
    <Button label="New file" @click="newFile">New file</Button>
    <Button label="Open file" @click="openFile">Open file</Button>
    <Button label="Save file" @click="saveFile">Save file</Button>
  </Dropdown>
</template>

<script setup>
import { useUIStore } from '@/stores/ui'
import { useDocumentStore } from '@/stores/document'

const overlay = 'general-settings'

const uiStore = useUIStore()
const documentStore = useDocumentStore()

function newFile(params) {
  documentStore.newFile()
  uiStore.showOverlay = null
}

function openFile() {
  documentStore.openFile()
  uiStore.showOverlay = null
}

function saveFile() {
  documentStore.saveFileAs()
  uiStore.showOverlay = null
}

</script>

<style scoped>
.menu {
  left: calc(var(--widthToolbar) + var(--spaceS));
  top: calc(var(--widthToolbar) + var(--spaceS));
}
</style>
