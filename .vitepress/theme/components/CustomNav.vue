<template>
  <nav class="custom-nav" :class="{ scrolled }">
    <div class="nav-inner">
      <!-- Logo -->
      <a :href="base" class="brand">
        <span class="brand-icon">🌸</span>
        <span class="brand-text">海平的博客</span>
      </a>

      <!-- 导航链接 -->
      <ul class="nav-links">
        <li v-for="item in menu" :key="item.url">
          <a :href="base + item.url" :class="{ active: isActive(item.url) }">
            <span>{{ item.icon }}</span>
            <span>{{ item.name }}</span>
          </a>
        </li>
      </ul>

      <!-- 右侧: 搜索 + 社交 + 暗黑模式切换 -->
      <div class="nav-actions">
        <!-- 搜索按钮 -->
        <button class="search-btn" @click="showSearch = true" title="搜索 (Ctrl+K)" aria-label="搜索">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>

        <!-- 暗黑模式切换 (使用 VitePress 原生) -->
        <button
          class="appearance-btn"
          @click="toggleAppearance"
          :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'"
          :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
        >
          <!-- 太阳 -->
          <svg v-if="isDark" class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <!-- 月亮 -->
          <svg v-else class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <!-- GitHub -->
        <a
          href="https://github.com/TanHaiping"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link"
          aria-label="GitHub"
        >
          <svg class="social-svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
      </div>

      <!-- 移动端菜单按钮 -->
      <button class="mobile-toggle" @click="mobileOpen = !mobileOpen" aria-label="菜单">
        <span :class="{ open: mobileOpen }"></span>
      </button>
    </div>

    <!-- 移动端展开菜单 -->
    <Transition name="mobile-slide">
      <ul v-if="mobileOpen" class="mobile-menu">
        <li v-for="item in menu" :key="item.url">
          <a :href="base + item.url" @click="mobileOpen = false">
            <span>{{ item.icon }}</span>
            <span>{{ item.name }}</span>
          </a>
        </li>
      </ul>
    </Transition>

    <!-- 搜索弹窗 -->
    <SearchModal :visible="showSearch" @close="showSearch = false" />
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useData, useRoute } from 'vitepress'
import SearchModal from './SearchModal.vue'

const { site, isDark } = useData()
const base = site.value.base
const route = useRoute()
const scrolled = ref(false)
const mobileOpen = ref(false)
const showSearch = ref(false)

const menu = [
  { icon: '🏠', name: '首页', url: '' },
  { icon: '📝', name: '文章', url: 'posts/' },
  { icon: '🏷️', name: '标签', url: 'tags/' },
  { icon: '👤', name: '关于', url: 'about/' },
]

function isActive(url: string): boolean {
  if (url === '') return route.path === base || route.path === base + 'index.html'
  return route.path.startsWith(base + url)
}

function toggleAppearance() {
  isDark.value = !isDark.value
}

function onScroll() {
  scrolled.value = window.scrollY > 50
}

function onKeydown(e: KeyboardEvent) {
  // Ctrl+K or / opens search
  if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !isEditing(e))) {
    e.preventDefault()
    showSearch.value = true
  }
}

function isEditing(e: KeyboardEvent): boolean {
  const el = e.target as HTMLElement
  return el.isContentEditable || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA'
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style lang="scss" scoped>
.custom-nav {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  &.scrolled {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 1px 12px rgba(0, 0, 0, 0.08);
  }
}

html.dark .custom-nav {
  background: rgba(26, 26, 26, 0.85);

  &.scrolled {
    background: rgba(26, 26, 26, 0.95);
  }
}

.nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text);
  font-weight: 700;
  font-size: 18px;
  transition: opacity 0.2s;

  &:hover { opacity: 0.8; }

  .brand-icon { font-size: 24px; }
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 4px;

  a {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 16px;
    border-radius: 8px;
    color: var(--color-gray);
    font-size: 15px;
    transition: all 0.2s ease;

    &:hover {
      color: var(--color-accent);
      background: rgba(254, 150, 0, 0.08);
    }

    &.active {
      color: var(--color-accent);
      background: rgba(254, 150, 0, 0.12);
      font-weight: 600;
    }
  }
}

.nav-actions {
  display: flex;
  gap: 4px;
  align-items: center;

  .social-link {
    color: var(--color-gray);
    padding: 6px;
    border-radius: 8px;
    transition: all 0.2s;
    display: flex;

    &:hover {
      color: var(--color-accent);
      background: rgba(254, 150, 0, 0.08);
    }
  }
}

.social-svg {
  width: 20px;
  height: 20px;
}

/* 搜索按钮 */
.search-btn {
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

  svg {
    width: 18px;
    height: 18px;
  }
}

/* 暗黑模式按钮 */
.appearance-btn {
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

/* 移动端 */
.mobile-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  width: 40px;
  height: 40px;
  position: relative;

  span, span::before, span::after {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--color-text);
    transition: all 0.3s ease;
    position: absolute;
    left: 8px;
  }

  span { top: 19px; }
  span::before { content: ''; top: -7px; }
  span::after { content: ''; top: 7px; }

  span.open {
    background: transparent;
    &::before { top: 0; transform: rotate(45deg); }
    &::after { top: 0; transform: rotate(-45deg); }
  }
}

.mobile-menu {
  display: none;
  list-style: none;
  margin: 0;
  padding: 8px 24px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);

  html.dark & {
    background: rgba(26, 26, 26, 0.95);
  }

  a {
    display: block;
    padding: 12px 16px;
    color: var(--color-gray);
    font-size: 16px;
    border-radius: 8px;
    transition: all 0.2s;

    &:hover {
      color: var(--color-accent);
      background: rgba(254, 150, 0, 0.08);
    }
  }
}

.mobile-slide-enter-active,
.mobile-slide-leave-active {
  transition: all 0.3s ease;
}

.mobile-slide-enter-from,
.mobile-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .nav-links,
  .nav-actions {
    display: none;
  }
  .mobile-toggle {
    display: block;
  }
  .mobile-menu {
    display: block;
  }
}
</style>
