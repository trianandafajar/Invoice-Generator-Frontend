<template>
  <div class="min-h-screen bg-[linear-gradient(180deg,_#f6fffc_0%,_#ffffff_24%,_#f5f8fb_100%)]">
    <Header :solid="true" />

    <main class="px-5 py-10 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <section class="grid gap-6">
          <div class="app-surface overflow-hidden p-8 !rounded-lg">
            <div class="flex flex-col gap-6 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p class="section-kicker">Generator</p>
                <h2 class="text-3xl font-semibold tracking-tight text-slate-950">Invoice details</h2>
                <p class="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                  All existing API payload fields remain the same. This refresh only improves structure, branding, and usability.
                </p>
              </div>

              <div class="flex flex-wrap gap-3">
                <span class="status-pill app-card">{{ form.items.length }} item{{ form.items.length > 1 ? 's' : '' }}</span>
                <span v-if="lastCreatedInvoiceId" class="status-pill status-pill-success app-card">
                  Last invoice ID: {{ lastCreatedInvoiceId }}
                </span>
              </div>
            </div>

            <form @submit.prevent="submitForm" class="mt-8 space-y-8">
              <section class="form-section !rounded-lg">
                <div class="section-heading">
                  <div class="section-icon">
                    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M7 4.75h10A2.25 2.25 0 0 1 19.25 7v10A2.25 2.25 0 0 1 17 19.25H7A2.25 2.25 0 0 1 4.75 17V7A2.25 2.25 0 0 1 7 4.75Z" />
                      <path d="M8.5 9.25h7M8.5 13h4" stroke-linecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-slate-950">Invoice overview</h3>
                    <p class="mt-1 text-sm text-slate-600">Set the invoice reference and billing timeline.</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label class="form-label">Invoice Number</label>
                    <input v-model="form.invoice_number" type="text" class="form-input !rounded-lg" placeholder="INV-2048" />
                  </div>
                  <div>
                    <label class="form-label">Process Date</label>
                    <input v-model="form.process_date" type="date" class="form-input !rounded-lg" />
                  </div>
                  <div>
                    <label class="form-label">Due Date</label>
                    <input v-model="form.due_date" type="date" class="form-input !rounded-lg" />
                  </div>
                </div>
              </section>

              <section class="form-section !rounded-lg">
                <div class="section-heading">
                  <div class="section-icon">
                    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M12 12a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z" />
                      <path d="M5 19a6.75 6.75 0 0 1 14 0" stroke-linecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-slate-950">Customer details</h3>
                    <p class="mt-1 text-sm text-slate-600">Capture who the invoice is for and where it should be sent.</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label class="form-label">Customer Name</label>
                    <input v-model="form.customer_name" type="text" class="form-input !rounded-lg" placeholder="Northwind Studio" />
                  </div>
                  <div>
                    <label class="form-label">Customer ID</label>
                    <input v-model="form.customer_id" type="text" class="form-input !rounded-lg" placeholder="CUST-1008" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="form-label">Customer Address</label>
                    <textarea v-model="form.customer_address" class="form-input !rounded-lg min-h-28" placeholder="Client billing address"></textarea>
                  </div>
                </div>
              </section>

              <section class="form-section !rounded-lg">
                <div class="section-heading">
                  <div class="section-icon">
                    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M5.75 7.75h12.5v8.5H5.75z" />
                      <path d="M8 15.25h3M8 10.75h8" stroke-linecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-slate-950">Billing and contact</h3>
                    <p class="mt-1 text-sm text-slate-600">Add payment references and the primary contact person.</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div>
                    <label class="form-label">Previous Balance</label>
                    <input v-model.number="form.previous_balance" type="number" class="form-input !rounded-lg" />
                  </div>
                  <div>
                    <label class="form-label">Contact Person</label>
                    <input v-model="form.contact_person" type="text" class="form-input !rounded-lg" placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label class="form-label">Contact Phone</label>
                    <input v-model="form.contact_phone" type="text" class="form-input !rounded-lg" placeholder="+62 812 0000 0000" />
                  </div>
                  <div>
                    <label class="form-label">Payment Account</label>
                    <input v-model="form.payment_account" type="text" class="form-input !rounded-lg" placeholder="Bank / account reference" />
                  </div>
                  <div class="xl:col-span-2">
                    <label class="form-label">Contact Email</label>
                    <input v-model="form.contact_email" type="email" class="form-input !rounded-lg" placeholder="billing@client.com" />
                  </div>
                </div>
              </section>

              <section class="form-section !rounded-lg">
                <div class="section-heading">
                  <div class="section-icon">
                    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M7 6.75h10M7 11.75h10M7 16.75h6" stroke-linecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-slate-950">Additional notes</h3>
                    <p class="mt-1 text-sm text-slate-600">Optional context or billing instructions to include with the invoice.</p>
                  </div>
                </div>

                <div>
                  <label class="form-label">Notes</label>
                  <textarea v-model="form.notes" class="form-input min-h-32 !rounded-lg" placeholder="Add notes, terms, or reminders for the client"></textarea>
                </div>
              </section>

              <section class="form-section !rounded-lg">
                <div class="section-heading">
                  <div class="section-icon">
                    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M4.75 7A2.25 2.25 0 0 1 7 4.75h10A2.25 2.25 0 0 1 19.25 7v10A2.25 2.25 0 0 1 17 19.25H7A2.25 2.25 0 0 1 4.75 17V7Z" />
                      <path d="m8 15 2.5-3 2.25 2.25L16 10.5l2 2.5" stroke-linecap="round" stroke-linejoin="round" />
                      <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-slate-950">Brand assets</h3>
                    <p class="mt-1 text-sm text-slate-600">Capture a signature and upload your company logo for the final PDF.</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div class="app-card !rounded-lg border border-slate-200 bg-slate-50/80 p-5">
                    <label class="form-label">Signature</label>
                    <canvas
                      ref="signatureCanvas"
                      class="h-44 w-full cursor-crosshair rounded-2xl border border-dashed border-slate-300 bg-white shadow-inner touch-none"
                      style="touch-action: none;"
                    ></canvas>
                    <div class="mt-4 flex flex-wrap gap-3">
                      <button type="button" @click="clearSignature" class="app-button app-button-secondary !rounded-lg !bg-slate-100">
                        Clear
                      </button>
                      <button type="button" @click="saveSignature" class="app-button app-button-primary !rounded-lg">
                        Save Signature
                      </button>
                    </div>
                    <div v-if="form.signature_image_path" class="asset-preview mt-5 !rounded-lg">
                      <p class="asset-preview-label">Signature Preview</p>
                      <img :src="form.signature_image_path" alt="Signature Preview" class="!rounded-lg h-24 object-contain" />
                    </div>
                  </div>

                  <div class="app-card !rounded-lg border border-slate-200 bg-slate-50/80 p-5">
                    <label class="form-label">Logo</label>
                    <input
                      ref="logoFileInput"
                      type="file"
                      @change="handleLogoUpload"
                      accept=".jpg,.jpeg,.png,.gif"
                      class="!rounded-lg form-input file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700"
                    />
                    <p class="mt-3 text-sm leading-6 text-slate-500">Accepted formats: JPG, JPEG, PNG, and GIF.</p>
                    <div v-if="form.logo_preview" class="asset-preview mt-5 !rounded-lg">
                      <p class="asset-preview-label">Logo Preview</p>
                      <img :src="form.logo_preview" alt="Logo Preview" class="h-24 object-contain" />
                      <button type="button" @click="clearLogo" class="app-button !rounded-lg app-button-danger mt-4">
                        Remove Logo
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section class="form-section !rounded-lg">
                <div class="section-heading">
                  <div class="section-icon">
                    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M5 7.75h14M5 12h14M5 16.25h14" stroke-linecap="round" />
                      <path d="M8 5v14M16 5v14" stroke-linecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-slate-950">Line items</h3>
                    <p class="mt-1 text-sm text-slate-600">Add billable work, quantities, and pricing details.</p>
                  </div>
                </div>

                <div class="overflow-hidden !rounded-lg border border-slate-200">
                  <div class="overflow-x-auto">
                    <table class="min-w-full text-sm">
                      <thead class="bg-slate-950 text-slate-100">
                        <tr>
                          <th class="table-th">Name</th>
                          <th class="table-th">Description</th>
                          <th class="table-th">Qty</th>
                          <th class="table-th">Price</th>
                          <th class="table-th">Subtotal</th>
                          <th class="table-th">Amount</th>
                          <th class="table-th w-16"></th>
                        </tr>
                      </thead>
                      <tbody class="bg-white">
                        <tr v-for="(item, index) in form.items" :key="index" class="border-t border-slate-100 align-top">
                          <td class="p-2"><input v-model="item.name" type="text" class="form-input !rounded-lg" /></td>
                          <td class="p-2"><input v-model="item.description" type="text" class="form-input !rounded-lg" /></td>
                          <td class="p-2"><input v-model.number="item.qty" type="number" min="0" class="form-input !rounded-lg" /></td>
                          <td class="p-2"><input v-model.number="item.price" type="number" min="0" class="form-input !rounded-lg" /></td>
                          <td class="p-2"><input v-model.number="item.subtotal" type="number" min="0" class="form-input !rounded-lg" /></td>
                          <td class="p-2"><input v-model.number="item.amount" type="number" min="0" class="form-input !rounded-lg" /></td>
                          <td class="p-2 text-center">
                            <button
                              type="button"
                              @click="removeItem(index)"
                              class="!rounded-lg inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
                              aria-label="Remove item"
                            >
                              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M6 6l12 12M18 6 6 18" stroke-linecap="round" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div v-if="!form.items.length" class="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center">
                  <p class="text-base font-medium text-slate-900">No line items yet</p>
                  <p class="mt-2 text-sm text-slate-600">Add at least one line item with name, quantity, and price before submitting.</p>
                </div>

                <button type="button" @click="addItem" class="app-button app-button-secondary !rounded-lg mt-6">
                  Add Item
                </button>
              </section>

              <section class="!rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
                <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p class="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">Finish</p>
                    <h3 class="mt-2 text-2xl font-semibold">Create invoice and export the PDF.</h3>
                    <p class="mt-2 max-w-2xl text-sm leading-7 text-white/70">
                      Your existing create-and-download flow stays intact, now with a cleaner action area and clearer feedback.
                    </p>
                  </div>

                  <div class="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      :disabled="isSubmitting"
                      class="app-button app-button-primary app-button-lg justify-center disabled:cursor-not-allowed disabled:opacity-60 !rounded-lg"
                    >
                      {{ isSubmitting ? 'Submitting...' : 'Submit Invoice' }}
                    </button>
                    <button
                      v-if="lastCreatedInvoiceId"
                      type="button"
                      @click="downloadPdf(lastCreatedInvoiceId)"
                      :disabled="isDownloading"
                      class="app-button app-button-secondary app-button-lg justify-center !border-red-500/80 !bg-red-500/80 !text-white hover:!bg-red-500/60 hover:!border-red-500/50 disabled:cursor-not-allowed disabled:opacity-60 !rounded-lg"
                    >
                      {{ isDownloading ? 'Downloading...' : 'Download PDF' }}
                    </button>
                  </div>
                </div>
              </section>
            </form>
          </div>
        </section>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted, ref } from 'vue'
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import invoiceService from '../services/invoiceService.js'
import SignaturePad from 'signature_pad'
import { generateInvoicePdf } from '../utils/pdf/generateInvoicePdf'

