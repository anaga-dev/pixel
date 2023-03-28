import './css/variables.css'
import './css/fonts.css'
import './css/global.css'
import 'boxicons/css/boxicons.min.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import vClickOutside from 'click-outside-vue3'

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
  }
})

const pinia = createPinia()
const app = createApp(App)

app.use(vClickOutside)
app.use(pinia)
app.use(router)
app.mount('#app')
