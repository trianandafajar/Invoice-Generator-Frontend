import { readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

const distDir = path.resolve('dist')
const serverDir = path.join(distDir, 'server')
const templatePath = path.join(distDir, 'index.html')
const entryServerPath = path.join(serverDir, 'entry-server.js')

const { render } = await import(pathToFileURL(entryServerPath).href)
const template = await readFile(templatePath, 'utf8')
const { html, head } = await render('/')

const prerenderedHtml = template
  .replace(/<!--app-head:start-->[\s\S]*?<!--app-head:end-->/, `<!--app-head:start-->\n    ${head}\n    <!--app-head:end-->`)
  .replace('<div id="app"></div>', `<div id="app">${html}</div>`)

await writeFile(templatePath, prerenderedHtml, 'utf8')

const siteUrl = resolveSiteUrl()
await writeFile(path.join(distDir, 'robots.txt'), buildRobots(siteUrl), 'utf8')
await writeFile(path.join(distDir, 'sitemap.xml'), buildSitemap(siteUrl), 'utf8')
await rm(serverDir, { recursive: true, force: true })

function resolveSiteUrl() {
  const raw = process.env.VITE_SITE_URL || process.env.BASE_URL || 'http://localhost:5173'
  return raw.replace(/\/+$/, '')
}

function buildRobots(siteUrl) {
  return `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`
}

function buildSitemap(siteUrl) {
  const now = new Date().toISOString()

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
}
