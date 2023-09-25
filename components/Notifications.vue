<script setup>
import { useNotificationStore } from '@/stores/notification'
const notificationStore = useNotificationStore()
const { dismissNotification } = notificationStore
const { notifications } = storeToRefs(notificationStore)
</script>

<template>
  <ul>
    <TransitionGroup name="list">
      <li v-for="(notification, index) in notifications" :key="index">
        {{ notification.message }}
        <Button variant="ghost" @click="dismissNotification(index)"
          ><Icon i="close"
        /></Button>
      </li>
    </TransitionGroup>
  </ul>
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
  justify-items: end;
}

li {
  padding: var(--spaceM) var(--spaceL);
  background-color: var(--colorLayer2);
  box-shadow: var(--shadowLayer);
  display: grid;
  gap: var(--spaceS);
  align-items: center;
  grid-template-columns: 1fr auto;
}

.list-enter-active,
.list-leave-active {
  transition: all 240ms ease-out;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  translate: 24rem;
}
</style>
