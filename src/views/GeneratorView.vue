<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
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
import InvoiceParser from '../components/InvoiceParser.vue'
import type {
  BrandAssetsSectionExposed,
  InvoiceFormItem,
  InvoiceFormState,
  LogoSelection,
  ReusableHistoryCollection,
  ReusableProfileHistoryEntry,
  StatusMessage,
  ValidationErrors,
} from '../features/generator/types'

const DRAFT_STORAGE_KEY = 'invoice-generator-draft'
const REUSABLE_HISTORY_STORAGE_KEY = 'invoice-generator-reusable-history'
const DRAFT_SAVE_DELAY_MS = 300

interface StoredInvoiceDraft {
  invoice_number: string
  process_date: string
  due_date: string
  customer_name: string
  customer_id: string
  customer_address: string
  previous_balance: number
  contact_person: string
  contact_phone: string
  payment_account: string
  contact_email: string
  notes: string
  signature_image_path: string
  logo_image_path: string
  items: InvoiceFormItem[]
}

const brandAssetsSection = ref<BrandAssetsSectionExposed | null>(null)
const lastCreatedInvoiceId = ref<number | null>(null)
const isDownloading = ref(false)
const isSubmitting = ref(false)
const statusMessage = ref<StatusMessage | null>(null)
const isParserOpen = ref(false)
const isHydratingDraft = ref(false)
const hasStoredDraft = ref(false)
const reusableHistory = ref<ReusableHistoryCollection>({
  profiles: [],
})

const form = reactive<InvoiceFormState>(createInitialForm())
const errors = reactive<ValidationErrors>({})

const lineItemSummary = computed(() => `${form.items.length} item${form.items.length === 1 ? '' : 's'}`)
const visibleStatusMessage = computed(() => {
  if (!statusMessage.value) {
    return null
  }

  if (statusMessage.value.title === 'Draft restored' && !hasStoredDraft.value) {
    return null
  }

  return statusMessage.value
})
let draftSaveTimeout: ReturnType<typeof setTimeout> | null = null

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
  ; (form[field] as string) = value
  clearError(String(field))
}

function updateNumberField(field: keyof InvoiceFormState, value: number) {
  ; (form[field] as number) = Math.max(0, value)
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

function createHistoryId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function normalizeStoredItem(item: Partial<InvoiceFormItem>): InvoiceFormItem {
  const normalized = {
    name: item.name ?? '',
    description: item.description ?? '',
    qty: Number(item.qty) || 0,
    price: Number(item.price) || 0,
    subtotal: Number(item.subtotal) || 0,
    amount: Number(item.amount) || 0,
  }

  syncItemTotals(normalized)
  return normalized
}

function persistReusableHistory() {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(REUSABLE_HISTORY_STORAGE_KEY, JSON.stringify(reusableHistory.value))
  } catch (error) {
    console.error('Failed to save reusable invoice history:', error)
  }
}

function createReusableProfile(items = getValidItems()): ReusableProfileHistoryEntry {
  const createdAt = new Date().toISOString()
  const name = form.contact_person.trim()
    || form.payment_account.trim()
    || form.customer_name.trim()
    || `Profile ${new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(createdAt))}`

  return {
    id: createHistoryId(),
    name,
    createdAt,
    invoice_number: form.invoice_number,
    process_date: form.process_date,
    due_date: form.due_date,
    customer_name: form.customer_name,
    customer_id: form.customer_id,
    customer_address: form.customer_address,
    previous_balance: Number(form.previous_balance) || 0,
    contact_person: form.contact_person,
    contact_phone: form.contact_phone,
    payment_account: form.payment_account,
    contact_email: form.contact_email,
    notes: form.notes,
    signature_image_path: form.signature_image_path,
    logo_image_path: form.logo_image_path,
    items: items.map(normalizeStoredItem),
  }
}

