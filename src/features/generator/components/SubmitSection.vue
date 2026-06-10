<template>
  <div id="finish-invoice" class="form-section">
    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button
        type="submit"
        :disabled="isSubmitting"
        class="app-button cursor-pointer app-button-primary app-button-lg justify-center disabled:cursor-not-allowed disabled:opacity-60"
        :aria-busy="isSubmitting"
      >
        {{ isSubmitting ? 'Submitting...' : 'Submit Invoice' }}
      </button>

      <details v-if="profiles.length" class="group relative">
        <summary class="app-button app-button-secondary app-button-lg cursor-pointer list-none justify-center marker:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          History
        </summary>
        <div class="absolute left-0 z-20 mt-2 w-80 rounded-lg border border-zinc-200 bg-white p-3 shadow-xl">
          <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Saved profiles</p>
          <div class="max-h-64 space-y-2 overflow-y-auto overscroll-contain pr-1">
            <div
              v-for="profile in profiles"
              :key="profile.id"
              class="rounded-md border border-zinc-200 bg-zinc-50 p-3"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-zinc-900">{{ profile.name }}</p>
                  <p class="mt-1 text-xs text-zinc-500">
                    {{ formatProfileMeta(profile) }}
                  </p>
                </div>
                <span class="shrink-0 text-xs font-medium text-zinc-500">{{ profile.items.length }} item</span>
              </div>
              <div
                v-if="profile.signature_image_path || profile.logo_image_path"
                class="mt-3 flex items-center gap-2"
              >
                <div
                  v-if="profile.signature_image_path"
                  class="flex h-12 w-20 items-center justify-center rounded-md border border-zinc-200 bg-white p-1"
                >
                  <img
                    :src="profile.signature_image_path"
                    alt="Profile signature"
                    class="max-h-10 max-w-full object-contain"
                  />
                </div>
                <div
                  v-if="profile.logo_image_path"
                  class="flex h-12 w-12 items-center justify-center rounded-md border border-zinc-200 bg-white p-1"
                >
                  <img
                    :src="profile.logo_image_path"
                    alt="Profile logo"
                    class="max-h-10 max-w-full object-contain"
                  />
                </div>
              </div>
              <div class="mt-3 flex gap-2">
                <button
                  type="button"
                  class="app-button app-button-primary !px-3 !py-1.5 text-xs"
                  @click="useProfile(profile)"
                >
                  Use
                </button>
                <button
                  type="button"
                  class="app-button app-button-danger !px-3 !py-1.5 text-xs"
                  @click="emit('remove-profile', profile.id)"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </details>

      <button
        v-if="lastCreatedInvoiceId"
        type="button"
        @click="emit('download')"
        :disabled="isDownloading"
        class="app-button app-button-danger app-button-lg justify-center disabled:cursor-not-allowed disabled:opacity-60"
        :aria-busy="isDownloading"
      >
        {{ isDownloading ? 'Downloading...' : 'Download PDF' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ReusableProfileHistoryEntry } from '../types'

defineProps<{
  isSubmitting: boolean
  isDownloading: boolean
  lastCreatedInvoiceId: number | null
  profiles: ReusableProfileHistoryEntry[]
}>()

const emit = defineEmits<{
  download: []
  'use-profile': [profile: ReusableProfileHistoryEntry]
  'remove-profile': [id: string]
}>()

function useProfile(profile: ReusableProfileHistoryEntry) {
  emit('use-profile', profile)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function formatProfileMeta(profile: ReusableProfileHistoryEntry) {
  const date = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(profile.createdAt))

  const assets = [
    profile.signature_image_path ? 'signature' : '',
    profile.logo_image_path ? 'logo' : '',
  ].filter(Boolean)
  const owner = profile.customer_name || profile.invoice_number

  return [date, owner, assets.join(', ')].filter(Boolean).join(' - ')
}
</script>