const signatureCanvas = ref(null)
const logoFileInput = ref(null)
const lastCreatedInvoiceId = ref(null)
const isDownloading = ref(false)
const isSubmitting = ref(false)
let signaturePad = null
let resizeHandler = null

const form = reactive({
  invoice_number: '',
  process_date: '',
  due_date: '',
  customer_name: '',
  customer_id: '',
  customer_address: '',
  previous_balance: '',
  contact_person: '',
  contact_phone: '',
  payment_account: '',
  contact_email: '',
  notes: '',
  signature_image_path: '',
  logo_image_path: '',
  logo_image_file: null,
  logo_preview: '',
  items: [
    {
      name: '',
      description: '',
      qty: 1,
      price: 0,
      subtotal: 0,
      amount: 0,
    },
  ],
})

const resizeCanvas = () => {
  if (!signatureCanvas.value || !signaturePad) {
    return
  }

  const canvas = signatureCanvas.value
  const rect = canvas.getBoundingClientRect()
  const ratio = Math.max(window.devicePixelRatio || 1, 1)

  canvas.width = rect.width * ratio
  canvas.height = rect.height * ratio

  const context = canvas.getContext('2d')
  if (context) {
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.scale(ratio, ratio)
  }

  signaturePad.clear()
}

onMounted(() => {
  if (!signatureCanvas.value) {
    return
  }

  signaturePad = new SignaturePad(signatureCanvas.value)
  resizeCanvas()

  signaturePad.addEventListener('endStroke', () => {
    if (!signaturePad.isEmpty()) {
      form.signature_image_path = signaturePad.toDataURL()
    }
  })

  resizeHandler = () => resizeCanvas()
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  if (form.logo_preview) {
    URL.revokeObjectURL(form.logo_preview)
  }
})

