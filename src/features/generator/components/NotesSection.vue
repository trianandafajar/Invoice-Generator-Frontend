<template>
  <FormSection
    id="additional-notes"
    title="Additional notes"
    description="Optional context or billing instructions to include with the invoice."
  >
    <template #icon>
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke-linecap="round" stroke-linejoin="round" />
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
