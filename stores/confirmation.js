export const useConfirmationStore = defineStore('confirmation', () => {
  const showDialog = ref(false)
  const message = ref('')
  const resolve = ref(null)

  const openDialog = (msg) => {
    message.value = msg
    showDialog.value = true
    return new Promise((rslv) => {
      resolve.value = rslv
    })
  }

  return {
    showDialog,
    message,
    resolve,
    openDialog
  }
})
