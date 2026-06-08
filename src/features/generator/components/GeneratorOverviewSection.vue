<template>
  <FormSection
    id="invoice-overview"
    title="Invoice overview"
    description="Set the invoice reference and billing timeline."
  >
    <template #actions>
      <div class="flex flex-wrap items-center justify-end gap-2">
        <details v-if="profiles.length" class="group relative">
          <summary class="app-button app-button-secondary cursor-pointer list-none !px-3 !py-1.5 text-[10px] font-bold uppercase tracking-wider marker:hidden">
            Profile
          </summary>
          <div class="absolute right-0 z-20 mt-2 w-80 rounded-lg border border-zinc-200 bg-white p-3 shadow-xl">
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
                    @click="emit('useProfile', profile)"
                  >
                    Use
                  </button>
                  <button
                    type="button"
                    class="app-button app-button-danger !px-3 !py-1.5 text-xs"
                    @click="emit('removeProfile', profile.id)"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </details>

        <button type="button" @click="emit('open-parser')" class="app-button border border-emerald-200 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 hover:bg-emerald-700 cursor-pointer px-3 py-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          </svg>
          Magic Fill
        </button>
      </div>
    </template>
    <template #icon>
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </template>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <FormField id="invoice-number" label="Invoice Number" :error="errors.invoice_number" required>
        <template #default="{ describedBy, invalid }">
          <input
            id="invoice-number"
            :value="form.invoice_number"
            type="text"
            class="form-input"
            :aria-invalid="invalid"
            :aria-describedby="describedBy || undefined"
            autocomplete="off"
            placeholder="INV-2048"
            @input="emitValue('invoice_number', $event)"
          />
        </template>
      </FormField>

      <FormField id="process-date" label="Process Date" :error="errors.process_date" required>
        <template #default="{ describedBy, invalid }">
          <input
            id="process-date"
            :value="form.process_date"
            type="date"
            class="form-input"
            :aria-invalid="invalid"
            :aria-describedby="describedBy || undefined"
            @input="emitValue('process_date', $event)"
          />
        </template>
      </FormField>

      <FormField id="due-date" label="Due Date" :error="errors.due_date" required>
        <template #default="{ describedBy, invalid }">
          <input
            id="due-date"
            :value="form.due_date"
            type="date"
            class="form-input"
            :aria-invalid="invalid"
            :aria-describedby="describedBy || undefined"
            @input="emitValue('due_date', $event)"
          />
        </template>
      </FormField>
    </div>
  </FormSection>
</template>

<script setup lang="ts">
import FormField from './FormField.vue'
import FormSection from './FormSection.vue'
import type { InvoiceFormState, ReusableProfileHistoryEntry, ValidationErrors } from '../types'

defineProps<{
  form: InvoiceFormState
  errors: ValidationErrors
  profiles: ReusableProfileHistoryEntry[]
}>()

const emit = defineEmits<{
  update: [field: keyof InvoiceFormState, value: string]
  'open-parser': []
  useProfile: [profile: ReusableProfileHistoryEntry]
  removeProfile: [id: string]
}>()

function emitValue(field: keyof InvoiceFormState, event: Event) {
  emit('update', field, (event.target as HTMLInputElement).value)
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
