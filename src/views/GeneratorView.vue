<script setup lang="ts">
import axios from 'axios'
import { computed, onUnmounted, reactive, ref } from 'vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import invoiceService from '../services/invoiceService'
import type { InvoiceApiEnvelope } from '../services/invoiceService'
import {
  createEmptyItem,
  createInitialForm,
} from '../features/generator/formState'
import BrandAssetsSection from '../features/generator/components/BrandAssetsSection.vue'
import BillingContactSection from '../features/generator/components/BillingContactSection.vue'
import CustomerDetailsSection from '../features/generator/components/CustomerDetailsSection.vue'
import GeneratorOverviewSection from '../features/generator/components/GeneratorOverviewSection.vue'
import LineItemsSection from '../features/generator/components/LineItemsSection.vue'
import NotesSection from '../features/generator/components/NotesSection.vue'
import SubmitSection from '../features/generator/components/SubmitSection.vue'
import type {
  BrandAssetsSectionExposed,
  InvoiceFormItem,
  InvoiceFormState,
  LogoSelection,
  StatusMessage,
  ValidationErrors,
} from '../features/generator/types'

const brandAssetsSection = ref<BrandAssetsSectionExposed | null>(null)
const lastCreatedInvoiceId = ref<number | null>(null)
const isDownloading = ref(false)
const isSubmitting = ref(false)
const statusMessage = ref<StatusMessage | null>(null)

const form = reactive<InvoiceFormState>(createInitialForm())
const errors = reactive<ValidationErrors>({})

const lineItemSummary = computed(() => `${form.items.length} item${form.items.length === 1 ? '' : 's'}`)

function setStatus(status: StatusMessage) {
  statusMessage.value = status
}

function clearStatus() {
  statusMessage.value = null
}

function clearError(field: string) {
  errors[field] = undefined
}

function resetErrors() {
  for (const key of Object.keys(errors)) {
    errors[key] = undefined
  }
}

function updateStringField(field: keyof InvoiceFormState, value: string) {
  ;(form[field] as string) = value
  clearError(String(field))
}

function updateNumberField(field: keyof InvoiceFormState, value: number) {
  ;(form[field] as number) = Math.max(0, value)
  clearError(String(field))
}

function syncItemTotals(item: InvoiceFormItem) {
  const qty = Math.max(0, Number(item.qty) || 0)
  const price = Math.max(0, Number(item.price) || 0)
  const total = Number((qty * price).toFixed(2))

  item.qty = qty
  item.price = price
  item.subtotal = total
  item.amount = total
}

function addItem() {
  form.items.push(createEmptyItem())
  clearError('items')
}

function removeItem(index: number) {
  form.items.splice(index, 1)
  clearError('items')
}

function updateItemText(index: number, field: 'name' | 'description', value: string) {
  const item = form.items[index]
  if (!item) {
    return
  }

  item[field] = value
  clearError('items')
}

function updateItemNumber(index: number, field: 'qty' | 'price', value: number) {
  const item = form.items[index]
  if (!item) {
    return
  }

  item[field] = Math.max(0, value)
  syncItemTotals(item)
  clearError('items')
}

function updateSignature(value: string) {
  form.signature_image_path = value
  clearError('signature_image_path')
}

function revokeLogoPreview() {
  if (form.logo_preview) {
    URL.revokeObjectURL(form.logo_preview)
  }
}

function updateLogo(selection: LogoSelection) {
  revokeLogoPreview()
  form.logo_image_file = selection.file
  form.logo_preview = selection.previewUrl
  clearError('logo_image_file')
}

function clearLogo() {
  revokeLogoPreview()
  form.logo_image_file = null
  form.logo_preview = ''
}

function resetForm() {
  revokeLogoPreview()
  const freshState = createInitialForm()

  for (const key of Object.keys(freshState) as (keyof InvoiceFormState)[]) {
    ;(form[key] as InvoiceFormState[typeof key]) = freshState[key]
  }

  brandAssetsSection.value?.clearSignaturePad()
  resetErrors()
}

function getValidItems() {
  return form.items
    .map((item) => {
      syncItemTotals(item)
      return item
    })
    .filter((item) => item.name.trim() && item.qty > 0 && item.price > 0)
}

