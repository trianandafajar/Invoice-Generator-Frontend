<template>
  <div id="finish-invoice" class="form-section">
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
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isSubmitting: boolean
  isDownloading: boolean
  lastCreatedInvoiceId: number | null
}>()

const emit = defineEmits<{
  download: []
}>()
</script>
