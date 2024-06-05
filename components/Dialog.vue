<script setup>
import { useConfirmationStore } from '@/stores/confirmation'
const confirmationStore = useConfirmationStore()

const confirm = () => {
  confirmationStore.resolve(true)
  confirmationStore.closeDialog()
}

const cancel = () => {
  confirmationStore.resolve(false)
  confirmationStore.closeDialog()
}
</script>

<template>
  <Modal :non-dismissable="true">
    <p>{{ $t(confirmationStore.message) }}</p>
    <footer>
      <Button
        variant="primary"
        @click="confirm"
      >
        {{ $t('confirm') }}
      </Button>
      <Button @click="cancel">
        {{ $t('cancel') }}
      </Button>
    </footer>
  </Modal>
</template>

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
