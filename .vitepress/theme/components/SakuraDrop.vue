<template>
  <div class="sakura-drop" aria-hidden="true">
    <svg
      v-for="p in petals"
      :key="p.i"
      class="sakura-petal-svg"
      :style="p.style"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C8.5 2 5 5 5 8c0 4 7 12 7 12s7-8 7-12c0-3-3.5-6-7-6zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{ count?: number }>(), { count: 12 })

interface PetalData {
  i: number
  style: Record<string, string>
}

// SSR安全: 客户端才生成随机位置
const petals = ref<PetalData[]>([])

onMounted(() => {
  petals.value = Array.from({ length: props.count }, (_, i) => ({
    i,
    style: {
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 15}s`,
      animationDuration: `${10 + Math.random() * 15}s`,
      width: `${10 + Math.random() * 14}px`,
      height: `${10 + Math.random() * 14}px`,
      opacity: String(0.15 + Math.random() * 0.3),
      color: `hsl(${340 + Math.random() * 20}, 70%, 70%)`,
    },
  }))
})
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
  10% { opacity: 1; }
  90% { opacity: 0.6; }
  100% {
    transform: translateY(105vh) rotate(540deg) translateX(80px);
    opacity: 0;
  }
}
</style>
