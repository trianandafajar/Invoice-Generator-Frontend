import { createPinia } from 'pinia'
import { createApp, type App as VueApp } from 'vue'
import { createWebHistory, type RouterHistory } from 'vue-router'
import App from './App.vue'
import { createAppRouter } from './router'

export function createInvoiceApp(history?: RouterHistory): {
  app: VueApp
  router: ReturnType<typeof createAppRouter>
} {
  const app = createApp(App)
  const router = createAppRouter(history ?? createWebHistory(import.meta.env.BASE_URL))

  app.use(createPinia())
  app.use(router)

  return { app, router }
}