function hasMeaningfulReusableProfile(profile: ReusableProfileHistoryEntry) {
  return [
    profile.invoice_number,
    profile.process_date,
    profile.due_date,
    profile.customer_name,
    profile.customer_id,
    profile.customer_address,
    profile.contact_person,
    profile.contact_phone,
    profile.payment_account,
    profile.contact_email,
    profile.notes,
    profile.signature_image_path,
    profile.logo_image_path,
  ].some((value) => value.trim().length > 0) || profile.items.length > 0
}

function saveReusableProfile(items = getValidItems()) {
  const profile = createReusableProfile(items)

  if (!hasMeaningfulReusableProfile(profile)) {
    return
  }

  reusableHistory.value.profiles = [
    profile,
    ...reusableHistory.value.profiles,
  ]
  persistReusableHistory()
}

function applyReusableProfile(profile: ReusableProfileHistoryEntry) {
  revokeLogoPreview()
  form.invoice_number = profile.invoice_number
  form.process_date = profile.process_date
  form.due_date = profile.due_date
  form.customer_name = profile.customer_name
  form.customer_id = profile.customer_id
  form.customer_address = profile.customer_address
  form.previous_balance = Number(profile.previous_balance) || 0
  form.contact_person = profile.contact_person
  form.contact_phone = profile.contact_phone
  form.payment_account = profile.payment_account
  form.contact_email = profile.contact_email
  form.notes = profile.notes
  form.signature_image_path = profile.signature_image_path
  form.logo_image_path = profile.logo_image_path
  form.logo_preview = profile.logo_image_path
  form.logo_image_file = profile.logo_image_path
    ? dataUrlToFile(profile.logo_image_path, 'saved-logo.png')
    : null
  form.items = profile.items.length > 0
    ? profile.items.map(normalizeStoredItem)
    : [createEmptyItem()]

  syncSignatureAsset()
  ;[
    'invoice_number',
    'process_date',
    'due_date',
    'customer_name',
    'customer_id',
    'customer_address',
    'previous_balance',
    'contact_person',
    'contact_phone',
    'payment_account',
    'contact_email',
    'notes',
    'signature_image_path',
    'logo_image_file',
    'items',
  ]
    .forEach(clearError)
  setStatus({
    type: 'success',
    title: 'Profile applied',
    message: `${profile.name} was loaded into the reusable invoice fields.`,
  })
}

function removeReusableProfile(id: string) {
  reusableHistory.value.profiles = reusableHistory.value.profiles.filter((profile) => profile.id !== id)
  persistReusableHistory()
}

function revokeLogoPreview() {
  if (form.logo_preview && form.logo_preview.startsWith('blob:')) {
    URL.revokeObjectURL(form.logo_preview)
  }
}

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read the selected file.'))
    reader.readAsDataURL(file)
  })
}

function dataUrlToFile(dataUrl: string, filename: string) {
  const [meta, content] = dataUrl.split(',')
  if (!meta || !content) {
    return null
  }

  const mimeMatch = meta.match(/data:(.*?);base64/)
  const mimeType = mimeMatch?.[1] ?? 'image/png'
  const binary = window.atob(content)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new File([bytes], filename, { type: mimeType })
}

async function updateLogo(selection: LogoSelection) {
  revokeLogoPreview()
  const persistentLogo = selection.file ? await fileToDataUrl(selection.file) : ''

  form.logo_image_file = selection.file
  form.logo_image_path = persistentLogo
  form.logo_preview = persistentLogo || selection.previewUrl
  clearError('logo_image_file')
}

function clearLogo() {
  revokeLogoPreview()
  form.logo_image_file = null
  form.logo_image_path = ''
  form.logo_preview = ''
}

