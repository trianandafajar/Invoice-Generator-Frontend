<script setup lang="ts">
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import MarketingFeatureIcon from '../components/MarketingFeatureIcon.vue'
import { RouterLink } from 'vue-router'

const stats = Object.freeze([
  { value: '3 min', label: 'To prepare an invoice' },
  { value: 'PDF', label: 'Client-ready export' },
  { value: '1 flow', label: 'Entry to download' },
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

const steps = Object.freeze([
  {
    title: 'Enter details',
    description: 'Invoice metadata and customer contact.',
  },
  {
    title: 'Attach assets',
    description: 'Signature, logo, and line items.',
  },
  {
    title: 'Export PDF',
    description: 'Download a client-ready PDF.',
  },
])
</script>

<template>
  <div class="min-h-screen bg-zinc-50">
    <Header :show-features-link="true" />

    <main id="main-content" tabindex="-1">
      <section class="px-5 pt-10 sm:px-6 lg:px-8 lg:pt-20 overflow-hidden" aria-labelledby="landing-hero-title">
        <div class="mx-auto max-w-7xl">
          <div class="grid gap-12 lg:grid-cols-2 items-center">
            <div class="max-w-2xl">
              <h1 id="landing-hero-title"
                class="text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl leading-[1.1]">
                Invoices, <br class="hidden sm:block" />
                <span class="text-emerald-600">ready to send.</span>
              </h1>
              <p class="mt-6 text-lg leading-8 text-zinc-600">
                A streamlined workspace to prepare branded invoices, capture signatures, and download client-ready PDFs
                in minutes.
              </p>

              <div class="mt-10 flex flex-col gap-4 sm:flex-row">
                <RouterLink to="/generator" class="app-button app-button-primary app-button-lg justify-center px-8">
                  Open Generator
                </RouterLink>
                <a href="#features" class="app-button app-button-secondary app-button-lg justify-center px-8">
                  Explore Features
                </a>
              </div>
            </div>

            <div class="relative lg:scale-110 lg:translate-x-10">
              <!-- Subtle background glow -->
              <div class="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full -z-10"></div>
              <img src="/preview1.png" alt="Invoice Generator Dashboard Preview"
                class="w-full h-auto drop-shadow-[0_32px_64px_rgba(0,0,0,0.12)]" />
            </div>
          </div>

          <div class="mt-20 grid gap-4 border-t border-zinc-200/70 pt-10 sm:grid-cols-3 mb-20">
            <div v-for="stat in stats" class="flex flex-col items-center sm:items-start" :key="stat.label">
              <p class="text-3xl font-semibold tracking-tight text-zinc-950">{{ stat.value }}</p>
              <p class="mt-1 text-sm text-zinc-500 font-medium">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="px-5 py-24 sm:px-6 lg:px-8 bg-white border-y border-zinc-200"
        aria-labelledby="features-title">
        <div class="mx-auto max-w-6xl">
          <div class="text-center max-w-2xl mx-auto mb-16">
            <p class="section-kicker">Features</p>
            <h2 id="features-title" class="section-title">Everything you need.</h2>
          </div>

          <div class="grid gap-8 sm:grid-cols-3">
            <article v-for="feature in features" :key="feature.title"
              class="bg-zinc-50 border border-zinc-200 rounded-2xl p-8 hover:shadow-md transition-shadow">
              <div class="flex h-12 w-12 items-center justify-center bg-emerald-600 text-white rounded-sm">
                <MarketingFeatureIcon :name="feature.icon" />
              </div>
              <h3 class="mt-6 text-xl font-semibold leading-tight text-zinc-950">
                {{ feature.title }}
              </h3>
              <p class="mt-3 text-zinc-600 leading-relaxed">
                {{ feature.description }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section class="px-5 py-20 sm:px-6 lg:px-8 lg:py-32" aria-labelledby="how-it-works-title">
        <div class="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 items-center">
          <div class="order-2 lg:order-1">
            <div class="relative">
              <img src="/preview2.png" alt="Invoice PDF Preview" class="w-full h-auto" />
            </div>
          </div>

          <div class="order-1 lg:order-2">
            <p class="section-kicker">Workflow</p>
            <h2 id="how-it-works-title" class="section-title">Three steps to a PDF.</h2>
            <p class="mt-4 text-zinc-600 mb-8">Streamlined process to get your invoices ready in record time.</p>

            <ol class="space-y-6">
              <li v-for="(step, index) in steps" :key="step.title" class="flex items-start gap-5 relative">
                <span
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-md shadow-emerald-600/20">
                  {{ index + 1 }}
                </span>
                <div>
                  <h3 class="text-lg font-semibold text-zinc-900">{{ step.title }}</h3>
                  <p class="mt-1 text-zinc-600">{{ step.description }}</p>
                </div>
              </li>
            </ol>

            <div class="mt-10">
              <RouterLink to="/generator" class="app-button app-button-primary app-button-lg inline-flex">
                Start Creating Invoices
              </RouterLink>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>
