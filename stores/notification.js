export const useNotificationStore = defineStore('notification', () => {
  const notifications = reactive([])
  const resolve = ref([])

  const DISMISS_TIMEOUT = 6000

  const pushNotification = (notification) => {
    const index = notifications.length
    notifications.push({
      message: notification.message,
      type: notification.type
    })
    if (notification.type === 'auto') {
      setTimeout(() => {
        dismissNotification(index)
      }, DISMISS_TIMEOUT)
    }
    return new Promise((rslv) => {
      resolve.value = rslv
    })
  }

  const dismissNotification = (index) => {
    notifications.splice(index, 1)
  }

  return {
    notifications,
    resolve,
    pushNotification,
    dismissNotification
  }
})