const clearSignature = () => {
  if (signaturePad && typeof signaturePad.clear === 'function') {
    signaturePad.clear()
    form.signature_image_path = ''
  }
}

const saveSignature = () => {
  if (signaturePad && typeof signaturePad.isEmpty === 'function' && !signaturePad.isEmpty()) {
    form.signature_image_path = signaturePad.toDataURL()
    alert('Signature saved successfully!')
  } else {
    alert('Please draw a signature first!')
  }
}

const handleLogoUpload = (e) => {
  const file = e.target.files[0]
  if (!file) {
    return
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`

  if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
    alert('Please select a valid image file (JPEG, PNG, or GIF). WebP files are not supported.')
    e.target.value = ''
    return
  }

  if (form.logo_preview) {
    URL.revokeObjectURL(form.logo_preview)
  }

  form.logo_image_file = file
  form.logo_preview = URL.createObjectURL(file)
}

const clearLogo = () => {
  if (form.logo_preview) {
    URL.revokeObjectURL(form.logo_preview)
  }
  form.logo_image_file = null
  form.logo_preview = ''
  if (logoFileInput.value) {
    logoFileInput.value.value = ''
  }
}

const resetForm = () => {
  if (form.logo_preview) {
    URL.revokeObjectURL(form.logo_preview)
  }

  Object.assign(form, {
    invoice_number: '',
    process_date: '',
    due_date: '',
    customer_name: '',
    customer_id: '',
    customer_address: '',
    previous_balance: 0,
    contact_person: '',
    contact_phone: '',
    payment_account: '',
    contact_email: '',
    notes: '',
    signature_image_path: '',
    logo_image_path: '',
    logo_image_file: null,
    logo_preview: '',
    items: [
      {
        name: '',
        description: '',
        qty: 1,
        price: 0,
        subtotal: 0,
        amount: 0,
      },
    ],
  })

  if (signaturePad && typeof signaturePad.clear === 'function') {
    signaturePad.clear()
  }

  if (logoFileInput.value) {
    logoFileInput.value.value = ''
  }
}

const addItem = () => {
  form.items.push({
    name: '',
    description: '',
    qty: 1,
    price: 0,
    subtotal: 0,
    amount: 0,
  })
}

const removeItem = (index) => {
  form.items.splice(index, 1)
}

const downloadPdf = async (invoiceId) => {
  try {
    isDownloading.value = true

    const response = await invoiceService.downloadPdf(invoiceId)
    const invoice = response.data?.data?.invoice

    if (!invoice) {
      alert('Invoice data not found from server')
      return
    }

    invoice.items = Array.isArray(invoice.items) ? invoice.items : []
    generateInvoicePdf(invoice)
  } catch (error) {
    console.error('Error downloading PDF:', error)
    alert('Failed to download invoice. Please try again later.')
  } finally {
    isDownloading.value = false
  }
}

const submitForm = async () => {
  if (!form.invoice_number.trim()) {
    alert('Invoice Number is required!')
    return
  }

  if (!form.customer_name.trim()) {
    alert('Customer Name is required!')
    return
  }

  if (!form.process_date) {
    alert('Process Date is required!')
    return
  }

  if (!form.due_date) {
    alert('Due Date is required!')
    return
  }

  if (form.process_date && form.due_date) {
    const processDate = new Date(form.process_date)
    const dueDate = new Date(form.due_date)
    if (dueDate < processDate) {
      alert('Due Date must be the same as or after the Process Date!')
      return
    }
  }

  if (form.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)) {
    alert('Please enter a valid email address!')
    return
  }

  const validItems = form.items.filter((item) => item.name.trim() && item.qty > 0 && item.price > 0)

  if (validItems.length === 0) {
    alert('At least one item with name, quantity, and price is required!')
    return
  }

  if (!form.signature_image_path) {
    if (signaturePad && typeof signaturePad.isEmpty === 'function' && !signaturePad.isEmpty()) {
      form.signature_image_path = signaturePad.toDataURL()
    } else {
      const confirmSignature = confirm('No signature detected. Do you want to continue without signature?')
      if (!confirmSignature) {
        return
      }
    }
  }

  try {
    isSubmitting.value = true
    const formData = new FormData()

    formData.append('invoice_number', form.invoice_number)
    formData.append('process_date', form.process_date)
    formData.append('due_date', form.due_date)
    formData.append('customer_name', form.customer_name)
    formData.append('customer_id', form.customer_id)
    formData.append('customer_address', form.customer_address)
    formData.append('previous_balance', form.previous_balance)
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

    validItems.forEach((item: any, index) => {
      formData.append(`items[${index}][name]`, item.name)
      formData.append(`items[${index}][description]`, item.description)
      formData.append(`items[${index}][qty]`, item.qty)
      formData.append(`items[${index}][price]`, item.price)
      formData.append(`items[${index}][subtotal]`, item.subtotal)
      formData.append(`items[${index}][amount]`, item.amount)
    })

    const res = await invoiceService.create(formData)
    alert('Invoice Successfully Created!')

    if (res.data?.data?.id) {
      lastCreatedInvoiceId.value = res.data.data.id
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await downloadPdf(res.data.data.id)
    }

    resetForm()
  } catch (error) {
    if (error.response) {
      if (error.response.status === 422) {
        const errors = error.response.data.errors
        if (errors) {
          const messages = Object.values(errors).flat().join('\n')
          alert(`Validation Error:\n${messages}`)
        } else {
          alert('Validation failed, but no details provided.')
        }
      } else {
        console.error('API Error:', error.response)
        alert(`Error ${error.response.status}: ${error.response.statusText}`)
      }
    } else {
      console.error('Unexpected Error:', error)
      alert('Something went wrong, please try again.')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
