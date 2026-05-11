<template>
  <FormSection
    id="invoice-overview"
    title="Invoice overview"
    description="Set the invoice reference and billing timeline."
  >
    <template #actions>
      <button type="button" @click="emit('open-parser')" class="app-button border border-emerald-200 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 hover:bg-emerald-700 cursor-pointer px-3 py-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        </svg>
        Magic Fill
      </button>
    </template>
    <template #icon>
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </template>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <FormField id="invoice-number" label="Invoice Number" :error="errors.invoice_number">
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

      <FormField id="process-date" label="Process Date" :error="errors.process_date">
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

      <FormField id="due-date" label="Due Date" :error="errors.due_date">
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
import type { InvoiceFormState, ValidationErrors } from '../types'

defineProps<{
  form: InvoiceFormState
  errors: ValidationErrors
}>()

const emit = defineEmits<{
  update: [field: keyof InvoiceFormState, value: string]
  'open-parser': []
}>()

function emitValue(field: keyof InvoiceFormState, event: Event) {
  emit('update', field, (event.target as HTMLInputElement).value)
}
</script>
