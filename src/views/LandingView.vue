<script setup lang="ts">
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import LogoMark from '../components/LogoMark.vue'
import MarketingFeatureIcon from '../components/MarketingFeatureIcon.vue'
import { RouterLink } from 'vue-router'

const stats = Object.freeze([
  { value: '3 min', label: 'To prepare an invoice' },
  { value: 'PDF', label: 'Client-ready export' },
  { value: '1 flow', label: 'Entry to download' },
])

const previewItems = Object.freeze([
  { name: 'Creative Direction', meta: '1 project milestone', price: '$1,200' },
  { name: 'UI Design Support', meta: '12 billable hours', price: '$840' },
])

const features = Object.freeze([
  {
    title: 'Branded setup',
    description: 'Invoice details, customer info, and notes in one workflow.',
    icon: 'document' as const,
  },
  {
    title: 'Signatures and logos',
    description: 'Capture signatures and preview logos right in the browser.',
    icon: 'image' as const,
  },
  {
    title: 'Instant PDF',
    description: 'Submit, review, and download a polished PDF in seconds.',
    icon: 'download' as const,
  },
])

const differentiators = Object.freeze([
  {
    title: 'Cleaner client output',
    description: 'Focuses on the information that matters most.',
  },
  {
    title: 'Faster repeat work',
    description: 'Sectioned inputs and live previews remove friction.',
  },
  {
    title: 'Confident handoff',
    description: 'Collect, attach, and export without switching tools.',
  },
])

const steps = Object.freeze([
  {
    title: 'Enter details',
    description: 'Invoice metadata, billing, and customer contact.',
  },
  {
    title: 'Attach assets',
    description: 'Signature, logo, and line items with totals.',
  },
  {
    title: 'Export PDF',
    description: 'Submit and download a client-ready PDF.',
  },
])
</script>

