<template>
  <div class="toc-widget">
    <h4 class="toc-title">📑 目录</h4>
    <nav class="toc-nav">
      <ul class="toc-list">
        <li
          v-for="h in headers"
          :key="h.slug"
          :class="['toc-item', `toc-level-${h.level}`, { active: activeId === h.slug }]"
        >
          <a :href="`#${h.slug}`" class="toc-link" @click.prevent="scrollTo(h.slug)">
            {{ h.title }}
          </a>
        </li>
      </ul>
    </nav>

    <!-- 回到顶部 -->
    <button class="back-to-top" @click="scrollToTop" title="回到顶部">
      <svg class="arrow-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Header } from 'vitepress'

defineProps<{
  headers: Header[]
  activeId: string
}>()

function scrollTo(slug: string) {
  const el = document.getElementById(slug)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.pushState(null, '', `#${slug}`)
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
.toc-widget {
  position: relative;
}

.toc-title {
  font-size: 14px;
  color: var(--color-gray);
  margin: 0 0 12px;
  font-weight: 600;
}

.toc-nav {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-item {
  margin-bottom: 4px;

  &.toc-level-2 { padding-left: 0; }
  &.toc-level-3 { padding-left: 16px; }
  &.toc-level-4 { padding-left: 32px; }
}

.toc-link {
  display: block;
  padding: 4px 8px;
  font-size: 13px;
  color: var(--color-gray);
  border-radius: 4px;
  border-left: 2px solid transparent;
  transition: all 0.2s;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: var(--color-accent);
    background: rgba(254, 150, 0, 0.05);
  }
}

.toc-item.active .toc-link {
  color: var(--color-accent);
  border-left-color: var(--color-accent);
  background: rgba(254, 150, 0, 0.08);
  font-weight: 500;
}

.back-to-top {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 16px;
  padding: 8px;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-gray);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: var(--color-accent);
    border-color: var(--color-accent);
  }
}

.arrow-up {
  width: 18px;
  height: 18px;
}
</style>
