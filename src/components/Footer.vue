<template>
  <footer class="border-t border-zinc-300 bg-white">
    <div class="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-6 lg:px-8">
      <div class="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div class="max-w-md">
          <div class="flex items-center gap-3">
            <LogoMark size="sm" />
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-600">INVOICE GENERATOR</p>
              <p class="text-xl font-semibold text-zinc-900">Professional invoice workflows without the clutter.</p>
            </div>
          </div>
          <p class="mt-4 text-sm leading-6 text-zinc-600">
            Build branded invoices, capture signatures, and export polished PDFs from a single streamlined workspace.
          </p>
        </div>

        <nav class="flex flex-wrap gap-6 text-sm font-medium text-zinc-600" aria-label="Footer navigation">
          <RouterLink to="/" class="transition hover:text-zinc-900">Home</RouterLink>
          <a href="/#features" class="transition hover:text-zinc-900">Features</a>
          <RouterLink to="/generator" class="transition hover:text-zinc-900">Open Generator</RouterLink>
        </nav>
      </div>

      <div class="flex flex-col gap-3 border-t border-zinc-300 pt-6 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
        <p>(c) 2026 INVOICE GENERATOR. All rights reserved.</p>
        <p>Designed for fast billing, clean branding, and confident client handoff.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import LogoMark from './LogoMark.vue'
</script>
