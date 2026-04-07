<template>
  <svg
    v-if="name === 'document'"
    viewBox="0 0 24 24"
    class="h-6 w-6"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path d="M6 4.5h7l5 5V19.5A1.5 1.5 0 0 1 16.5 21h-10A1.5 1.5 0 0 1 5 19.5v-13A1.5 1.5 0 0 1 6.5 5Z" stroke-linejoin="round" />
    <path d="M13 4.5V10h5" stroke-linejoin="round" />
    <path d="M8 14h8M8 17h5" stroke-linecap="round" />
  </svg>

  <svg
    v-else-if="name === 'image'"
    viewBox="0 0 24 24"
    class="h-6 w-6"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path d="M4.5 17.5 9 13l3 3 4.5-6 3 4.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M4.5 6.5A1.5 1.5 0 0 1 6 5h12a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 18 19H6a1.5 1.5 0 0 1-1.5-1.5v-11Z" stroke-linejoin="round" />
    <circle cx="9" cy="9" r="1.25" fill="currentColor" stroke="none" />
  </svg>

  <svg
    v-else
    viewBox="0 0 24 24"
    class="h-6 w-6"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    aria-hidden="true"
  >
    <path d="M12 4v10" stroke-linecap="round" />
    <path d="m8 10 4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M5 19.5h14" stroke-linecap="round" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  name: 'document' | 'image' | 'download'
}>()
</script>
