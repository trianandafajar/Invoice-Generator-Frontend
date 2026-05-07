<template>
  <header :class="headerClass" class="relative">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 py-4">
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2.5 text-zinc-900 group"
        aria-label="Go to INVOICE GENERATOR home"
      >
        <LogoMark size="sm" class="transition-transform group-hover:scale-105" />
        <span class="text-md font-semibold uppercase tracking-[0.05rem] text-emerald-600 whitespace-nowrap">
          INVOICE GENERATOR
        </span>
      </RouterLink>

      <!-- Desktop Navigation -->
      <nav class="hidden items-center gap-6 text-sm font-medium text-zinc-600 md:flex" aria-label="Primary navigation">
        <RouterLink to="/" class="transition hover:text-zinc-900">Home</RouterLink>
        <a v-if="props.showFeaturesLink" href="/#features" class="transition hover:text-zinc-900">Features</a>
      </nav>

      <div class="flex items-center gap-3">
        <RouterLink to="/generator" class="hidden app-button app-button-primary whitespace-nowrap md:flex">
          Create Invoice
        </RouterLink>

        <!-- Mobile Menu Button -->
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 md:hidden"
          @click="isMenuOpen = !isMenuOpen"
          :aria-expanded="isMenuOpen"
          aria-label="Toggle navigation menu"
        >
          <svg
            v-if="!isMenuOpen"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" x2="6" y1="6" y2="18" />
            <line x1="6" x2="18" y1="6" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Drawer -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="-translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-4 opacity-0"
    >
      <div
        v-if="isMenuOpen"
        class="absolute left-0 right-0 top-full border-b border-zinc-200 bg-white shadow-xl md:hidden"
      >
        <nav class="flex flex-col p-5 gap-1 text-sm font-medium text-zinc-600">
          <RouterLink
            to="/"
            class="flex items-center rounded-lg px-4 py-3 transition hover:bg-zinc-50 hover:text-zinc-900"
            @click="isMenuOpen = false"
          >
            Home
          </RouterLink>
          <a
            v-if="props.showFeaturesLink"
            href="/#features"
            class="flex items-center rounded-lg px-4 py-3 transition hover:bg-zinc-50 hover:text-zinc-900"
            @click="isMenuOpen = false"
          >
            Features
          </a>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
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

const isMenuOpen = ref(false)
const route = useRoute()

// Close menu on route change
watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  }
)

// Lock scroll when menu is open
watch(isMenuOpen, (value) => {
  if (value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const headerClass = computed(() => 'sticky top-0 z-40 border-b border-zinc-300 bg-white px-5 sm:px-6 lg:px-8')
</script>

