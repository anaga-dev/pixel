<template>
  <Button
    label="Settings menu"
    variant="ghost"
    @click.stop="uiStore.toggleOverlay(overlay)"
  >
    <Icon i="menu" />
  </Button>
  <Dropdown
    v-if="uiStore.showOverlay === overlay"
    class="menu"
    @close="uiStore.toggleOverlay(overlay)"
  >
    <Button @click="newFile">
      {{ $t('studio.new-artwork') }}
    </Button>
    <Button @click="openFile">
      {{ $t('studio.open-artwork') }}
    </Button>
    <Button @click="saveFile">
      {{ $t('studio.save-artwork') }}
    </Button>
    <Button @click="saveFile">
      {{ $t('studio.export-artwork') }}
    </Button>
  </Dropdown>
</template>

<script setup>
import { useUIStore } from '@/stores/ui'
import { useDocumentStore } from '@/stores/document'
import { useConfirmationStore } from '@/stores/confirmation'

const overlay = 'general-settings'

const uiStore = useUIStore()
const documentStore = useDocumentStore()
const confirmationStore = useConfirmationStore()

async function newFile(params) {
  if (documentStore.modified) {
    const confirmation = await confirmationStore.open(
      "You will lose any changes you haven't saved. Are you sure?"
    )
    if (confirmation) {
      documentStore.newFile()
      uiStore.showOverlay = null
    }
  } else {
    documentStore.newFile()
    uiStore.showOverlay = null
  }
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
  left: var(--spaceS);
  top: calc(var(--widthToolbar) + var(--spaceS));
}
</style>
