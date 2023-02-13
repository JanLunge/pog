import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@mdi/font/css/materialdesignicons.css'
import './style/index.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
