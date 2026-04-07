<template>
  <FormSection
    id="customer-details"
    title="Customer details"
    description="Capture who the invoice is for and where it should be sent."
  >
    <template #icon>
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M12 12a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z" />
        <path d="M5 19a6.75 6.75 0 0 1 14 0" stroke-linecap="round" />
      </svg>
    </template>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField id="customer-name" label="Customer Name" :error="errors.customer_name">
        <template #default="{ describedBy, invalid }">
          <input
            id="customer-name"
            :value="form.customer_name"
            type="text"
            class="form-input !rounded-lg"
            :aria-invalid="invalid"
            :aria-describedby="describedBy || undefined"
            autocomplete="organization"
            placeholder="Northwind Studio"
            @input="emitValue('customer_name', $event)"
          />
        </template>
      </FormField>

      <FormField id="customer-id" label="Customer ID" :error="errors.customer_id">
        <template #default="{ describedBy, invalid }">
          <input
            id="customer-id"
            :value="form.customer_id"
            type="text"
            class="form-input !rounded-lg"
            :aria-invalid="invalid"
            :aria-describedby="describedBy || undefined"
            autocomplete="off"
            placeholder="CUST-1008"
            @input="emitValue('customer_id', $event)"
          />
        </template>
      </FormField>

      <FormField
        id="customer-address"
        label="Customer Address"
        :error="errors.customer_address"
      >
        <template #default="{ describedBy, invalid }">
          <textarea
            id="customer-address"
            :value="form.customer_address"
            class="form-input min-h-28 !rounded-lg md:col-span-2"
            :aria-invalid="invalid"
            :aria-describedby="describedBy || undefined"
            autocomplete="street-address"
            placeholder="Client billing address"
            @input="emitValue('customer_address', $event)"
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
  emit('update', field, (event.target as HTMLInputElement | HTMLTextAreaElement).value)
}
</script>
