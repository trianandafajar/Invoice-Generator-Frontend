import { renderToString } from '@vue/server-renderer'
import { createMemoryHistory } from 'vue-router'
import { createInvoiceApp } from './app'
import { renderHeadTags } from './utils/seo/head'

export async function render(url: string) {
  const { app, router } = createInvoiceApp(createMemoryHistory(import.meta.env.BASE_URL))

  await router.push(url)
  await router.isReady()

  const html = await renderToString(app)
  const head = renderHeadTags(router.currentRoute.value)

  return { html, head }
}
