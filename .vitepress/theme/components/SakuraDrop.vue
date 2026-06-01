<template>
  <div class="sakura-drop" aria-hidden="true">
    <svg
      v-for="i in count"
      :key="i"
      class="sakura-petal-svg"
      :style="petalStyle(i)"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C8.5 2 5 5 5 8c0 4 7 12 7 12s7-8 7-12c0-3-3.5-6-7-6zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
    </svg>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  count?: number
}>(), {
  count: 12,
})

function petalStyle(i: number) {
  const left = Math.random() * 100
  const delay = Math.random() * 15
  const duration = 10 + Math.random() * 15
  const size = 10 + Math.random() * 14
  const opacity = 0.15 + Math.random() * 0.3
  const hue = 340 + Math.random() * 20 // 粉色系
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
    opacity,
    color: `hsl(${hue}, 70%, 70%)`,
  }
}
</script>

<style lang="scss" scoped>
.sakura-drop {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.sakura-petal-svg {
  position: absolute;
  top: -30px;
  animation: sakura-fall linear infinite;
  transform-origin: center;
}

@keyframes sakura-fall {
  0% {
    transform: translateY(-30px) rotate(0deg) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(105vh) rotate(540deg) translateX(80px);
    opacity: 0;
  }
}
</style>
