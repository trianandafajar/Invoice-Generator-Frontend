<template>
  <div
    :id="id"
    :aria-describedby="descriptionId"
    class="form-section"
  >
    <div class="section-heading">
      <div class="section-icon" aria-hidden="true">
        <slot name="icon" />
      </div>
      <div>
        <h2 class="text-xl font-semibold text-zinc-950">{{ title }}</h2>
        <p :id="descriptionId" class="mt-1 text-sm text-zinc-600">{{ description }}</p>
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
