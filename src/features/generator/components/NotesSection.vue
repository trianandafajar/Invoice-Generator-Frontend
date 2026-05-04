<template>
  <FormSection
    id="additional-notes"
    title="Additional notes"
    description="Optional context or billing instructions to include with the invoice."
  >
    <template #icon>
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M7 6.75h10M7 11.75h10M7 16.75h6" stroke-linecap="round" />
      </svg>
    </template>

    <FormField
      id="invoice-notes"
      label="Notes"
      :error="errors.notes"
      help="These notes will be sent together with the invoice details."
    >
      <template #default="{ describedBy, invalid }">
        <textarea
          id="invoice-notes"
          :value="form.notes"
          class="form-input min-h-32"
          :aria-invalid="invalid"
          :aria-describedby="describedBy || undefined"
          placeholder="Add notes, terms, or reminders for the client"
          @input="emit('update', 'notes', ($event.target as HTMLTextAreaElement).value)"
        />
      </template>
    </FormField>
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
</script>
