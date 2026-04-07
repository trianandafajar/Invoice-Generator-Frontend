<script setup lang="ts">
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import LogoMark from '../components/LogoMark.vue'
import MarketingFeatureIcon from '../components/MarketingFeatureIcon.vue'
import { RouterLink } from 'vue-router'

const stats = Object.freeze([
  { value: '3 min', label: 'Average time to prepare a new invoice' },
  { value: 'PDF', label: 'Client-ready export with your brand assets' },
  { value: '1 flow', label: 'Single workspace from entry to download' },
])

const previewItems = Object.freeze([
  { name: 'Creative Direction', meta: '1 project milestone', price: '$1,200' },
  { name: 'UI Design Support', meta: '12 billable hours', price: '$840' },
])

const features = Object.freeze([
  {
    title: 'Branded invoice setup',
    description: 'Add invoice details, customer information, logo assets, and notes in one clean workflow built for repeatable billing.',
    icon: 'document' as const,
  },
  {
    title: 'Signature and logo uploads',
    description: 'Capture signatures directly in the browser and preview uploaded logos so every exported invoice feels complete.',
    icon: 'image' as const,
  },
  {
    title: 'Instant PDF handoff',
    description: 'Submit the invoice and move straight into download mode, keeping your billing process fast when deadlines are tight.',
    icon: 'download' as const,
  },
])

const differentiators = Object.freeze([
  {
    title: 'A cleaner client-facing output',
    description: 'The interface focuses on the information that matters so your invoices feel organized before they even reach the PDF stage.',
  },
  {
    title: 'Faster repeat work',
    description: 'Sectioned inputs, obvious actions, and live previews reduce the friction of filling out the same billing details again and again.',
  },
  {
    title: 'Confident handoff',
    description: 'You can collect invoice data, upload supporting assets, and export without leaving the same page or switching tools.',
  },
])

const steps = Object.freeze([
  {
    title: 'Enter invoice and client details',
    description: 'Fill in invoice metadata, billing information, and the customer contact section in a layout designed for quick scanning.',
  },
  {
    title: 'Attach assets and line items',
    description: 'Add a signature, upload your logo, and build the invoice table with quantities, pricing, and totals.',
  },
  {
    title: 'Submit and export PDF',
    description: 'Create the invoice, confirm success, and download a polished PDF as soon as the invoice record is ready.',
  },
])
</script>

