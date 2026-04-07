<template>
  <FormSection
    id="invoice-overview"
    title="Invoice overview"
    description="Set the invoice reference and billing timeline."
  >
    <template #icon>
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M7 4.75h10A2.25 2.25 0 0 1 19.25 7v10A2.25 2.25 0 0 1 17 19.25H7A2.25 2.25 0 0 1 4.75 17V7A2.25 2.25 0 0 1 7 4.75Z" />
        <path d="M8.5 9.25h7M8.5 13h4" stroke-linecap="round" />
      </svg>
    </template>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <FormField id="invoice-number" label="Invoice Number" :error="errors.invoice_number">
        <template #default="{ describedBy, invalid }">
          <input
            id="invoice-number"
            :value="form.invoice_number"
            type="text"
            class="form-input !rounded-lg"
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
            class="form-input !rounded-lg"
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
            class="form-input !rounded-lg"
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
}>()

function emitValue(field: keyof InvoiceFormState, event: Event) {
  emit('update', field, (event.target as HTMLInputElement).value)
}
</script>