<template>
  <div class="min-h-screen bg-zinc-50">
    <Header :show-features-link="true" />

    <main id="main-content" tabindex="-1">
      <!-- Hero – content only -->
      <!-- Hero – bagian kiri dipertahankan, bagian kanan dihapus -->
      <section class="px-5 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-6" aria-labelledby="landing-hero-title">
        <div class="mx-auto max-w-6xl lg:items-center">
          <!-- Kolom kiri (session 1) TIDAK DIUBAH -->
          <div>
            <h1 id="landing-hero-title"
              class="mt-6 max-w-2xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
              Invoices, ready to send.
            </h1>
            <p class="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              Prepare branded invoices, capture signatures, and download client-ready PDFs from one streamlined
              workspace.
            </p>

            <div class="mt-8 flex flex-col gap-4 sm:flex-row">
              <RouterLink to="/generator" class="app-button app-button-primary app-button-lg justify-center">
                Open Generator
              </RouterLink>
              <a href="#features" class="app-button app-button-secondary app-button-lg justify-center">
                Explore Features
              </a>
            </div>

            <div class="mt-10 grid gap-4 max-w-2xl border-t border-zinc-200/70 pt-4 sm:grid-cols-3">
              <div v-for="stat in stats" class="border border-zinc-200 rounded-md p-4" :key="stat.label">
                <p class="text-3xl font-semibold tracking-tight text-zinc-950">
                  {{ stat.value }}
                </p>
                <p class="mt-1 text-sm text-zinc-500">{{ stat.label }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="px-5 pb-20 sm:px-6 lg:px-8 lg:pb-24" aria-label="Invoice preview">
        <div class="mx-auto max-w-xl">
          <div
            class="relative overflow-hidden rounded-3xl border border-zinc-100 bg-white p-7 text-zinc-950 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.18)]">
            <div class="flex items-center justify-between">
              <LogoMark size="sm" class-name="shrink-0" />
              <span class="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                <span class="relative flex h-1.5 w-1.5">
                  <span
                    class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                </span>
                Live preview
              </span>
            </div>

            <div class="mt-4 flex items-center justify-between">
              <div>
                <p class="text-xs uppercase tracking-wider text-zinc-400">Invoice</p>
                <p class="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
                  INV-204886234
                </p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6 border-t border-zinc-100 pt-4 text-sm">
              <div>
                <p class="text-xs text-zinc-400">Client</p>
                <p class="mt-1 font-medium text-zinc-900">Northwind Studio</p>
              </div>
              <div>
                <p class="text-xs text-zinc-400">Due</p>
                <p class="mt-1 font-medium text-zinc-900">22 Mar 2026</p>
              </div>
            </div>

            <div class="mt-4 border-t border-zinc-100 pt-4">
              <ul class="divide-y divide-zinc-100 text-sm">
                <li v-for="item in previewItems" :key="item.name" class="flex items-center justify-between py-3">
                  <div>
                    <p class="font-medium text-zinc-900">{{ item.name }}</p>
                    <p class="text-xs text-zinc-400">{{ item.meta }}</p>
                  </div>
                  <p class="font-medium text-zinc-900">{{ item.price }}</p>
                </li>
              </ul>
            </div>

            <div class="mt-4 flex items-center justify-between border-t border-zinc-100 pt-6">
              <div>
                <p class="text-xs text-zinc-400">Total</p>
                <p class="mt-1 text-xl font-semibold tracking-tight text-zinc-950">
                  $2,040
                </p>
              </div>
              <button type="button"
                class="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"
                  aria-hidden="true">
                  <path d="M10 4v9m0 0 3.5-3.5M10 13 6.5 9.5M5 16h10" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="px-5 py-4 sm:px-6 lg:px-8" aria-labelledby="features-title">
        <div class="mx-auto max-w-6xl">
          <div class="max-w-xl">
            <p class="section-kicker">Features</p>
            <h2 id="features-title" class="section-title">Everything you need.</h2>
          </div>

          <div class="mt-10 grid gap-6 sm:grid-cols-3">
            <article v-for="feature in features" :key="feature.title" class="border border-zinc-200 rounded-xl p-5">
              <!-- Ikon tanpa background -->
              <div class="flex h-10 w-10 items-center justify-center rounded-xl text-emerald-600">
                <MarketingFeatureIcon :name="feature.icon" />
              </div>
              <h3 class="mt-5 text-lg font-semibold leading-tight text-zinc-950">
                {{ feature.title }}
              </h3>
              <p class="mt-2 text-sm leading-tight text-zinc-600 text-justify">
                {{ feature.description }}
              </p>
            </article>
          </div>
        </div>
      </section>
      <section class="px-5 pb-20 lg:pt-32 sm:px-6 lg:px-8" aria-labelledby="why-teams-title">
        <div class="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <p class="section-kicker">Why teams choose it</p>
            <h2 id="why-teams-title" class="section-title">Built to remove friction.</h2>
            <ul class="mt-8 space-y-5">
              <li v-for="point in differentiators" :key="point.title" class="flex gap-3">
                <svg viewBox="0 0 20 20" class="mt-0.5 h-5 w-5 shrink-0 fill-none stroke-emerald-600" stroke-width="2"
                  aria-hidden="true">
                  <path d="m4 10 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <!-- Deskripsi dihapus, hanya judul -->
                <span class="font-medium text-zinc-900">{{ point.title }}</span>
              </li>
            </ul>
          </div>

          <div>
            <p class="section-kicker">How it works</p>
            <h2 class="section-title">Three steps to a PDF.</h2>
            <ol class="mt-8 space-y-6">
              <li v-for="(step, index) in steps" :key="step.title" class="flex gap-4">
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white">
                  {{ index + 1 }}
                </span>
                <!-- Deskripsi dihapus, hanya judul -->
                <span class="font-medium text-zinc-900">{{ step.title }}</span>
              </li>
            </ol>
            <RouterLink to="/generator" class="app-button app-button-primary app-button-lg mt-10">
              Start Creating Invoices
            </RouterLink>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>
