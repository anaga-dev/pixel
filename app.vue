<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <Dialog v-if="showDialog" />
  <Tooltip v-if="tooltip" />
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
const { tooltip } = storeToRefs(uiStore)
const { notifications } = storeToRefs(notificationStore)

onMounted(() => {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = '/piwikpro-script.js'
  document.head.appendChild(script)
})
</script>
