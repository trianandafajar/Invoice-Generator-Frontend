<template>
  <header :class="headerClass">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex items-center gap-3 text-slate-900">
        <LogoMark size="sm" />
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">Invoice Generator</p>
          <p class="text-sm font-medium text-slate-600">Create polished invoices in minutes</p>
        </div>
      </RouterLink>

      <nav class="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
        <RouterLink to="/" class="transition hover:text-slate-900">Home</RouterLink>
        <a href="/#features" class="transition hover:text-slate-900">Features</a>
        <RouterLink to="/generator" class="transition hover:text-slate-900">Open Generator</RouterLink>
      </nav>

      <RouterLink to="/generator" class="app-button app-button-primary hidden md:inline-flex !rounded-lg">
        Create Invoice
      </RouterLink>
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
    props.solid ? 'bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)]' : 'bg-transparent',
  ].join(' '),
)
</script>
