import type { RouterHistory, RouteRecordRaw } from 'vue-router'
import { createRouter } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/LandingView.vue'),
    meta: {
      title: 'Create polished invoices in minutes',
      description: 'Build branded invoices, capture signatures, and export client-ready PDFs from one fast workflow.',
      canonicalPath: '/',
      robots: 'index,follow',
      ogType: 'website',
    },
  },
  {
    path: '/generator',
    name: 'generator',
    component: () => import('../views/GeneratorView.vue'),
    meta: {
      title: 'Invoice generator workspace',
      description: 'Create and export invoices with structured sections, inline validation, and accessible feedback.',
      canonicalPath: '/generator',
      robots: 'noindex,follow',
      ogType: 'website',
    },
  },
]

export function createAppRouter(history: RouterHistory) {
  return createRouter({
    history,
    routes,
    scrollBehavior(to) {
      if (to.hash) {
        return {
          el: to.hash,
          behavior: 'smooth',
          top: 96,
        }
      }

      return { top: 0 }
    },
  })
}
