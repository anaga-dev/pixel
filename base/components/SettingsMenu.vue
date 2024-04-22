<script setup>
import { useUIStore } from '@/stores/ui'
import { useDocumentStore } from '@/stores/document'
import { useConfirmationStore } from '@/stores/confirmation'

const overlay = 'general-settings'

const uiStore = useUIStore()

const documentStore = useDocumentStore()
const confirmationStore = useConfirmationStore()

async function newFile() {
  uiStore.closeOverlay()
  if (documentStore.modified) {
    const confirmation = await confirmationStore.openDialog(
      'studio.new-artwork-confirmation'
    )
    if (confirmation) {
      documentStore.newFile()
      uiStore.showDocumentCreation = true
    }
  }
}

function openFile() {
  documentStore.openFile()
  uiStore.closeOverlay()
}

function saveFile() {
  documentStore.saveFileAs()
  uiStore.closeOverlay()
}

function exportFile() {
  uiStore.showExportMenu()
  uiStore.closeOverlay()
}
</script>

<template>
  <Dropdown @close="uiStore.closeOverlay">
    <Button @click="newFile">
      {{ $t('new-artwork') }}
    </Button>
    <Button @click="openFile">
      {{ $t('open-artwork') }}
    </Button>
    <Button @click="saveFile">
      {{ $t('save-artwork') }}
    </Button>
    <Button @click="exportFile">
      {{ $t('export-artwork') }}
    </Button>
  </Dropdown>
</template>
