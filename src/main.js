import './css/reset.css'
import './css/variables.css'
import './css/fonts.css'
import './css/global.css'
import 'boxicons/css/boxicons.min.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import clickOutsideDirective from './utils/click-outside.directive'

const pinia = createPinia()
const app = createApp(App)

app.directive('click-outside', clickOutsideDirective)
app.use(pinia)
app.use(router)
app.mount('#app')

/*
window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(
      import.meta.env.BASE_URL + 'service-worker.js'
    )
  }
})
*/
