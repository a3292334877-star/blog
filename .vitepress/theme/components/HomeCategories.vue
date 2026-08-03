<template>
  <nav class="home-categories" aria-label="内容分类">
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
  { icon: '🗾', label: '日语手册', description: '词汇 · 语法 · 变形', href: '/learn/standard-japanese/' },
  { icon: '🌸', label: '生活随笔', description: '日常 · ACGN', href: '/tags/?q=生活' },
]
</script>

<style scoped>
.home-categories { width: min(1180px, calc(100% - 48px)); margin: 28px auto 4px; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 14px; }
.home-categories a { position: relative; min-width: 0; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 16px 28px 16px 16px; border: 1px solid var(--vp-c-divider); border-radius: 16px; color: var(--vp-c-text-1); background: var(--vp-c-bg); box-shadow: var(--site-shadow-sm); text-align: center; transition: transform .2s, border-color .2s; }
.home-categories a:hover { transform: translateY(-3px); border-color: var(--sakura-pink); }
.category-icon { flex: 0 0 auto; display: grid; place-items: center; width: 38px; height: 38px; border-radius: 12px; background: var(--sakura-light); font-size: 19px; }
.home-categories strong, .home-categories small { display: block; }
.home-categories strong { font-size: 16px; line-height: 1.35; }
.home-categories small { margin-top: 4px; color: var(--vp-c-text-3); font-size: 13px; line-height: 1.35; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.category-arrow { position: absolute; right: 13px; top: 50%; color: var(--accent-color); transform: translateY(-50%); }
@media (min-width: 821px) and (max-width: 1050px) {
  .home-categories { grid-template-columns: repeat(6, minmax(0, 1fr)); }
  .home-categories a { grid-column: span 2; }
  .home-categories a:nth-last-child(2) { grid-column: 2 / span 2; }
  .home-categories a:last-child { grid-column: 4 / span 2; }
}
@media (max-width: 820px) { .home-categories { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 820px) {
  .home-categories a:last-child:nth-child(odd) {
    grid-column: 1 / -1;
    width: calc((100% - 14px) / 2);
    justify-self: center;
  }
}
@media (max-width: 520px) {
  .home-categories { width: calc(100% - 28px); margin-top: 18px; gap: 9px; }
  .home-categories a { min-height: 108px; flex-direction: column; gap: 7px; padding: 13px 8px; }
  .home-categories a:last-child:nth-child(odd) { width: calc((100% - 9px) / 2); }
  .category-icon { width: 38px; height: 38px; font-size: 19px; }
  .home-categories strong { font-size: 17px; }
  .home-categories small { margin-top: 3px; font-size: 13.5px; white-space: normal; }
  .category-arrow { display: none; }
}
</style>