function handleAiParsed(data: any) {
  if (data.invoice_number) form.invoice_number = data.invoice_number
  if (data.process_date) form.process_date = data.process_date
  if (data.due_date) form.due_date = data.due_date
  if (data.customer_name) form.customer_name = data.customer_name
  if (data.customer_id) form.customer_id = data.customer_id
  if (data.customer_address) form.customer_address = data.customer_address
  if (data.previous_balance !== undefined) form.previous_balance = data.previous_balance
  if (data.contact_person) form.contact_person = data.contact_person
  if (data.contact_phone) form.contact_phone = data.contact_phone
  if (data.payment_account) form.payment_account = data.payment_account
  if (data.contact_email) form.contact_email = data.contact_email
  if (data.notes) form.notes = data.notes

  if (data.items && Array.isArray(data.items)) {
    form.items = data.items.map((item: any) => ({
      name: item.name || '',
      description: item.description || '',
      qty: Number(item.qty) || 0,
      price: Number(item.price) || 0,
      subtotal: Number(item.subtotal) || 0,
      amount: Number(item.amount) || 0
    }))
    
    // Sync totals for all items
    form.items.forEach(syncItemTotals)
  }

  if (data.signature_name) {
    brandAssetsSection.value?.drawSignatureText(data.signature_name)
  }

  setStatus({
    type: 'success',
    title: 'Data Imported',
    message: 'Invoice data has been successfully extracted and populated.'
  })
}

function syncSignatureAsset() {
  brandAssetsSection.value?.loadSignatureDataUrl(form.signature_image_path)
}

function resetForm() {
  revokeLogoPreview()
  const freshState = createInitialForm()

  for (const key of Object.keys(freshState) as (keyof InvoiceFormState)[]) {
    ; (form[key] as InvoiceFormState[typeof key]) = freshState[key]
  }

  syncSignatureAsset()
  resetErrors()
  clearDraft()
}

function createDraftPayload(): StoredInvoiceDraft {
  return {
    invoice_number: form.invoice_number,
    process_date: form.process_date,
    due_date: form.due_date,
    customer_name: form.customer_name,
    customer_id: form.customer_id,
    customer_address: form.customer_address,
    previous_balance: Number(form.previous_balance) || 0,
    contact_person: form.contact_person,
    contact_phone: form.contact_phone,
    payment_account: form.payment_account,
    contact_email: form.contact_email,
    notes: form.notes,
    signature_image_path: form.signature_image_path,
    logo_image_path: form.logo_image_path,
    items: form.items.map((item) => ({
      name: item.name,
      description: item.description,
      qty: Number(item.qty) || 0,
      price: Number(item.price) || 0,
      subtotal: Number(item.subtotal) || 0,
      amount: Number(item.amount) || 0,
    })),
  }
}

function hasMeaningfulDraftContent() {
  const hasFilledMainField = [
    form.invoice_number,
    form.process_date,
    form.due_date,
    form.customer_name,
    form.customer_id,
    form.customer_address,
    form.contact_person,
    form.contact_phone,
    form.payment_account,
    form.contact_email,
    form.notes,
    form.signature_image_path,
    form.logo_image_path,
  ].some((value) => value.trim().length > 0)

  const hasMeaningfulBalance = Number(form.previous_balance) > 0
  const hasMeaningfulItem = form.items.some((item) =>
    item.name.trim().length > 0
    || item.description.trim().length > 0
    || Number(item.qty) !== 1
    || Number(item.price) !== 0
    || Number(item.subtotal) !== 0
    || Number(item.amount) !== 0,
  )

  return hasFilledMainField || hasMeaningfulBalance || hasMeaningfulItem
}

function saveDraft() {
  if (typeof window === 'undefined') {
    return
  }

  if (!hasMeaningfulDraftContent()) {
    clearDraft()
    return
  }

  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(createDraftPayload()))
  hasStoredDraft.value = true
}

function clearDraft() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(DRAFT_STORAGE_KEY)
  hasStoredDraft.value = false
}

