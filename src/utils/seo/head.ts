import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface AppRouteMeta {
  title: string
  description: string
  canonicalPath: string
  robots?: string
  ogType?: 'website' | 'article'
}

const APP_NAME = 'INVOICE GENERATOR'
const THEME_COLOR = '#10b981'
const DEFAULT_SITE_URL = 'http://localhost:5173'

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

export function resolveSiteUrl() {
  if (typeof window !== 'undefined' && window.location.origin) {
    return trimTrailingSlash(window.location.origin)
  }

  const envUrl = (import.meta.env.VITE_SITE_URL as string | undefined) || DEFAULT_SITE_URL
  return trimTrailingSlash(envUrl)
}

export function getRouteMeta(route: RouteLocationNormalizedLoaded): AppRouteMeta {
  return route.meta as AppRouteMeta
}

export function buildHead(route: RouteLocationNormalizedLoaded) {
  const meta = getRouteMeta(route)
  const siteUrl = resolveSiteUrl()
  const canonicalUrl = `${siteUrl}${meta.canonicalPath}`
  const title = `${meta.title} | ${APP_NAME}`
  const description = meta.description
  const robots = meta.robots ?? 'index,follow'
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: APP_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: canonicalUrl,
    description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
    },
  }

  return {
    title,
    meta: {
      description,
      robots,
      'theme-color': THEME_COLOR,
      'og:title': title,
      'og:description': description,
      'og:type': meta.ogType ?? 'website',
      'og:url': canonicalUrl,
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
    },
    canonicalUrl,
    structuredData,
  }
}

export function renderHeadTags(route: RouteLocationNormalizedLoaded) {
  const head = buildHead(route)

  return [
    `<title>${escapeHtml(head.title)}</title>`,
    `<meta name="description" content="${escapeHtml(head.meta.description)}">`,
    `<meta name="robots" content="${escapeHtml(head.meta.robots)}">`,
    `<meta name="theme-color" content="${head.meta['theme-color']}">`,
    `<meta property="og:title" content="${escapeHtml(head.meta['og:title'])}">`,
    `<meta property="og:description" content="${escapeHtml(head.meta['og:description'])}">`,
    `<meta property="og:type" content="${head.meta['og:type']}">`,
    `<meta property="og:url" content="${head.meta['og:url']}">`,
    `<meta name="twitter:card" content="${head.meta['twitter:card']}">`,
    `<meta name="twitter:title" content="${escapeHtml(head.meta['twitter:title'])}">`,
    `<meta name="twitter:description" content="${escapeHtml(head.meta['twitter:description'])}">`,
    `<link rel="canonical" href="${head.canonicalUrl}">`,
    `<script type="application/ld+json">${JSON.stringify(head.structuredData)}</script>`,
  ].join('\n    ')
}

export function applyHead(route: RouteLocationNormalizedLoaded) {
  if (typeof document === 'undefined') {
    return
  }

  const head = buildHead(route)
  document.title = head.title
  updateMetaTag('description', head.meta.description)
  updateMetaTag('robots', head.meta.robots)
  updateMetaTag('theme-color', head.meta['theme-color'])
  updateMetaTag('og:title', head.meta['og:title'], 'property')
  updateMetaTag('og:description', head.meta['og:description'], 'property')
  updateMetaTag('og:type', head.meta['og:type'], 'property')
  updateMetaTag('og:url', head.meta['og:url'], 'property')
  updateMetaTag('twitter:card', head.meta['twitter:card'])
  updateMetaTag('twitter:title', head.meta['twitter:title'])
  updateMetaTag('twitter:description', head.meta['twitter:description'])
  updateCanonicalLink(head.canonicalUrl)
  updateStructuredData(head.structuredData)
}

function updateMetaTag(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, name)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function updateCanonicalLink(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }

  element.href = href
}

function updateStructuredData(data: object) {
  const selector = 'script[data-app-structured-data="true"]'
  let element = document.head.querySelector<HTMLScriptElement>(selector)

  if (!element) {
    element = document.createElement('script')
    element.type = 'application/ld+json'
    element.dataset.appStructuredData = 'true'
    document.head.appendChild(element)
  }

  element.textContent = JSON.stringify(data)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
