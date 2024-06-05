export const useConfirmationStore = defineStore('confirmation', () => {
  const isShowingDialog = ref(false)
  const message = ref('')
  const resolve = ref(null)

  const openDialog = (msg) => {
    message.value = msg
    isShowingDialog.value = true
    return new Promise((rslv) => {
      resolve.value = rslv
    })
  }

  const closeDialog = () => {
    isShowingDialog.value = false
  }

  return {
    isShowingDialog,
    message,
    resolve,
    openDialog,
    closeDialog
  }
})
