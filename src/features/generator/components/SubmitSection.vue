<template>
  <section class="border border-emerald-200 bg-white p-6 text-zinc-950 shadow-sm">
    <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p class="section-kicker">Finish</p>
        <h2 class="mt-2 text-2xl font-semibold">Create invoice and export the PDF.</h2>
        <p class="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
          Your existing create-and-download flow stays intact, now with clearer feedback and safer defaults.
        </p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row">
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
  </section>
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
