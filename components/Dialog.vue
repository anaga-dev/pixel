<template>
  <Modal nondismissable>
    <p>{{ message }}</p>
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

const { show, message } = storeToRefs(confirmationStore)

const props = defineProps({
  message: {
    type: String,
    required: true
  }
})

const confirm = () => {
  show.value = false
  confirmationStore.resolve(true)
}

const cancel = () => {
  show.value = false
  confirmationStore.resolve(false)
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
