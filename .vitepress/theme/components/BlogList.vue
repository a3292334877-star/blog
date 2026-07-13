<template>
  <section class="blog-list-section">
    <h2 class="section-heading">
      <span class="icon">📖</span> 文章列表
    </h2>

    <div class="post-grid">
      <article
        v-for="(p, i) in posts"
        :key="p.href"
        class="post-card"
        :style="{ animationDelay: i * 80 + 'ms' }"
      >
        <a :href="withBase(p.href)" class="card-cover" v-if="p.cover">
          <img :src="p.cover" :alt="p.title" loading="lazy" />
        </a>
        <a :href="withBase(p.href)" class="card-cover card-cover--placeholder" v-else aria-hidden="true">
          <span class="placeholder-icon">🌸</span>
        </a>
        <div class="card-body">
          <time class="card-date">{{ fmtDate(p.create) }}</time>
          <a :href="withBase(p.href)" class="card-title">{{ p.title }}</a>
          <div class="card-excerpt" v-html="p.excerpt"></div>
          <div class="card-tags" v-if="p.tags?.length">
            <a
              v-for="t in p.tags"
              :key="t"
              :href="tagHref(t)"
              class="card-tag"
            >🏷️ {{ t }}</a>
          </div>
        </div>
      </article>
    </div>

    <div v-if="!posts.length" class="empty">还没有文章~</div>
  </section>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { data as posts } from '../../posts.data.mjs'

const { site } = useData()
const base = site.value.base

function withBase(p: string) {
  return base + p.replace(/^\//, '')
}

function tagHref(tag: string) {
  return withBase(`tags/?q=${encodeURIComponent(tag)}`)
}

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}
</script>

<style scoped>
.blog-list-section {
  width: 100%;
  margin: 0 auto;
  padding: 32px 0;
}

.section-heading {
  font-size: 22px;
  margin-bottom: 28px;
}

/* 2 列卡片网格，窄屏自动单列 */
.post-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
@media (max-width: 720px) {
  .post-grid { grid-template-columns: 1fr; }
}

.post-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s;
  /* 入场 stagger 动画 */
  opacity: 0;
  transform: translateY(24px);
  animation: card-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
@keyframes card-in {
  to { opacity: 1; transform: translateY(0); }
}

.post-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(254,150,0,0.18);
  border-color: var(--sakura-pink);
}

/* 封面图 */
.card-cover {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--sakura-light);
}
.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}
.post-card:hover .card-cover img {
  transform: scale(1.05);
}

/* 无封面占位 */
.card-cover--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--sakura-pink), var(--sakura-warm));
}
.placeholder-icon {
  font-size: 44px;
  opacity: 0.85;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.1));
}

.card-body {
  padding: 20px 22px 22px;
}

.card-date {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.card-title {
  display: block;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.4;
  margin: 8px 0 10px;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
  /* 两行省略，保持卡片高度一致 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-title:hover { color: var(--accent-color); }

.card-excerpt {
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-excerpt :deep(p) { margin: 0; }

.card-tags {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.card-tag {
  font-size: 12px;
  padding: 2px 10px;
  background: var(--sakura-light);
  border-radius: 12px;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
}
.card-tag:hover {
  background: var(--sakura-pink);
  color: #fff;
}

.empty {
  text-align: center;
  padding: 60px 0;
  color: var(--vp-c-text-3);
}
</style>
