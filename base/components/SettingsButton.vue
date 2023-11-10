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

<script setup>
import { useUIStore } from '@/stores/ui'
import { useDocumentStore } from '@/stores/document'
import { useConfirmationStore } from '@/stores/confirmation'
import { storeToRefs } from 'pinia'

const router = useRouter()
const overlay = 'general-settings'

const uiStore = useUIStore()

const { showOverlay } = storeToRefs(uiStore)

const documentStore = useDocumentStore()
const confirmationStore = useConfirmationStore()

async function newFile(params) {
  showOverlay.value = null
  if (documentStore.modified) {
    const confirmation = await confirmationStore.openDialog(
      'studio.new-artwork-confirmation'
    )
    if (confirmation) {
      console.log('new file!!!!')
      documentStore.newFile()
    }
  } else {
    documentStore.newFile()
  }
}

function openFile() {
  documentStore.openFile()
  showOverlay.value = null
}

function saveFile() {
  documentStore.saveFileAs()
  showOverlay.value = null
}

function exportFile() {
  uiStore.showExportMenu = true
  showOverlay.value = null
}
</script>

<style scoped>
.menu {
  left: var(--spaceS);
  top: calc(var(--widthToolbar) + var(--spaceS));
}
</style>
