import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Simplified approach like test-vue project
const app = createApp(App)

// Add plugins
app.use(createPinia())
app.use(router)

// Mount app
app.mount('#app')

console.log('GearUp App mounted - check if this appears in console')
