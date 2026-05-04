<template>
  <div :class="wrapperClass" aria-hidden="true">
    <svg viewBox="0 0 64 64" class="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="64" height="64" rx="0" class="fill-emerald-600" />
      <path d="M26 44V26H38V44H26Z" class="fill-white" />
      <path d="M26 22V16H38V22H26Z" class="fill-white" />
      <rect x="42" y="16" width="6" height="34" class="fill-emerald-400" />
    </svg>
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