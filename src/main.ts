import './assets/index.css'

import { createInvoiceApp } from './app'
import { applyHead } from './utils/seo/head'

const { app, router } = createInvoiceApp()

router.afterEach((to) => {
  applyHead(to)
})

router.isReady().then(() => {
  applyHead(router.currentRoute.value)
  app.mount('#app')
})
