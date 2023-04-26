import './css/reset.css'
import './css/variables.css'
import './css/fonts.css'
import './css/global.css'
import 'boxicons/css/boxicons.min.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { GesturePlugin } from '@vueuse/gesture'

const pinia = createPinia()
const app = createApp(App)

app.use(GesturePlugin)
app.use(pinia)
app.use(router)
app.mount('#app')