<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_35%),linear-gradient(180deg,_#f8fffd_0%,_#ffffff_42%,_#f2f8f7_100%)]">
    <Header :show-features-link="true" />

    <main id="main-content" tabindex="-1">
      <section class="px-5 pb-20 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-14" aria-labelledby="landing-hero-title">
        <div class="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
              <svg viewBox="0 0 20 20" class="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M10 2 12.35 7.15 18 7.85l-4.2 3.95 1.1 5.7L10 14.7 5.1 17.5l1.1-5.7L2 7.85l5.65-.7L10 2Z" />
              </svg>
              Create clean invoices without the busywork
            </div>

            <h1 id="landing-hero-title" class="mt-6 max-w-2xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              A polished invoice generator for teams that need to move fast.
            </h1>
            <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Prepare branded invoices, capture signatures, and download client-ready PDFs from one streamlined workspace.
            </p>

            <div class="mt-8 flex flex-col gap-4 sm:flex-row">
              <RouterLink to="/generator" class="app-button app-button-primary app-button-lg justify-center !rounded-lg">
                Open Generator
              </RouterLink>
              <a href="#features" class="app-button app-button-secondary app-button-lg justify-center !rounded-lg">
                Explore Features
              </a>
            </div>

            <div class="mt-10 grid gap-4 sm:grid-cols-3">
              <div v-for="stat in stats" :key="stat.label" class="app-surface app-card p-5 !rounded-b-lg !rounded-tl-lg shadow">
                <p class="text-3xl font-semibold text-slate-950">{{ stat.value }}</p>
                <p class="mt-2 text-sm text-slate-600">{{ stat.label }}</p>
              </div>
            </div>
          </div>

          <div class="relative" aria-label="Invoice preview mockup">
            <div class="absolute -left-8 top-10 h-28 w-28 rounded-full bg-emerald-200/60 blur-3xl"></div>
            <div class="absolute -right-6 bottom-8 h-40 w-40 rounded-full bg-cyan-200/70 blur-3xl"></div>

            <div class="relative overflow-hidden !rounded-2xl border border-white/70 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <LogoMark size="sm" class-name="shrink-0" />
                  <div>
                    <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Invoice Studio</p>
                    <p class="text-lg text-white/90">Ready-to-send workspace</p>
                  </div>
                </div>
                <span class="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">Live preview</span>
              </div>

              <div class="mt-8 grid gap-4">
                <div class="app-card !rounded-lg border border-white/10 bg-white/5 p-5">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <p class="text-sm text-white/60">Invoice Number</p>
                      <p class="mt-2 text-2xl font-semibold">INV-2048</p>
                    </div>
                    <div class="rounded-lg bg-emerald-400/15 px-3 py-2 text-right">
                      <p class="text-xs uppercase tracking-[0.2em] text-emerald-200">Status</p>
                      <p class="mt-1 text-sm font-semibold text-emerald-100">Ready to export</p>
                    </div>
                  </div>

                  <div class="mt-6 grid gap-3 text-sm text-white/70 sm:grid-cols-2">
                    <div class="rounded-lg bg-white/5 px-4 py-3">
                      <p class="text-white/45">Client</p>
                      <p class="mt-2 font-medium text-white">Northwind Studio</p>
                    </div>
                    <div class="rounded-lg bg-white/5 px-4 py-3">
                      <p class="text-white/45">Due Date</p>
                      <p class="mt-2 font-medium text-white">22 Mar 2026</p>
                    </div>
                  </div>
                </div>

                <div class="app-card rounded-lg border border-white/10 bg-white/5 p-5">
                  <div class="mb-4 flex items-center justify-between">
                    <p class="text-sm font-medium text-white/85">Invoice items</p>
                    <p class="text-sm text-white/45">Auto totals</p>
                  </div>
                  <div class="space-y-3 text-sm">
                    <div v-for="item in previewItems" :key="item.name" class="app-card flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                      <div>
                        <p class="font-medium text-white">{{ item.name }}</p>
                        <p class="text-white/45">{{ item.meta }}</p>
                      </div>
                      <p class="font-semibold text-emerald-200">{{ item.price }}</p>
                    </div>
                  </div>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="app-card rounded-xl border border-white/10 bg-white/5 p-5">
                    <p class="text-sm text-white/45">Brand assets</p>
                    <p class="mt-2 text-lg font-semibold">Logo and signature upload included</p>
                  </div>
                  <div class="app-card rounded-xl border border-white/10 bg-gradient-to-br from-emerald-400/15 to-cyan-400/10 p-5">
                    <p class="text-sm text-white/45">Output</p>
                    <p class="mt-2 text-lg font-semibold">Download polished PDF instantly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="px-5 py-20 sm:px-6 lg:px-8" aria-labelledby="features-title">
        <div class="mx-auto max-w-6xl">
          <div class="max-w-2xl">
            <p class="section-kicker">Features</p>
            <h2 id="features-title" class="section-title">Everything you need to create confident client-ready invoices.</h2>
            <p class="section-copy">
              The workflow stays simple while the presentation feels premium, so your finance process looks as professional as the work behind it.
            </p>
          </div>

          <div class="mt-10 grid gap-6 lg:grid-cols-3">
            <article v-for="feature in features" :key="feature.title" class="app-surface app-card p-7">
              <div class="feature-icon">
                <MarketingFeatureIcon :name="feature.icon" />
              </div>
              <h3 class="mt-5 text-xl font-semibold text-slate-950">{{ feature.title }}</h3>
              <p class="mt-3 text-sm leading-7 text-slate-600">{{ feature.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="px-5 pb-20 sm:px-6 lg:px-8" aria-labelledby="why-teams-title">
        <div class="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div class="app-surface p-8 !rounded-lg">
            <p class="section-kicker">Why teams choose it</p>
            <h2 id="why-teams-title" class="section-title">Built to remove friction from recurring billing work.</h2>
            <div class="mt-8 space-y-5">
              <div v-for="point in differentiators" :key="point.title" class="flex gap-4">
                <div class="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <svg viewBox="0 0 20 20" class="h-5 w-5 fill-none stroke-current" stroke-width="1.7" aria-hidden="true">
                    <path d="m4 10 4 4 8-8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-slate-900">{{ point.title }}</h3>
                  <p class="mt-2 text-sm leading-7 text-slate-600">{{ point.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="app-surface overflow-hidden p-8 !rounded-lg">
            <p class="section-kicker">How it works</p>
            <h2 class="section-title">Three steps from blank form to finished PDF.</h2>
            <div class="mt-8 space-y-4">
              <div v-for="(step, index) in steps" :key="step.title" class="app-card !rounded-lg border border-slate-200 bg-slate-50/80 p-5">
                <div class="flex items-center gap-4">
                  <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                    0{{ index + 1 }}
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-slate-900">{{ step.title }}</h3>
                    <p class="mt-1 text-sm leading-7 text-slate-600">{{ step.description }}</p>
                  </div>
                </div>
              </div>
            </div>
            <RouterLink to="/generator" class="app-button app-button-primary app-button-lg mt-8 !rounded-lg">
              Start Creating Invoices
            </RouterLink>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>
