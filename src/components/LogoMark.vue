<template>
  <div :class="wrapperClass" aria-hidden="true">
    <svg viewBox="0 0 64 64" class="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="52" height="52" rx="18" class="fill-emerald-500" />
      <path
        d="M20 21.5C20 19.567 21.567 18 23.5 18H31.25C36.0825 18 40 21.9175 40 26.75C40 31.5825 36.0825 35.5 31.25 35.5H25V46H20V21.5Z"
        class="fill-white" />
      <path d="M25 30.75H31.25C33.3211 30.75 35 29.0711 35 27C35 24.9289 33.3211 23.25 31.25 23.25H25V30.75Z"
        class="fill-emerald-100" />
      <path d="M44 18H49V33.75C49 40.5155 43.5155 46 36.75 46H33.5V41H36.75C40.7531 41 44 37.7531 44 33.75V18Z"
        class="fill-white" />
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