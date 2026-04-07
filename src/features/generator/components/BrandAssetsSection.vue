<template>
  <FormSection
    id="brand-assets"
    title="Brand assets"
    description="Capture a signature and upload your company logo for the final PDF."
  >
    <template #icon>
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M4.75 7A2.25 2.25 0 0 1 7 4.75h10A2.25 2.25 0 0 1 19.25 7v10A2.25 2.25 0 0 1 17 19.25H7A2.25 2.25 0 0 1 4.75 17V7Z" />
        <path d="m8 15 2.5-3 2.25 2.25L16 10.5l2 2.5" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
      </svg>
    </template>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div class="app-card !rounded-lg border border-slate-200 bg-slate-50/80 p-5">
        <FormField
          id="signature-pad"
          label="Signature"
          :error="errors.signature_image_path"
          help="Draw directly on the canvas. The signature stays optional."
        >
          <template #default="{ describedBy, invalid }">
            <canvas
              id="signature-pad"
              ref="signatureCanvas"
              class="h-44 w-full cursor-crosshair rounded-2xl border border-dashed border-slate-300 bg-white shadow-inner touch-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              :aria-invalid="invalid"
              :aria-describedby="describedBy || undefined"
              tabindex="0"
              style="touch-action: none;"
            />
          </template>
        </FormField>

        <div class="mt-4 flex flex-wrap gap-3">
          <button type="button" @click="handleClearSignature" class="app-button app-button-secondary !rounded-lg !bg-slate-100">
            Clear
          </button>
          <button type="button" @click="handleSaveSignature" class="app-button app-button-primary !rounded-lg">
            Save Signature
          </button>
        </div>

        <div v-if="form.signature_image_path" class="asset-preview mt-5 !rounded-lg">
          <p class="asset-preview-label">Signature Preview</p>
          <img :src="form.signature_image_path" alt="Saved signature preview" class="h-24 !rounded-lg object-contain" />
        </div>
      </div>

      <div class="app-card !rounded-lg border border-slate-200 bg-slate-50/80 p-5">
        <FormField
          id="logo-file"
          label="Logo"
          :error="errors.logo_image_file"
          help="Accepted formats: JPG, JPEG, PNG, and GIF."
        >
          <template #default="{ describedBy, invalid }">
            <input
              id="logo-file"
              ref="logoFileInput"
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              class="form-input !rounded-lg file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700"
              :aria-invalid="invalid"
              :aria-describedby="describedBy || undefined"
              @change="handleLogoUpload"
            />
          </template>
        </FormField>

        <div v-if="form.logo_preview" class="asset-preview mt-5 !rounded-lg">
          <p class="asset-preview-label">Logo Preview</p>
          <img :src="form.logo_preview" alt="Uploaded company logo preview" class="h-24 object-contain" />
          <button type="button" @click="clearLogo" class="app-button app-button-danger mt-4 !rounded-lg">
            Remove Logo
          </button>
        </div>
      </div>
    </div>
  </FormSection>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import FormField from './FormField.vue'
import FormSection from './FormSection.vue'
import type {
  BrandAssetsSectionExposed,
  InvoiceFormState,
  LogoSelection,
  StatusMessage,
  ValidationErrors,
} from '../types'

interface SignaturePadLike {
  clear: () => void
  isEmpty: () => boolean
  toDataURL: () => string
  addEventListener: (type: string, listener: () => void) => void
}

const props = defineProps<{
  form: InvoiceFormState
  errors: ValidationErrors
}>()

const emit = defineEmits<{
  updateSignature: [value: string]
  updateLogo: [selection: LogoSelection]
  clearLogo: []
  announce: [status: StatusMessage]
  clearError: [field: string]
}>()

const signatureCanvas = ref<HTMLCanvasElement | null>(null)
const logoFileInput = ref<HTMLInputElement | null>(null)

let signaturePad: SignaturePadLike | null = null
let resizeObserver: ResizeObserver | null = null

function resizeCanvas() {
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

async function initSignaturePad() {
  if (!signatureCanvas.value || signaturePad) {
    return
  }

  const { default: SignaturePad } = await import('signature_pad')

  signaturePad = new SignaturePad(signatureCanvas.value)
  resizeCanvas()
  signaturePad.addEventListener('endStroke', () => {
    emit('updateSignature', captureSignature())
    emit('clearError', 'signature_image_path')
  })

  resizeObserver = new ResizeObserver(() => resizeCanvas())
  resizeObserver.observe(signatureCanvas.value)
}

function captureSignature() {
  if (!signaturePad || signaturePad.isEmpty()) {
    return ''
  }

  return signaturePad.toDataURL()
}

function handleSaveSignature() {
  const signatureDataUrl = captureSignature()

  if (!signatureDataUrl) {
    emit('announce', {
      type: 'info',
      title: 'No signature saved yet',
      message: 'Draw a signature first, or continue without one if it is not needed.',
    })
    focusSignaturePad()
    return
  }

  emit('updateSignature', signatureDataUrl)
  emit('announce', {
    type: 'success',
    title: 'Signature saved',
    message: 'The current signature will be included in the invoice export.',
  })
}

function handleClearSignature() {
  clearSignaturePad()
  emit('announce', {
    type: 'info',
    title: 'Signature cleared',
    message: 'The saved signature was removed from the form.',
  })
}

function clearSignaturePad() {
  signaturePad?.clear()
  emit('updateSignature', '')
}

function focusSignaturePad() {
  signatureCanvas.value?.focus()
}

function handleLogoUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  const fileExtension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']

  if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
    emit('announce', {
      type: 'error',
      title: 'Unsupported logo format',
      message: 'Please choose a JPG, JPEG, PNG, or GIF file.',
    })
    emit('clearError', 'logo_image_file')
    input.value = ''
    return
  }

  emit('updateLogo', {
    file,
    previewUrl: URL.createObjectURL(file),
  })
  emit('clearError', 'logo_image_file')
}

function clearLogo() {
  if (logoFileInput.value) {
    logoFileInput.value.value = ''
  }

  emit('clearLogo')
  emit('announce', {
    type: 'info',
    title: 'Logo removed',
    message: 'The current logo preview was removed from the form.',
  })
}

onMounted(async () => {
  await nextTick()
  await initSignaturePad()
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

defineExpose<BrandAssetsSectionExposed>({
  captureSignature,
  clearSignaturePad,
  focusSignaturePad,
})
</script>
