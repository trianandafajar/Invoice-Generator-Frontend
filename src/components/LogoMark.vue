<template>
  <div :class="wrapperClass" aria-hidden="true" class="flex items-center justify-center">
    <svg viewBox="0 0 32 32" fill="none" class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10b981" /> <!-- emerald-500 -->
          <stop offset="100%" stop-color="#059669" /> <!-- emerald-600 -->
        </linearGradient>
        <filter id="subtle-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
          <feOffset dx="0" dy="1" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <!-- Background Layer (Peeking) -->
      <path 
        d="M6 8C6 6.89543 6.89543 6 8 6H20C21.1046 6 22 6.89543 22 8V28C22 29.1046 21.1046 30 20 30H8C6.89543 30 6 29.1046 6 28V8Z" 
        fill="#059669" 
        opacity="0.2"
      />
      
      <!-- Primary Shape -->
      <path 
        d="M10 4C10 2.89543 10.8954 2 12 2H24C25.1046 2 26 2.89543 26 4V24C26 25.1046 25.1046 26 24 26H12C10.8954 26 10 25.1046 10 24V4Z" 
        fill="url(#logo-gradient)" 
        filter="url(#subtle-shadow)"
      />
      
      <!-- Detail: Folded Edge Overlay -->
      <path 
        d="M20 2H24C25.1046 2 26 2.89543 26 4V8L20 2Z" 
        fill="white" 
        fill-opacity="0.25" 
      />
      
      <!-- Iconic Negative Space Element -->
      <g opacity="0.95">
        <path 
          d="M15 13L18 16L22 10" 
          stroke="white" 
          stroke-width="2.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        />
        <rect x="14" y="19" width="8" height="1.5" rx="0.75" fill="white" />
        <rect x="14" y="22" width="5" height="1.5" rx="0.75" fill="white" />
      </g>
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