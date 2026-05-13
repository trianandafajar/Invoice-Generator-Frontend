<template>
  <div class="fixed inset-y-0 right-0 z-[60] flex pointer-events-none">
    <!-- Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] pointer-events-auto" @click="close"></div>
    </Transition>

    <!-- Drawer Panel -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-in-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in-out"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div v-if="isOpen" class="relative w-screen max-w-md bg-white pointer-events-auto flex flex-col h-full border-l border-slate-200">
        <!-- Header -->
        <div class="p-6 border-b border-zinc-200 flex items-center justify-between bg-white">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 border border-emerald-200 bg-emerald-600 flex items-center justify-center rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-zinc-900 leading-tight">AI Invoice Parser</h2>
              <p class="text-xs font-medium text-zinc-500 uppercase tracking-wider">Automated Extraction</p>
            </div>
          </div>
          <button @click="close" class="p-2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div class="space-y-4">
            <label class="block">
              <span class="text-sm font-bold text-zinc-700 flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Upload Invoice (PDF)
              </span>
              <div 
                class="relative group cursor-pointer border-2 border-dashed rounded-xl p-8 transition-all duration-300"
                :class="[
                  pdfFile ? 'border-zinc-800 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50'
                ]"
                @dragover.prevent
                @drop.prevent="handleDrop"
              >
                <input type="file" accept="application/pdf" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" @change="handleFileChange" />
                <div class="text-center">
                  <div v-if="!pdfFile" class="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400 group-hover:text-slate-500 transition-colors mb-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <p class="text-sm font-semibold text-slate-600">Drop PDF here or click to upload</p>
                    <p class="text-xs text-slate-400 mt-1">Maximum size: 10MB</p>
                  </div>
                  <div v-else class="flex items-center justify-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <div class="text-left">
                      <p class="text-sm font-bold text-zinc-900 truncate max-w-[200px]">{{ pdfFile.name }}</p>
                      <button @click.stop="clearFile" class="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer">Remove file</button>
                    </div>
                  </div>
                </div>
              </div>
            </label>

            <!-- Example PDF Download -->
            <div class="mt-2 flex items-center justify-between px-1">
              <span class="text-[10px] font-medium text-zinc-400">Need a test file?</span>
              <a 
                href="/sample-invoice.pdf" 
                download="sample-invoice.pdf"
                class="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Example PDF
              </a>
            </div>


            <div class="relative py-4 flex items-center gap-4">
              <div class="flex-1 h-px bg-zinc-100"></div>
              <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">OR PASTE TEXT</span>
              <div class="flex-1 h-px bg-zinc-100"></div>
            </div>

            <label class="block">
              <span class="text-sm font-bold text-zinc-700 flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Paste Invoice Text
              </span>
              <textarea 
                v-model="rawText" 
                rows="8" 
                class="form-input"
                placeholder="Paste the raw text from an invoice here..."
              ></textarea>

              <!-- Example Text Copy -->
              <div class="mt-2 flex items-center justify-between px-1">
                <span class="text-[10px] font-medium text-zinc-400">No invoice text?</span>
                <button 
                  @click="useExampleText"
                  class="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  Use Example Text
                </button>
              </div>
            </label>

          </div>

          <div v-if="error" class="p-4 rounded-sm bg-red-50 border border-red-100 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p class="text-xs font-semibold text-red-700">{{ error }}</p>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-6 border-t border-zinc-200 space-y-3 bg-white">
          <button 
            @click="handleParse" 
            :disabled="isParsing || (!rawText && !pdfFile)"
            class="app-button app-button-primary w-full justify-center py-4 cursor-pointer"
          >
            <svg v-if="!isParsing" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
            <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            
            <span>{{ isParsing ? 'Processing...' : 'Magic Parse' }}</span>
          </button>
          <p class="text-[10px] text-center text-zinc-400 font-medium px-4">
            Automated extraction helps populate fields but may require manual review.
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { parseInvoice } from '../services/aiService';

const props = defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'parsed', data: any): void
}>();

const rawText = ref('');
const pdfFile = ref<File | null>(null);
const isParsing = ref(false);
const error = ref('');

const EXAMPLE_TEXT = `INVOICE #INV-2024-001
Date: 2024-05-13
Due Date: 2024-05-20

FROM:
Creative Studio X
123 Design Lane, San Francisco, CA 94103
Email: contact@creativestudiox.com
Phone: +1 (555) 012-3456
Bank: Central Bank, Acc: 1234567890 (Triananda Fajar)

TO:
Global Tech Corp
Customer ID: GTC-998877
456 Innovation Blvd, New York, NY 10001
Contact: Sarah Jenkins (billing@globaltech.com)
Phone: +1 (212) 555-0199

ITEMS:
1. Website Redesign
   UI/UX overhaul and responsive development
   Qty: 1 | Price: 2500.00
2. Branding Package
   Logo design and brand guidelines
   Qty: 1 | Price: 1200.00
3. SEO Optimization
   Quarterly search engine optimization
   Qty: 1 | Price: 500.00

Subtotal: 4200.00
Tax (10%): 420.00
Previous Balance: 150.00
Total Amount: 4770.00

NOTES:
Payment is due within 7 days.
Please use INV-2024-001 as reference.

SIGNATURE:
Triananda Fajar`;

const useExampleText = () => {
  rawText.value = EXAMPLE_TEXT;
  pdfFile.value = null;
};

const close = () => {
  if (!isParsing.value) {
    emit('close');
  }
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file && file.type === 'application/pdf') {
    pdfFile.value = file;
    error.value = '';
  } else if (file) {
    error.value = 'Please upload a valid PDF file.';
  }
};

const handleDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files[0];
  if (file && file.type === 'application/pdf') {
    pdfFile.value = file;
    error.value = '';
  } else if (file) {
    error.value = 'Please upload a valid PDF file.';
  }
};

const clearFile = () => {
  pdfFile.value = null;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const handleParse = async () => {
  if (!rawText.value && !pdfFile.value) return;

  isParsing.value = true;
  error.value = '';

  try {
    let result;
    if (pdfFile.value) {
      const base64 = await fileToBase64(pdfFile.value);
      result = await parseInvoice(base64, true);
    } else {
      result = await parseInvoice(rawText.value, false);
    }

    emit('parsed', result);
    rawText.value = '';
    pdfFile.value = null;
    close();
  } catch (err: any) {
    error.value = err.message || 'Something went wrong during AI parsing.';
    console.error(err);
  } finally {
    isParsing.value = false;
  }
};
</script>

<style scoped>
</style>
