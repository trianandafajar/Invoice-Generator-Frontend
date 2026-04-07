<template>
  <section class="!rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
    <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">Finish</p>
        <h2 class="mt-2 text-2xl font-semibold">Create invoice and export the PDF.</h2>
        <p class="mt-2 max-w-2xl text-sm leading-7 text-white/70">
          Your existing create-and-download flow stays intact, now with clearer feedback and safer defaults.
        </p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="app-button app-button-primary app-button-lg justify-center !rounded-lg disabled:cursor-not-allowed disabled:opacity-60"
          :aria-busy="isSubmitting"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit Invoice' }}
        </button>
        <button
          v-if="lastCreatedInvoiceId"
          type="button"
          @click="emit('download')"
          :disabled="isDownloading"
          class="app-button app-button-secondary app-button-lg justify-center !rounded-lg !border-red-500/80 !bg-red-500/80 !text-white hover:!border-red-500/50 hover:!bg-red-500/60 disabled:cursor-not-allowed disabled:opacity-60"
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
