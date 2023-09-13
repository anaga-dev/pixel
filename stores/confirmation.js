import { defineStore } from 'pinia'

export const useConfirmationStore = defineStore('confirmation', () => {
  const show = ref(false)
  const message = ref('')
  const resolve = ref(null)

  const open = (msg) => {
    message.value = msg
    show.value = true
    return new Promise((rslv) => {
      resolve.value = rslv
    })
  }

  return {
    show,
    message,
    resolve,
    open
  }
})