function validateForm() {
  resetErrors()

  if (!form.invoice_number.trim()) {
    errors.invoice_number = 'Invoice Number is required.'
  }

  if (!form.customer_name.trim()) {
    errors.customer_name = 'Customer Name is required.'
  }

  if (!form.process_date) {
    errors.process_date = 'Process Date is required.'
  }

  if (!form.due_date) {
    errors.due_date = 'Due Date is required.'
  }

  if (form.process_date && form.due_date) {
    const processDate = new Date(form.process_date)
    const dueDate = new Date(form.due_date)

    if (dueDate < processDate) {
      errors.due_date = 'Due Date must be the same as or after the Process Date.'
    }
  }

  if (form.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)) {
    errors.contact_email = 'Please enter a valid email address.'
  }

  if (getValidItems().length === 0) {
    errors.items = 'Add at least one line item with a name, quantity, and price.'
  }

  return !Object.values(errors).some(Boolean)
}

async function downloadPdf(invoiceId = lastCreatedInvoiceId.value) {
  if (!invoiceId) {
    return
  }

  try {
    isDownloading.value = true
    const response = await invoiceService.downloadPdf(invoiceId)
    const invoice = response.data?.data?.invoice

    if (!invoice) {
      setStatus({
        type: 'error',
        title: 'Invoice data unavailable',
        message: 'The server returned no invoice data for PDF generation.',
      })
      return
    }

    invoice.items = Array.isArray(invoice.items) ? invoice.items : []
    const { generateInvoicePdf } = await import('../utils/pdf/generateInvoicePdf')
    await generateInvoicePdf(invoice)
    setStatus({
      type: 'success',
      title: 'PDF downloaded',
      message: `Invoice ${invoiceId} was rendered and downloaded successfully.`,
    })
  } catch (error) {
    console.error('Error downloading PDF:', error)
    setStatus({
      type: 'error',
      title: 'Download failed',
      message: 'The invoice PDF could not be downloaded. Please try again.',
    })
  } finally {
    isDownloading.value = false
  }
}

async function submitForm() {
  clearStatus()

  if (!validateForm()) {
    setStatus({
      type: 'error',
      title: 'Please review the form',
      message: 'Some required invoice fields are incomplete or invalid.',
    })
    return
  }

  if (!form.signature_image_path) {
    const signature = brandAssetsSection.value?.captureSignature() ?? ''
    if (signature) {
      form.signature_image_path = signature
    } else {
      setStatus({
        type: 'info',
        title: 'Submitting without signature',
        message: 'No signature was provided, so the invoice will be created without one.',
      })
    }
  }

  try {
    isSubmitting.value = true
    const validItems = getValidItems()
    const formData = new FormData()

    formData.append('invoice_number', form.invoice_number)
    formData.append('process_date', form.process_date)
    formData.append('due_date', form.due_date)
    formData.append('customer_name', form.customer_name)
    formData.append('customer_id', form.customer_id)
    formData.append('customer_address', form.customer_address)
    formData.append('previous_balance', String(form.previous_balance))
    formData.append('contact_person', form.contact_person)
    formData.append('contact_phone', form.contact_phone)
    formData.append('payment_account', form.payment_account)
    formData.append('contact_email', form.contact_email)
    formData.append('notes', form.notes)

    if (form.signature_image_path) {
      formData.append('signature', form.signature_image_path)
    }

    if (form.logo_image_file) {
      formData.append('logo', form.logo_image_file)
    }

    validItems.forEach((item, index) => {
      formData.append(`items[${index}][name]`, item.name)
      formData.append(`items[${index}][description]`, item.description)
      formData.append(`items[${index}][qty]`, String(item.qty))
      formData.append(`items[${index}][price]`, String(item.price))
      formData.append(`items[${index}][subtotal]`, String(item.subtotal))
      formData.append(`items[${index}][amount]`, String(item.amount))
    })

    const response = await invoiceService.create(formData)
    const createdInvoiceId = response.data?.data?.id ?? null
    lastCreatedInvoiceId.value = createdInvoiceId

    setStatus({
      type: 'success',
      title: 'Invoice created',
      message: createdInvoiceId
        ? `Invoice ${createdInvoiceId} was created successfully and is ready to download.`
        : 'The invoice was created successfully.',
    })

    if (createdInvoiceId) {
      await downloadPdf(createdInvoiceId)
    }

    resetForm()
  } catch (error) {
    handleSubmitError(error)
  } finally {
    isSubmitting.value = false
  }
}

