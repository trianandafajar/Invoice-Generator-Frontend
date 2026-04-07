<template>
  <header :class="headerClass">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex items-center gap-3 text-slate-900" aria-label="Go to Invoice Generator home">
        <LogoMark size="sm" />
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">Invoice Generator</p>
          <p class="text-sm font-medium text-slate-600">Create polished invoices in minutes</p>
        </div>
      </RouterLink>

      <nav class="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex" aria-label="Primary navigation">
        <RouterLink to="/" class="transition hover:text-slate-900">Home</RouterLink>
        <a v-if="showFeaturesLink" href="/#features" class="transition hover:text-slate-900">Features</a>
        <RouterLink to="/generator" class="transition hover:text-slate-900">Open Generator</RouterLink>
      </nav>

      <div class="flex items-center gap-3">
        <RouterLink to="/generator" class="app-button app-button-primary !rounded-lg">
          Create Invoice
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import LogoMark from './LogoMark.vue'

const props = defineProps({
  showFeaturesLink: {
    type: Boolean,
    default: false,
  },
  solid: {
    type: Boolean,
    default: false,
  },
})

const headerClass = computed(() =>
  [
    'sticky top-0 z-40 border-b border-white/60 backdrop-blur-xl',
    props.solid ? 'bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]' : 'bg-white/70',
  ].join(' '),
)
</script>
