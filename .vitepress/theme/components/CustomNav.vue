<template>
  <nav class="custom-nav" :class="{ scrolled }">
    <div class="nav-inner">
      <!-- Logo / 品牌名 -->
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

      <!-- 右侧: 搜索 + 社交 + 主题切换 -->
      <div class="nav-actions">
        <ThemeToggle />
        <a
          v-for="s in social"
          :key="s.icon"
          :href="s.url"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link"
          :aria-label="s.icon"
        >
          <i :class="['fab', s.icon]"></i>
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
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useData, useRoute } from 'vitepress'
import ThemeToggle from './ThemeToggle.vue'

const { theme, site } = useData()
const base = site.value.base
const route = useRoute()
const scrolled = ref(false)
const mobileOpen = ref(false)

// 导航菜单
const menu = [
  { icon: '🏠', name: '首页', url: '' },
  { icon: '📝', name: '文章', url: 'posts/' },
  { icon: '🏷️', name: '标签', url: 'tags/' },
  { icon: '👤', name: '关于', url: 'about/' },
]

// 社交链接
const social = [
  { icon: 'fa-github', url: 'https://github.com/TanHaiping' },
]

function isActive(url: string): boolean {
  if (url === '') return route.path === base || route.path === base + 'index.html'
  return route.path.startsWith(base + url)
}

function onScroll() {
  scrolled.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
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

  .brand-icon {
    font-size: 24px;
  }
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
  gap: 8px;

  .social-link {
    font-size: 20px;
    color: var(--color-gray);
    padding: 6px;
    border-radius: 8px;
    transition: all 0.2s;

    &:hover {
      color: var(--color-accent);
      background: rgba(254, 150, 0, 0.08);
    }
  }
}

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