function restoreReusableHistory() {
  if (typeof window === 'undefined') {
    return
  }

  const rawReusableHistory = window.localStorage.getItem(REUSABLE_HISTORY_STORAGE_KEY)
  if (!rawReusableHistory) {
    return
  }

  try {
    const parsed = JSON.parse(rawReusableHistory) as Partial<ReusableHistoryCollection>
    reusableHistory.value = {
      profiles: Array.isArray(parsed.profiles)
        ? parsed.profiles
          .filter((entry) => entry?.id && entry.name)
          .map((entry) => ({
            id: entry.id,
            name: entry.name,
            createdAt: entry.createdAt ?? new Date().toISOString(),
            invoice_number: entry.invoice_number ?? '',
            process_date: entry.process_date ?? '',
            due_date: entry.due_date ?? '',
            customer_name: entry.customer_name ?? '',
            customer_id: entry.customer_id ?? '',
            customer_address: entry.customer_address ?? '',
            previous_balance: Number(entry.previous_balance) || 0,
            contact_person: entry.contact_person ?? '',
            contact_phone: entry.contact_phone ?? '',
            payment_account: entry.payment_account ?? '',
            contact_email: entry.contact_email ?? '',
            notes: entry.notes ?? '',
            signature_image_path: entry.signature_image_path ?? '',
            logo_image_path: entry.logo_image_path ?? '',
            items: Array.isArray(entry.items)
              ? entry.items.map(normalizeStoredItem)
              : [],
          }))
        : [],
    }
  } catch (error) {
    console.error('Failed to restore reusable invoice history:', error)
    window.localStorage.removeItem(REUSABLE_HISTORY_STORAGE_KEY)
  }
}

function restoreDraft() {
  if (typeof window === 'undefined') {
    return
  }

  const rawDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY)
  if (!rawDraft) {
    hasStoredDraft.value = false
    return
  }

  try {
    const draft = JSON.parse(rawDraft) as Partial<StoredInvoiceDraft>
    isHydratingDraft.value = true
    hasStoredDraft.value = true

    form.invoice_number = draft.invoice_number ?? ''
    form.process_date = draft.process_date ?? ''
    form.due_date = draft.due_date ?? ''
    form.customer_name = draft.customer_name ?? ''
    form.customer_id = draft.customer_id ?? ''
    form.customer_address = draft.customer_address ?? ''
    form.previous_balance = Number(draft.previous_balance) || 0
    form.contact_person = draft.contact_person ?? ''
    form.contact_phone = draft.contact_phone ?? ''
    form.payment_account = draft.payment_account ?? ''
    form.contact_email = draft.contact_email ?? ''
    form.notes = draft.notes ?? ''
    form.signature_image_path = draft.signature_image_path ?? ''
    form.logo_image_path = draft.logo_image_path ?? ''
    form.logo_preview = draft.logo_image_path ?? ''
    form.logo_image_file = draft.logo_image_path
      ? dataUrlToFile(draft.logo_image_path, 'saved-logo.png')
      : null

    const restoredItems = Array.isArray(draft.items) ? draft.items : []
    form.items = restoredItems.length > 0
      ? restoredItems.map((item) => ({
        name: item.name ?? '',
        description: item.description ?? '',
        qty: Number(item.qty) || 0,
        price: Number(item.price) || 0,
        subtotal: Number(item.subtotal) || 0,
        amount: Number(item.amount) || 0,
      }))
      : [createEmptyItem()]

    form.items.forEach(syncItemTotals)

    setStatus({
      type: 'info',
      title: 'Draft restored',
      message: 'Your unfinished invoice was recovered from this browser.',
    })
    syncSignatureAsset()
  } catch (error) {
    console.error('Failed to restore invoice draft:', error)
    clearDraft()
  } finally {
    isHydratingDraft.value = false
  }
}

