export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref(null)
  const resolve = ref([])

  const pushNotification = (msg) => {
    notifications.value.push({ message: msg })
    return new Promise((rslv) => {
      resolve.value = rslv
    })
  }

  const dismissNotification = (index) => {
    notifications.value.splice(index, 1)
  }

  return {
    notifications,
    resolve,
    pushNotification,
    dismissNotification
  }
})
