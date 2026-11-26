<template>
  <div class="petals" aria-hidden="true">
    <svg
      v-for="petal in petals"
      :key="petal.id"
      class="petal"
      :style="petal.style"
      viewBox="0 0 32 32"
      fill="currentColor"
    >
      <template v-if="petal.kind === 'blossom'">
        <g fill="currentColor">
          <path
            v-for="angle in BLOSSOM_ANGLES"
            :key="angle"
            :d="BLOSSOM_PETAL_PATH"
            :transform="angle ? `rotate(${angle} 16 16)` : undefined"
          />
        </g>
        <circle cx="16" cy="16" r="3.0" fill="#e28799" fill-opacity="0.72" />
        <circle cx="16" cy="16" r="1.3" fill="#ffe6b3" fill-opacity="0.95" />
      </template>
      <template v-else>
        <path :d="SINGLE_PETAL_PATH" />
        <path
          d="M15.6 28.9 C13.4 25.8 12.6 22.4 13.2 19.8 C14.5 21.6 16.8 21.6 18.2 19.8 C18.7 22.5 17.8 25.8 15.6 28.9 Z"
          fill="#d97a8c"
          fill-opacity="0.34"
        />
        <path
          d="M12.2 12.4 C12.7 9.5 13.9 8.0 14.8 8.6"
          fill="none"
          stroke="#fff7f9"
          stroke-width="1.0"
          stroke-linecap="round"
          stroke-opacity="0.5"
        />
      </template>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

type SakuraKind = 'petal' | 'blossom'

interface SakuraParticle {
  id: number
  kind: SakuraKind
  style: Record<string, string>
}

const BLOSSOM_ANGLES = [0, 72, 144, 216, 288] as const
const BLOSSOM_PETAL_PATH =
  'M16 16.2 C12.4 13.0 10.6 7.5 12.2 4.1 C13.2 2.2 14.7 2.3 15.4 3.6 L16 5.5 L16.6 3.6 C17.3 2.3 18.8 2.2 19.8 4.1 C21.4 7.5 19.6 13.0 16 16.2 Z'
const SINGLE_PETAL_PATH =
  'M15.6 29.2 C10.8 24.4 8.2 17.4 9.5 11.4 C10.4 7.0 13.1 4.6 15.1 6.1 L16.2 9.0 L17.6 5.9 C19.8 4.4 22.3 6.8 22.9 11.2 C23.8 17.4 20.6 24.5 15.6 29.2 Z'

const petals = ref<SakuraParticle[]>([])
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const isCompact = window.matchMedia('(max-width: 720px), (pointer: coarse)').matches
  const petalCount = isCompact ? 8 : 16

  petals.value = Array.from({ length: petalCount }, (_, index) => {
    const kind: SakuraKind = index % 3 === 0 ? 'blossom' : 'petal'
    const size = kind === 'blossom' ? 16 + Math.random() * 8 : 12 + Math.random() * 8
    const drift = Math.round(-70 + Math.random() * 210)
    const sway = Math.round((index % 2 === 0 ? 1 : -1) * (14 + Math.random() * 20))
    const rotStart = Math.round(Math.random() * 360)
    const rotEnd = rotStart + Math.round(220 + Math.random() * 220)
    const duration = 11 + Math.random() * 11
    const delay = -(Math.random() * duration)
    return {
      id: index,
      kind,
      style: {
        left: `${Math.random() * 100}%`,
        animationDelay: `${delay.toFixed(2)}s`,
        animationDuration: `${duration.toFixed(2)}s`,
        width: `${size.toFixed(1)}px`,
        height: `${size.toFixed(1)}px`,
        color: `hsl(${344 + Math.random() * 14}, ${76 + Math.random() * 16}%, ${81 + Math.random() * 9}%)`,
        '--petal-opacity': (0.48 + Math.random() * 0.34).toFixed(2),
        '--drift': `${drift}px`,
        '--sway': `${sway}px`,
        '--rot-start': `${rotStart}deg`,
        '--rot-end': `${rotEnd}deg`,
      },
    }
  })
})
</script>

<style scoped>
.petals {
  position: fixed; inset: 0; pointer-events: none; z-index: 10; overflow: hidden;
}
.petal {
  position: absolute;
  top: -32px;
  opacity: 0;
  animation: fall linear infinite;
  transform-origin: center;
  will-change: transform, opacity;
}
@keyframes fall {
  0%   { transform: translate3d(0, -32px, 0) rotate(var(--rot-start, 0deg)); opacity: 0; }
  12%  { opacity: var(--petal-opacity, 0.65); }
  25%  { transform: translate3d(calc(var(--drift, 60px) * 0.25 + var(--sway, 20px)), 26vh, 0) rotate(calc(var(--rot-start, 0deg) + 85deg)); }
  50%  { transform: translate3d(calc(var(--drift, 60px) * 0.55 - var(--sway, 20px)), 54vh, 0) rotate(calc(var(--rot-start, 0deg) + 190deg)); }
  75%  { transform: translate3d(calc(var(--drift, 60px) * 0.8 + var(--sway, 20px) * 0.7), 80vh, 0) rotate(calc(var(--rot-start, 0deg) + 295deg)); }
  85%  { opacity: calc(var(--petal-opacity, 0.65) * 0.7); }
  100% { transform: translate3d(var(--drift, 60px), 106vh, 0) rotate(var(--rot-end, 380deg)); opacity: 0; }
}
</style>
