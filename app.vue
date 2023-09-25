<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <Dialog v-if="showDialog" />
  <Tooltip v-if="showTooltip" />
  <Notifications v-if="notifications?.length > 0" />
</template>

<script setup>
import { useUIStore } from '@/stores/ui'
import { useNotificationStore } from '@/stores/notification'
import { useConfirmationStore } from '@/stores/confirmation'
const uiStore = useUIStore()
const notificationStore = useNotificationStore()
const confirmationStore = useConfirmationStore()

const { showDialog } = storeToRefs(confirmationStore)
const { showTooltip } = storeToRefs(uiStore)
const { notifications } = storeToRefs(notificationStore)
</script>
