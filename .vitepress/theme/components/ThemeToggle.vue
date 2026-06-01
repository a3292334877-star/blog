<template>
  <button
    class="theme-toggle"
    @click="toggle"
    :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'"
    :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
  >
    <!-- 太阳图标 -->
    <svg v-if="isDark" class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
    <!-- 月亮图标 -->
    <svg v-else class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const KEY = 'blog-theme'
const isDark = ref(false)

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  isDark.value = dark
  localStorage.setItem(KEY, dark ? 'dark' : 'light')
}

function toggle() {
  applyTheme(!isDark.value)
}

onMounted(() => {
  const saved = localStorage.getItem(KEY)
  if (saved === 'dark') {
    applyTheme(true)
  } else if (saved === 'light') {
    applyTheme(false)
  } else {
    // 跟随系统
    applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches)
  }
})

// 监听系统变化
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(KEY)) {
      applyTheme(e.matches)
    }
  })
}
</script>

<style lang="scss" scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 8px;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  color: var(--color-gray);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: var(--color-accent);
    border-color: var(--color-accent);
    background: rgba(254, 150, 0, 0.08);
  }
}

.toggle-icon {
  width: 18px;
  height: 18px;
}
</style>
