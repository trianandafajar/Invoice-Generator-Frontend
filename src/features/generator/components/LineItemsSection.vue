<template>
  <FormSection
    id="line-items"
    title="Line items"
    description="Add billable work, quantities, and pricing details."
  >
    <template #icon>
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M3 6h18M3 12h18M3 18h18" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </template>

    <p
      v-if="errors.items"
      id="line-items-error"
      class="mb-4 text-sm font-medium text-rose-700"
      role="alert"
    >
      {{ errors.items }}
    </p>

    <div class="overflow-hidden border border-zinc-300">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <caption class="sr-only">
            Editable invoice line items with automatic subtotal and amount calculations.
          </caption>
          <thead class="border-b border-zinc-300 bg-white">
            <tr>
              <th class="table-th">Name</th>
              <th class="table-th">Description</th>
              <th class="table-th">Qty</th>
              <th class="table-th">Price</th>
              <th class="table-th">Subtotal</th>
              <th class="table-th">Amount</th>
              <th class="table-th w-16">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr
              v-for="(item, index) in items"
              :key="index"
              class="border-t border-zinc-200 align-top"
            >
              <td class="p-2">
                <label :for="`item-name-${index}`" class="sr-only">Item name {{ index + 1 }}</label>
                <input
                  :id="`item-name-${index}`"
                  :value="item.name"
                  type="text"
                  class="form-input"
                  autocomplete="off"
                  @input="emit('updateText', index, 'name', ($event.target as HTMLInputElement).value)"
                />
              </td>
              <td class="p-2">
                <label :for="`item-description-${index}`" class="sr-only">Item description {{ index + 1 }}</label>
                <input
                  :id="`item-description-${index}`"
                  :value="item.description"
                  type="text"
                  class="form-input"
                  autocomplete="off"
                  @input="emit('updateText', index, 'description', ($event.target as HTMLInputElement).value)"
                />
              </td>
              <td class="p-2">
                <label :for="`item-qty-${index}`" class="sr-only">Quantity {{ index + 1 }}</label>
                <input
                  :id="`item-qty-${index}`"
                  :value="item.qty"
                  type="number"
                  min="0"
                  inputmode="decimal"
                  class="form-input"
                  @input="emitNumber(index, 'qty', $event)"
                />
              </td>
              <td class="p-2">
                <label :for="`item-price-${index}`" class="sr-only">Price {{ index + 1 }}</label>
                <input
                  :id="`item-price-${index}`"
                  :value="item.price"
                  type="number"
                  min="0"
                  inputmode="decimal"
                  class="form-input"
                  @input="emitNumber(index, 'price', $event)"
                />
              </td>
              <td class="p-2">
                <label :for="`item-subtotal-${index}`" class="sr-only">Subtotal {{ index + 1 }}</label>
                <input
                  :id="`item-subtotal-${index}`"
                  :value="formatCurrency(item.subtotal)"
                  type="text"
                  class="form-input bg-zinc-50"
                  readonly
                />
              </td>
              <td class="p-2">
                <label :for="`item-amount-${index}`" class="sr-only">Amount {{ index + 1 }}</label>
                <input
                  :id="`item-amount-${index}`"
                  :value="formatCurrency(item.amount)"
                  type="text"
                  class="form-input bg-zinc-50"
                  readonly
                />
              </td>
              <td class="p-2 text-center">
                <button
                  type="button"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                  :aria-label="`Remove item ${index + 1}`"
                  @click="emit('remove', index)"
                >
                  <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="!items.length"
      class="border border-dashed border-zinc-400 bg-white px-6 py-8 text-center"
    >
      <p class="text-base font-medium text-zinc-900">No line items yet</p>
      <p class="mt-2 text-sm text-zinc-600">Add at least one line item with name, quantity, and price before submitting.</p>
    </div>

    <div class="mt-6 flex flex-wrap items-center gap-4">
      <button type="button" @click="emit('add')" class="app-button app-button-secondary cursor-pointer">
        Add Item
      </button>
      <p class="text-sm text-slate-600">Subtotal and amount are calculated automatically from quantity and price.</p>
    </div>
  </FormSection>
</template>

<script setup lang="ts">
import FormSection from './FormSection.vue'
import type { InvoiceFormItem, ValidationErrors } from '../types'

defineProps<{
  items: InvoiceFormItem[]
  errors: ValidationErrors
}>()

const emit = defineEmits<{
  add: []
  remove: [index: number]
  updateText: [index: number, field: 'name' | 'description', value: string]
  updateNumber: [index: number, field: 'qty' | 'price', value: number]
}>()

function emitNumber(index: number, field: 'qty' | 'price', event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  emit('updateNumber', index, field, Number.isFinite(value) ? value : 0)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value)
}
</script>
