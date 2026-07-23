<template>
  <section class="blog-list-section">
    <h2 class="section-heading">
      <span class="icon">📖</span> {{ title }}
      <a v-if="showMore" class="section-more" :href="withBase('/posts/')">查看全部 →</a>
    </h2>

    <div class="post-grid">
      <article
        v-for="(p, i) in visiblePosts"
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
          <div class="card-meta">
            <time class="card-date">{{ fmtDate(p.create) }}</time>
            <span class="reading-time">阅读 {{ p.readingTime }} 分钟</span>
          </div>
          <a :href="withBase(p.href)" class="card-title">{{ p.title }}</a>
          <p class="card-excerpt">{{ p.summary }}</p>
          <div class="card-tags" v-if="p.tags?.length">
            <a
              v-for="t in p.tags.slice(0, 3)"
              :key="t"
              :href="tagHref(t)"
              class="card-tag"
            >🏷️ {{ t }}</a>
            <span v-if="p.tags.length > 3" class="card-tag card-tag--more">
              +{{ p.tags.length - 3 }}
            </span>
          </div>
        </div>
      </article>
    </div>

    <div v-if="!visiblePosts.length" class="empty">还没有文章~</div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../../posts.data.mjs'

const props = withDefaults(defineProps<{
  limit?: number
  title?: string
  showMore?: boolean
}>(), {
  limit: 0,
  title: '最新文章',
  showMore: true,
})

const { site } = useData()
const base = site.value.base

const visiblePosts = computed(() => (
  props.limit > 0 ? posts.slice(0, props.limit) : posts
))

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
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  margin-bottom: 28px;
  letter-spacing: -0.02em;
}
.section-more { margin-left: auto; font-size: 13px; font-weight: 600; color: var(--accent-color); }
.card-meta { display: flex; align-items: center; gap: 10px; }
.reading-time { font-size: 12px; color: var(--vp-c-text-3); }

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
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--site-shadow-sm);
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
  box-shadow: var(--site-shadow-lg);
  border-color: var(--sakura-pink);
}

/* 封面图 */
.card-cover {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
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
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 22px 24px 24px;
}

.card-date {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.card-title {
  font-size: 19px;
  font-weight: 700;
  line-height: 1.4;
  margin: 8px 0 10px;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
  /* 两行省略，保持卡片高度一致 */
  display: -webkit-box;
  min-height: 2.8em;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-title:hover { color: var(--accent-color); }

.card-excerpt {
  min-height: 4.8em;
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 14px;
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
.card-tag--more {
  cursor: default;
  color: var(--accent-color);
}
.card-tag--more:hover {
  background: var(--sakura-light);
  color: var(--accent-color);
}

.empty {
  text-align: center;
  padding: 60px 0;
  color: var(--vp-c-text-3);
}

@media (max-width: 720px) {
  .blog-list-section { padding: 22px 0; }
  .section-heading { margin-bottom: 20px; }
  .post-card { animation-duration: 0.45s; }
  .card-title { min-height: auto; }
  .card-excerpt { min-height: auto; }
}
</style>
