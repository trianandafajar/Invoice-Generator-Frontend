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

      <!-- Hero Section -->
      <section class="min-h-screen flex items-center px-5 py-10 sm:px-6 lg:px-8 overflow-hidden"
        aria-labelledby="landing-hero-title">
        <div class="mx-auto max-w-6xl w-full">
          <div class="grid gap-10 lg:gap-12 lg:grid-cols-2 items-center">

            <!-- IMAGE FIRST ON MOBILE -->
            <div class="order-1 lg:order-2 relative flex justify-center lg:justify-end lg:scale-110 lg:translate-x-10">
              <div class="absolute inset-0 bg-emerald-500/10 blur-[80px] rounded-full -z-10"></div>

              <img src="/preview1.png" alt="Invoice Generator Dashboard Preview"
                class="w-full max-w-sm sm:max-w-md lg:max-w-none h-auto drop-shadow-[0_24px_48px_rgba(0,0,0,0.10)]" />
            </div>

            <!-- TEXT -->
            <div class="order-2 lg:order-1 text-center lg:text-left mx-auto lg:mx-0 max-w-xl">
              <h1 id="landing-hero-title"
                class="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl leading-[1.1]">
                Invoices,
                <br class="hidden sm:block" />
                <span class="text-emerald-600">ready to send.</span>
              </h1>

              <p class="mt-5 text-base sm:text-lg leading-7 sm:leading-8 text-zinc-600">
                A streamlined workspace to prepare branded invoices,
                capture signatures, and download client-ready PDFs in minutes.
              </p>

              <div class="mt-8 flex flex-col gap-3 sm:flex-row justify-center lg:justify-start">
                <RouterLink to="/generator"
                  class="app-button app-button-primary app-button-lg justify-center px-8 whitespace-nowrap">
                  Open Generator
                </RouterLink>

                <a href="#features"
                  class="app-button app-button-secondary app-button-lg justify-center px-8 whitespace-nowrap">
                  Explore Features
                </a>
              </div>
            </div>

          </div>

          <!-- Stats -->
          <div class="mt-12 sm:mt-16 border-t border-zinc-200/70 py-10 sm:py-14 mb-4">
            <div class="grid grid-cols-3 gap-4 sm:gap-8 items-center">
              <div v-for="stat in stats" class="flex flex-col items-center text-center" :key="stat.label">
                <p class="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950">
                  {{ stat.value }}
                </p>

                <p
                  class="mt-1 sm:mt-2 text-[10px] sm:text-sm text-zinc-500 font-medium uppercase tracking-wider leading-tight">
                  {{ stat.label }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="px-5 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24 bg-white border-y border-zinc-200"
        aria-labelledby="features-title">
        <div class="mx-auto max-w-6xl">
          <div class="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <p class="section-kicker">Features</p>
            <h2 id="features-title" class="section-title">Everything you need.</h2>
          </div>

          <div class="grid gap-5 sm:gap-8 sm:grid-cols-3">
            <article v-for="feature in features" :key="feature.title"
              class="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sm:p-8 hover:shadow-md transition-shadow">
              <div class="flex h-11 w-11 items-center justify-center bg-emerald-600 text-white rounded-sm">
                <MarketingFeatureIcon :name="feature.icon" />
              </div>
              <h3 class="mt-5 text-lg sm:text-xl font-semibold leading-tight text-zinc-950">
                {{ feature.title }}
              </h3>
              <p class="mt-2 sm:mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed">
                {{ feature.description }}
              </p>
            </article>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section class="px-5 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-32" aria-labelledby="how-it-works-title">
        <div class="mx-auto grid max-w-6xl gap-10 sm:gap-14 lg:gap-16 lg:grid-cols-2 items-center">
          <div class="order-2 lg:order-1">
            <div class="relative">
              <img src="/preview2.png" alt="Invoice PDF Preview" class="w-full h-auto" />
            </div>
          </div>

          <div class="order-1 lg:order-2">
            <p class="section-kicker">Workflow</p>
            <h2 id="how-it-works-title" class="section-title">Three steps to a PDF.</h2>
            <p class="mt-3 sm:mt-4 text-zinc-600 mb-6 sm:mb-8 text-sm sm:text-base">Streamlined process to get your
              invoices ready in record time.</p>

            <ol class="space-y-5 sm:space-y-6">
              <li v-for="(step, index) in steps" :key="step.title" class="flex items-start gap-4 sm:gap-5 relative">
                <span
                  class="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-md shadow-emerald-600/20">
                  {{ index + 1 }}
                </span>
                <div>
                  <h3 class="text-base sm:text-lg font-semibold text-zinc-900">{{ step.title }}</h3>
                  <p class="mt-1 text-sm sm:text-base text-zinc-600">{{ step.description }}</p>
                </div>
              </li>
            </ol>

            <div class="mt-8 sm:mt-10">
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
