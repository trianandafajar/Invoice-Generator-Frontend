<template>
  <div
    :id="id"
    :aria-describedby="descriptionId"
    class="form-section"
  >
    <div class="section-heading">
      <div v-if="$slots.icon" class="section-icon">
        <slot name="icon" />
      </div>
      <div class="flex-1">
        <h2 class="text-base font-semibold text-zinc-950">{{ title }}</h2>
        <p :id="descriptionId" class="mt-1 text-sm text-zinc-500">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="ml-4">
        <slot name="actions" />
      </div>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  description: string
  id: string
}>()

const descriptionId = computed(() => `${props.id}-description`)
</script>
