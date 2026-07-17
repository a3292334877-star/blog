<template>
  <nav class="home-categories" aria-label="文章分类">
    <a v-for="category in categories" :key="category.label" :href="withBase(category.href)">
      <span class="category-icon" aria-hidden="true">{{ category.icon }}</span>
      <span>
        <strong>{{ category.label }}</strong>
        <small>{{ category.description }}</small>
      </span>
      <span class="category-arrow" aria-hidden="true">→</span>
    </a>
  </nav>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'

const categories = [
  { icon: '💻', label: '编程教程', description: 'Java · C++ · Linux', href: '/tags/?q=教程' },
  { icon: '📐', label: '数学笔记', description: '高数 · 线性代数', href: '/tags/?q=高等数学' },
  { icon: '📚', label: '专插本', description: '真题 · 备考资料', href: '/tags/?q=专插本' },
  { icon: '🌸', label: '生活随笔', description: '日常 · ACGN', href: '/tags/?q=生活' },
]
</script>

<style scoped>
.home-categories { width: min(1180px, calc(100% - 48px)); margin: 28px auto 4px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.home-categories a { min-width: 0; display: flex; align-items: center; gap: 12px; padding: 16px; border: 1px solid var(--vp-c-divider); border-radius: 16px; color: var(--vp-c-text-1); background: var(--vp-c-bg); box-shadow: var(--site-shadow-sm); transition: transform .2s, border-color .2s; }
.home-categories a:hover { transform: translateY(-3px); border-color: var(--sakura-pink); }
.category-icon { flex: 0 0 auto; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 12px; background: var(--sakura-light); font-size: 19px; }
.home-categories strong, .home-categories small { display: block; }
.home-categories strong { font-size: 14px; }
.home-categories small { margin-top: 3px; color: var(--vp-c-text-3); font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.category-arrow { margin-left: auto; color: var(--accent-color); }
@media (max-width: 820px) { .home-categories { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 520px) {
  .home-categories { width: calc(100% - 28px); margin-top: 18px; gap: 9px; }
  .home-categories a { padding: 12px 10px; gap: 9px; }
  .category-icon { width: 32px; height: 32px; font-size: 16px; }
  .category-arrow { display: none; }
}
</style>
