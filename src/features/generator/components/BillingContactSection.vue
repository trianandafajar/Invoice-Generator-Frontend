<template>
  <FormSection
    id="billing-contact"
    title="Billing and contact"
    description="Add payment references and the primary contact person."
  >
    <template #icon>
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M3 10h18M7 15h.01M11 15h2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </template>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <FormField id="previous-balance" label="Previous Balance" :error="errors.previous_balance">
        <template #default="{ describedBy, invalid }">
          <input
            id="previous-balance"
            :value="form.previous_balance"
            type="number"
            class="form-input"
            min="0"
            step="1000"
            inputmode="decimal"
            :aria-invalid="invalid"
            :aria-describedby="describedBy || undefined"
            @input="emitNumber('previous_balance', $event)"
          />
        </template>
      </FormField>

      <FormField id="contact-person" label="Contact Person" :error="errors.contact_person">
        <template #default="{ describedBy, invalid }">
          <input
            id="contact-person"
            :value="form.contact_person"
            type="text"
            class="form-input"
            :aria-invalid="invalid"
            :aria-describedby="describedBy || undefined"
            autocomplete="name"
            placeholder="Jane Doe"
            @input="emitValue('contact_person', $event)"
          />
        </template>
      </FormField>

      <FormField id="contact-phone" label="Contact Phone" :error="errors.contact_phone">
        <template #default="{ describedBy, invalid }">
          <input
            id="contact-phone"
            :value="form.contact_phone"
            type="tel"
            class="form-input"
            :aria-invalid="invalid"
            :aria-describedby="describedBy || undefined"
            autocomplete="tel"
            placeholder="+62 812 0000 0000"
            @input="emitValue('contact_phone', $event)"
          />
        </template>
      </FormField>

      <FormField id="payment-account" label="Payment Account" :error="errors.payment_account">
        <template #default="{ describedBy, invalid }">
          <input
            id="payment-account"
            :value="form.payment_account"
            type="text"
            class="form-input"
            :aria-invalid="invalid"
            :aria-describedby="describedBy || undefined"
            autocomplete="off"
            placeholder="Bank / account reference"
            @input="emitValue('payment_account', $event)"
          />
        </template>
      </FormField>

      <FormField
        id="contact-email"
        label="Contact Email"
        :error="errors.contact_email"
        help="Optional, but useful for billing handoff."
      >
        <template #default="{ describedBy, invalid }">
          <input
            id="contact-email"
            :value="form.contact_email"
            type="email"
            class="form-input"
            :aria-invalid="invalid"
            :aria-describedby="describedBy || undefined"
            autocomplete="email"
            placeholder="billing@client.com"
            @input="emitValue('contact_email', $event)"
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
  updateString: [field: keyof InvoiceFormState, value: string]
  updateNumber: [field: keyof InvoiceFormState, value: number]
}>()

function emitValue(field: keyof InvoiceFormState, event: Event) {
  emit('updateString', field, (event.target as HTMLInputElement).value)
}

function emitNumber(field: keyof InvoiceFormState, event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  emit('updateNumber', field, Number.isFinite(value) ? value : 0)
}
</script>