function handleSubmitError(error: unknown) {
  if (axios.isAxiosError<InvoiceApiEnvelope>(error)) {
    if (error.response?.status === 422) {
      const apiErrors = error.response.data?.errors ?? {}
      const firstMessage = Object.values(apiErrors).flat()[0]

      for (const [key, value] of Object.entries(apiErrors)) {
        errors[key] = value[0]
      }

      setStatus({
        type: 'error',
        title: 'Validation failed',
        message: firstMessage ?? 'The server rejected some invoice fields.',
      })
      return
    }

    setStatus({
      type: 'error',
      title: 'Request failed',
      message: error.response?.statusText || 'Something went wrong while saving the invoice.',
    })
    return
  }

  console.error('Unexpected error:', error)
  setStatus({
    type: 'error',
    title: 'Unexpected error',
    message: 'Something went wrong while creating the invoice. Please try again.',
  })
}

onUnmounted(() => {
  revokeLogoPreview()
})
</script>

<template>
  <div class="min-h-screen bg-zinc-50">
    <Header :solid="true" />

    <main id="main-content" tabindex="-1" class="px-5 py-10 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <section class="grid gap-6" aria-labelledby="generator-title">
          <div class="app-surface overflow-hidden p-8">
            <div class="flex flex-col gap-6 border-b border-emerald-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p class="section-kicker">Generator</p>
                <h1 id="generator-title" class="text-3xl font-semibold tracking-tight text-zinc-950">
                  Create polished invoices with confidence.
                </h1>
                <p class="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
                  Your existing payload stays the same, while the workflow is now clearer, faster, and more accessible.
                </p>
              </div>

              <div class="flex flex-wrap gap-3">
                <span class="status-pill app-card">{{ lineItemSummary }}</span>
                <span v-if="lastCreatedInvoiceId" class="status-pill status-pill-success app-card">
                  Last invoice ID: {{ lastCreatedInvoiceId }}
                </span>
              </div>
            </div>

            <div
              v-if="statusMessage"
              class="mt-6 border px-5 py-4"
              :class="{
                'border-emerald-200 bg-emerald-50 text-emerald-900': statusMessage.type === 'success',
                'border-amber-200 bg-amber-50 text-amber-900': statusMessage.type === 'info',
                'border-rose-200 bg-rose-50 text-rose-900': statusMessage.type === 'error',
              }"
              :role="statusMessage.type === 'error' ? 'alert' : 'status'"
              aria-live="polite"
            >
              <p class="font-semibold">{{ statusMessage.title }}</p>
              <p class="mt-1 text-sm leading-6">{{ statusMessage.message }}</p>
            </div>

            <form @submit.prevent="submitForm" class="mt-8 space-y-8" novalidate>
              <GeneratorOverviewSection
                :form="form"
                :errors="errors"
                @update="updateStringField"
              />

              <CustomerDetailsSection
                :form="form"
                :errors="errors"
                @update="updateStringField"
              />

              <BillingContactSection
                :form="form"
                :errors="errors"
                @update-string="updateStringField"
                @update-number="updateNumberField"
              />

              <NotesSection
                :form="form"
                :errors="errors"
                @update="updateStringField"
              />

              <BrandAssetsSection
                ref="brandAssetsSection"
                :form="form"
                :errors="errors"
                @update-signature="updateSignature"
                @update-logo="updateLogo"
                @clear-logo="clearLogo"
                @announce="setStatus"
                @clear-error="clearError"
              />

              <LineItemsSection
                :items="form.items"
                :errors="errors"
                @add="addItem"
                @remove="removeItem"
                @update-text="updateItemText"
                @update-number="updateItemNumber"
              />

              <SubmitSection
                :is-submitting="isSubmitting"
                :is-downloading="isDownloading"
                :last-created-invoice-id="lastCreatedInvoiceId"
                @download="downloadPdf()"
              />
            </form>
          </div>
        </section>
      </div>
    </main>

    <Footer />
  </div>
</template>
