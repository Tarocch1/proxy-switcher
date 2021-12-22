import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'
import { router } from './routers'
import { i18n } from '@/utils/i18n'
import { storage } from '@/utils/storage'
import App from './App.vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: {
      i18n: typeof i18n.getMessage
    }
  }
}

async function start() {
  await i18n.init()
  await storage.init()

  const app = createApp(App)
  app.use(router)
  app.config.globalProperties.$filters = {
    i18n: i18n.getMessage,
  }
  app.mount('#app')
}

start()
