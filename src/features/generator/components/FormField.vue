<template>
  <div>
    <label :for="id" class="form-label">{{ label }}</label>
    <slot :described-by="describedBy" :invalid="invalid" />
    <p
      v-if="help"
      :id="helpId"
      class="mt-2 text-sm leading-6 text-slate-500"
    >
      {{ help }}
    </p>
    <p
      v-if="error"
      :id="errorId"
      class="mt-2 text-sm font-medium text-rose-700"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  id: string
  label: string
  error?: string
  help?: string
}>()

const helpId = computed(() => `${props.id}-help`)
const errorId = computed(() => `${props.id}-error`)
const invalid = computed(() => Boolean(props.error))
const describedBy = computed(() =>
  [props.help ? helpId.value : '', props.error ? errorId.value : '']
    .filter(Boolean)
    .join(' '),
)
</script>
