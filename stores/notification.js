export const useNotificationStore = defineStore('notification', () => {
  const notifications = reactive([])
  const resolve = ref([])
  const systemNotification = ref(null)

  const pushNotification = (msg, dsmss) => {
    notifications.push({ message: msg, dismissable: dsmss })
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
    systemNotification,
    pushNotification,
    dismissNotification
  }
})
