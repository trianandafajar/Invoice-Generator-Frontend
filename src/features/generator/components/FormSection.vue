<template>
  <fieldset
    :aria-describedby="descriptionId"
    class="form-section !rounded-lg"
  >
    <legend class="w-full">
      <div class="section-heading">
        <div class="section-icon" aria-hidden="true">
          <slot name="icon" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-slate-950">{{ title }}</h2>
          <p :id="descriptionId" class="mt-1 text-sm text-slate-600">{{ description }}</p>
        </div>
      </div>
    </legend>

    <slot />
  </fieldset>
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
