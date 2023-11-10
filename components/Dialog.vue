<template>
  <Modal nondismissable>
    <p>{{ $t(message) }}</p>
    <footer>
      <Button variant="primary" @click="confirm">{{ $t('confirm') }}</Button>
      <Button @click="cancel">{{ $t('cancel') }}</Button>
    </footer>
  </Modal>
</template>

<script setup>
import { useConfirmationStore } from '@/stores/confirmation'
import { storeToRefs } from 'pinia'
const confirmationStore = useConfirmationStore()

const { showDialog, message, resolve } = storeToRefs(confirmationStore)

const confirm = () => {
  confirmationStore.resolve(true)
  showDialog.value = false
}

const cancel = () => {
  confirmationStore.resolve(false)
  showDialog.value = false
}
</script>

<style scoped>
p {
  font-size: var(--fontSizeL);
  padding: var(--spaceM) 0;
}
footer {
  display: flex;
  gap: var(--spaceS);
}
</style>
