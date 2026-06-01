<template>
  <article class="article-page">
    <!-- 文章顶部横幅 -->
    <div class="article-hero" :style="heroStyle">
      <div class="article-hero-meta">
        <h1 class="article-title">{{ page.title }}</h1>
        <div class="article-info">
          <span class="info-item" v-if="author">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {{ author }}
          </span>
          <span class="info-item" v-if="dateStr">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {{ dateStr }}
          </span>
          <span class="info-item" v-if="tags.length">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            <a
              v-for="t in tags" :key="t"
              :href="`${base}tags/?q=${t}`"
              class="article-tag"
            >{{ t }}</a>
          </span>
        </div>
      </div>
    </div>

    <!-- 文章布局: 左右 -->
    <div class="article-layout">
      <div class="article-body">
        <Content class="article-content markdown-body" />
      </div>

      <!-- 侧边目录 -->
      <aside class="article-toc-sidebar">
        <TocWidget :headers="page.headers" :active-id="activeId" />
      </aside>
    </div>

    <!-- 上一篇 / 下一篇 -->
    <nav class="article-pager" v-if="prev || next">
      <a v-if="prev" :href="base + prev.href" class="pager-link prev">
        <span class="pager-label">
          <svg class="pager-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          上一篇
        </span>
        <span class="pager-title">{{ prev.title }}</span>
      </a>
      <span v-else class="pager-link placeholder"></span>

      <a v-if="next" :href="base + next.href" class="pager-link next">
        <span class="pager-label">
          下一篇
          <svg class="pager-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </span>
        <span class="pager-title">{{ next.title }}</span>
      </a>
      <span v-else class="pager-link placeholder"></span>
    </nav>
  </article>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useData, useRoute } from 'vitepress'
import { data as posts } from '../../posts.data.mjs'
import TocWidget from './TocWidget.vue'
import { throttleAndDebounce } from './utils'

const { page, theme, site } = useData()
const base = site.value.base
const route = useRoute()

const author = theme.value.name || '谭海平'

// 文章元数据
const currentPost = computed(() =>
  posts.find((p: any) => p.href === route.path.replace(base, ''))
)

const tags = computed(() => {
  const fm = page.value.frontmatter
  return fm.tags || currentPost.value?.tags || []
})

const dateStr = computed(() => {
  const fm = page.value.frontmatter
  const d = fm.date || (currentPost.value?.create && new Date(currentPost.value.create))
  return d ? new Date(d).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : ''
})

const heroStyle = computed(() => {
  const cover = page.value.frontmatter.cover || theme.value.cover
  return cover
    ? `background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${cover})`
    : ''
})

// 上一篇 / 下一篇
const idx = computed(() => posts.findIndex((p: any) => p.href === route.path.replace(base, '')))
const prev = computed(() => idx.value > 0 ? posts[idx.value - 1] : null)
const next = computed(() => idx.value >= 0 && idx.value < posts.length - 1 ? posts[idx.value + 1] : null)

// TOC active heading
const activeId = ref('')
function updateActive() {
  const headers = page.value.headers
  if (!headers.length) return
  for (let i = headers.length - 1; i >= 0; i--) {
    const el = document.getElementById(headers[i].slug)
    if (el && el.getBoundingClientRect().top < 120) {
      activeId.value = headers[i].slug
      return
    }
  }
  activeId.value = headers[0]?.slug || ''
}

const onScroll = throttleAndDebounce(updateActive, 150)
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style lang="scss" scoped>
/* ===== 文章Hero ===== */
.article-hero {
  height: 320px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  margin-top: 64px;
  position: relative;
  background-image: linear-gradient(135deg, #ffb7c5, #ffe4b5);
}

.article-hero-meta {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px 32px;
  width: 100%;
  color: #fff;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px;
  line-height: 1.3;
}

.article-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  opacity: 0.9;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.article-tag {
  color: rgba(255, 255, 255, 0.85);
  padding: 2px 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 12px;
  transition: background 0.2s;
  margin-left: 4px;

  &:hover { background: rgba(255, 255, 255, 0.35); }
}

/* ===== 文章布局 ===== */
.article-layout {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 24px;
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 48px;
  align-items: start;
}

.article-body {
  min-width: 0;
}

.article-toc-sidebar {
  position: sticky;
  top: 88px;
}

/* ===== 分页器 ===== */
.article-pager {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  border-top: 1px solid var(--color-border);
}

.pager-link {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  color: var(--color-text);

  html.dark & {
    background: #1e1e1e;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    color: var(--color-accent);
  }

  &.prev { text-align: left; }
  &.next { text-align: right; }
  &.placeholder { visibility: hidden; }
}

.pager-label {
  font-size: 13px;
  color: var(--color-gray);
  display: flex;
  align-items: center;
  gap: 4px;

  .next & {
    justify-content: flex-end;
  }
}

.pager-arrow {
  width: 16px;
  height: 16px;
}

.pager-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 900px) {
  .article-layout {
    grid-template-columns: 1fr;
  }
  .article-toc-sidebar {
    display: none;
  }
  .article-hero { height: 200px; }
  .article-title { font-size: 24px; }
  .article-pager { grid-template-columns: 1fr; }
}
</style>
