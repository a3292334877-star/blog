<template>
  <div class="progress-bar-wrap">
    <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { throttleAndDebounce } from './utils'

const progress = ref(0)

function update() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  progress.value = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0
}

const onScroll = throttleAndDebounce(update, 50)

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style lang="scss" scoped>
.progress-bar-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 1001;
  background: transparent;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--sakura-pink, #ffb7c5), var(--color-accent, #fe9600));
  transition: width 0.15s ease-out;
  border-radius: 0 2px 2px 0;
}
</style>
