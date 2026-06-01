<template>
  <button
    v-show="visible"
    class="back-to-top-btn"
    :class="{ show: visible }"
    @click="scrollToTop"
    aria-label="回到顶部"
    title="回到顶部"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style lang="scss" scoped>
.back-to-top-btn {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 999;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  color: var(--color-gray);
  cursor: pointer;
  opacity: 0;
  transform: translateY(16px);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;

  &.show {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  &:hover {
    color: var(--color-accent);
    border-color: var(--color-accent);
    box-shadow: 0 4px 20px rgba(254, 150, 0, 0.25);
    transform: translateY(-2px);
  }

  svg {
    width: 22px;
    height: 22px;
  }
}

html.dark & {
  background: #1e1e1e;
  border-color: #333;
}
</style>
