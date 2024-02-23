<script setup>
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
const { dismissNotification } = notificationStore
const { notifications, systemNotification } = storeToRefs(notificationStore)
</script>

<template>
  <Transition name="list">
    <ul v-if="notifications?.length > 0 || systemNotification">
      <TransitionGroup name="list">
        <li
          v-if="notifications && notifications.length > 0"
          v-for="(notification, index) in notifications"
          :key="index"
        >
          {{ notification.message }}
          <Button v-if="notification.type !== 'auto'" variant="ghost" @click="dismissNotification(index)"
            ><Icon i="close"
          /></Button>
        </li>
        <li v-if="systemNotification" key="system">
          {{ $t(systemNotification) }}
        </li>
      </TransitionGroup>
    </ul>
  </Transition>
</template>

<style scoped>
ul {
  position: fixed;
  top: 0;
  right: 0;
  list-style: none;
  padding: var(--spaceL);
  margin: 0;
  z-index: 1000;
  display: grid;
  gap: var(--spaceM);
  justify-items: center;
}

li {
  padding: var(--spaceM) var(--spaceL);
  background-color: var(--colorLayer2);
  color: var(--colorTextPrimary);
  box-shadow: var(--shadowLayer);
  display: flex;
  gap: var(--spaceS);
  align-items: center;
}

.list-enter-active,
.list-leave-active {
  transition: all 240ms ease-out;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  translate: 100% 0;
}
</style>
