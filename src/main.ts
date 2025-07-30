// src/main.ts
import { createApp } from 'vue'

import App from './App.vue'
import { setupAuthModule } from './modules/auth'
import { setupPlugins } from './plugins'
import router from './router'
import './assets/index.css'
import './assets/scrollbar.css'
import './assets/themes.css'
import 'vue-sonner/style.css'

import '@/utils/env'

function bootstrap() {
  const app = createApp(App)

  // Setup auth module
  setupAuthModule(app, router)
  setupPlugins(app)
  app.use(router)

  app.mount('#app')
}

bootstrap()
