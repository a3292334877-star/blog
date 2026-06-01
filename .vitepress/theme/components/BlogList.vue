<template>
  <section class="blog-list-section">
    <h2 class="section-heading">
      <span class="icon">📖</span> 文章列表
    </h2>

    <article
      v-for="p in posts"
      :key="p.href"
      class="post-card"
    >
      <div class="card-body">
        <time class="card-date">{{ fmtDate(p.create) }}</time>
        <a :href="withBase(p.href)" class="card-title">{{ p.title }}</a>
        <div class="card-excerpt" v-html="p.excerpt"></div>
        <div class="card-tags" v-if="p.tags?.length">
          <a
            v-for="t in p.tags"
            :key="t"
            :href="withBase(`tags/?q=${t}`)"
            class="card-tag"
          >🏷️ {{ t }}</a>
        </div>
      </div>
    </article>

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

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}
</script>

<style scoped>
.blog-list-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 24px;
}

.section-heading {
  font-size: 22px;
  margin-bottom: 28px;
}

.post-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(254,150,0,0.15);
  border-color: var(--sakura-pink);
}

.card-date {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.card-title {
  display: block;
  font-size: 22px;
  font-weight: 700;
  margin: 10px 0;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}
.card-title:hover { color: var(--accent-color); }

.card-excerpt {
  font-size: 15px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}
.card-excerpt :deep(p) { margin: 0; }

.card-tags {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.card-tag {
  font-size: 13px;
  color: var(--vp-c-text-2);
  transition: color 0.2s;
}
.card-tag:hover { color: var(--accent-color); }

.empty {
  text-align: center;
  padding: 60px 0;
  color: var(--vp-c-text-3);
}
</style>
