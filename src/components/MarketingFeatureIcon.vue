<template>
  <svg
    v-if="name === 'document'"
    viewBox="0 0 24 24"
    class="h-6 w-6"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    aria-hidden="true"
  >
    <path d="M8 3v3a2 2 0 0 1-2 2H3" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M21 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8l5-5h11a2 2 0 0 1 2 2Z" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <svg
    v-else-if="name === 'image'"
    viewBox="0 0 24 24"
    class="h-6 w-6"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="9" cy="9" r="2" stroke-linecap="round" stroke-linejoin="round" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L3 21" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <svg
    v-else
    viewBox="0 0 24 24"
    class="h-6 w-6"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    aria-hidden="true"
  >
    <path d="M12 3v13m0 0-4-4m4 4 4-4M4 21h16" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  name: 'document' | 'image' | 'download'
}>()
</script>
