<template>
  <FormSection
    id="finish-invoice"
    title="Create invoice and export the PDF."
    description="Your existing create-and-download flow stays intact, now with clearer feedback and safer defaults."
  >
    <template #icon>
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M5 12.5 10 17.5l9-11" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </template>

    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button
        type="submit"
        :disabled="isSubmitting"
        class="app-button cursor-pointer app-button-primary app-button-lg justify-center disabled:cursor-not-allowed disabled:opacity-60"
        :aria-busy="isSubmitting"
      >
        {{ isSubmitting ? 'Submitting...' : 'Submit Invoice' }}
      </button>
      <button
        v-if="lastCreatedInvoiceId"
        type="button"
        @click="emit('download')"
        :disabled="isDownloading"
        class="app-button app-button-danger app-button-lg justify-center disabled:cursor-not-allowed disabled:opacity-60"
        :aria-busy="isDownloading"
      >
        {{ isDownloading ? 'Downloading...' : 'Download PDF' }}
      </button>
    </div>
  </FormSection>
</template>

<script setup lang="ts">
import FormSection from './FormSection.vue'

defineProps<{
  isSubmitting: boolean
  isDownloading: boolean
  lastCreatedInvoiceId: number | null
}>()

const emit = defineEmits<{
  download: []
}>()
</script>