function discardDraft() {
  resetErrors()
  clearStatus()
  resetForm()
  setStatus({
    type: 'info',
    title: 'Draft deleted',
    message: 'The saved draft has been removed from this browser.',
  })
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

  if (!form.contact_person.trim()) {
    errors.contact_person = 'Contact Person is required.'
  }

  if (form.process_date && form.due_date) {
    const processDate = new Date(form.process_date)
    const dueDate = new Date(form.due_date)

    if (dueDate < processDate) {
      errors.due_date = 'Due Date must be the same as or after the Process Date.'
    }
  }

  if (!form.contact_phone.trim()) {
    errors.contact_phone = 'Contact Phone is required.'
  }

  if (form.previous_balance === undefined || form.previous_balance === null || String(form.previous_balance).trim() === '') {
    errors.previous_balance = 'Previous Balance is required.'
  }

  if (!form.payment_account.trim()) {
    errors.payment_account = 'Payment Account is required.'
  }

  if (!form.contact_email.trim()) {
    errors.contact_email = 'Contact Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)) {
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

    saveReusableProfile(validItems)

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

onMounted(() => {
  restoreReusableHistory()
  restoreDraft()
})

watch(
  form,
  () => {
    if (isHydratingDraft.value) {
      return
    }

    if (draftSaveTimeout) {
      clearTimeout(draftSaveTimeout)
    }

    draftSaveTimeout = window.setTimeout(() => {
      saveDraft()
    }, DRAFT_SAVE_DELAY_MS)
  },
  { deep: true },
)

onUnmounted(() => {
  if (draftSaveTimeout) {
    clearTimeout(draftSaveTimeout)
  }
  revokeLogoPreview()
})
</script>

<template>
  <div class="min-h-screen bg-zinc-50">
    <Header :solid="true" :show-features-link="true" />

    <main id="main-content" tabindex="-1" class="px-5 py-12 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <section aria-labelledby="generator-title">
          <div v-if="visibleStatusMessage" class="mt-6 rounded-xl px-5 py-4" :class="{
            'bg-emerald-50 text-emerald-900': visibleStatusMessage.type === 'success',
            'bg-amber-50 text-amber-900': visibleStatusMessage.type === 'info',
            'bg-rose-50 text-rose-900': visibleStatusMessage.type === 'error',
          }" :role="visibleStatusMessage.type === 'error' ? 'alert' : 'status'" aria-live="polite">
            <p class="text-sm font-medium">{{ visibleStatusMessage.title }}</p>
            <p class="mt-1 text-sm leading-6">{{ visibleStatusMessage.message }}</p>
            <button
              v-if="hasStoredDraft"
              type="button"
              class="mt-3 inline-flex rounded-lg border border-current/20 px-3 py-2 text-sm font-medium transition hover:bg-white/40"
              @click="discardDraft"
            >
              Delete Draft
            </button>
          </div>

          <div v-else-if="hasStoredDraft" class="mt-6 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900">
            <div>
              <p class="text-sm font-medium">Saved draft available</p>
              <p class="mt-1 text-sm leading-6">This form is being saved automatically in your browser.</p>
            </div>
            <button
              type="button"
              class="inline-flex rounded-lg border border-amber-900/15 px-3 py-2 text-sm font-medium transition hover:bg-white/50"
              @click="discardDraft"
            >
              Delete Draft
            </button>
          </div>

          <form @submit.prevent="submitForm" class=" space-y-6" novalidate>
            <GeneratorOverviewSection
              :form="form"
              :errors="errors"
              :profiles="reusableHistory.profiles"
              @update="updateStringField"
              @open-parser="isParserOpen = true"
              @use-profile="applyReusableProfile"
              @remove-profile="removeReusableProfile"
            />

            <CustomerDetailsSection :form="form" :errors="errors" @update="updateStringField" />

            <BillingContactSection :form="form" :errors="errors" @update-string="updateStringField"
              @update-number="updateNumberField" />

            <NotesSection :form="form" :errors="errors" @update="updateStringField" />

            <BrandAssetsSection ref="brandAssetsSection" :form="form" :errors="errors"
              @update-signature="updateSignature" @update-logo="updateLogo" @clear-logo="clearLogo"
              @announce="setStatus" @clear-error="clearError" />

            <LineItemsSection :items="form.items" :errors="errors" @add="addItem"
              @remove="removeItem" @update-text="updateItemText" @update-number="updateItemNumber" />

            <SubmitSection :is-submitting="isSubmitting" :is-downloading="isDownloading"
              :last-created-invoice-id="lastCreatedInvoiceId" @download="downloadPdf()" />
          </form>
        </section>
      </div>
    </main>

    <Footer />
    <InvoiceParser :is-open="isParserOpen" @close="isParserOpen = false" @parsed="handleAiParsed" />
  </div>
</template>
