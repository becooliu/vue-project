import './assets/main.css'
import './styles/global.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import plugins from '@/plugins'

const pinia = createPinia()

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(plugins)

app.mount('#app')
