<template>
  <div :class="wrapperClass" aria-hidden="true">
    <img src="/icon.ico" class="select-none" alt="Invoice Generator logo mark" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps < {
    size?: Size
    className?: string
  } > (),
  {
    size: 'md',
    className: '',
  }
)

const sizeMap: Record<Size, string> = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
}

const wrapperClass = computed(() =>
  [sizeMap[props.size], props.className]
    .filter(Boolean)
    .join(' ')
)
</script>