<template>
  <section v-if="current" class="post-navigation" aria-label="文章导航与推荐">
    <nav class="post-pagination" aria-label="上一篇和下一篇">
      <a v-if="older" :href="withBase(older.href)" class="post-link post-link--older">
        <span>← 上一篇</span>
        <strong>{{ older.title }}</strong>
      </a>
      <span v-else class="post-link post-link--empty" aria-hidden="true"></span>
      <a v-if="newer" :href="withBase(newer.href)" class="post-link post-link--newer">
        <span>下一篇 →</span>
        <strong>{{ newer.title }}</strong>
      </a>
    </nav>

    <div v-if="related.length" class="related-posts">
      <h2>相关文章</h2>
      <div class="related-grid">
        <a v-for="post in related" :key="post.href" :href="withBase(post.href)" class="related-card">
          <strong>{{ post.title }}</strong>
          <span>{{ post.tags.slice(0, 3).join(' · ') }} · 阅读 {{ post.readingTime }} 分钟</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { data as posts } from '../../posts.data.mjs'

const route = useRoute()
const { site } = useData()

function normalized(path: string) {
  return path.replace(site.value.base, '/').replace(/^\//, '').replace(/\/$/, '')
}

function withBase(path: string) {
  return site.value.base + path.replace(/^\//, '')
}

const currentIndex = computed(() => posts.findIndex((post) => normalized(route.path) === post.href))
const current = computed(() => currentIndex.value >= 0 ? posts[currentIndex.value] : null)
const newer = computed(() => currentIndex.value > 0 ? posts[currentIndex.value - 1] : null)
const older = computed(() => currentIndex.value >= 0 && currentIndex.value < posts.length - 1 ? posts[currentIndex.value + 1] : null)
const related = computed(() => {
  if (!current.value) return []
  const tags = new Set(current.value.tags)
  return posts
    .filter((post) => post.href !== current.value?.href)
    .map((post) => ({ post, score: post.tags.filter((tag: string) => tags.has(tag)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.post.create - a.post.create)
    .slice(0, 3)
    .map(({ post }) => post)
})
</script>

<style scoped>
.post-navigation { margin: 48px 0 24px; border-top: 1px solid var(--vp-c-divider); padding-top: 28px; }
.post-pagination { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.post-link { display: flex; min-height: 96px; flex-direction: column; gap: 8px; padding: 18px; border: 1px solid var(--vp-c-divider); border-radius: 16px; color: var(--vp-c-text-1); background: var(--vp-c-bg-soft); transition: border-color .2s, transform .2s; }
.post-link:hover { border-color: var(--sakura-pink); transform: translateY(-2px); }
.post-link span { color: var(--vp-c-text-3); font-size: 12px; }
.post-link strong { line-height: 1.5; }
.post-link--newer { text-align: right; }
.post-link--empty { visibility: hidden; }
.related-posts { margin-top: 34px; }
.related-posts h2 { margin: 0 0 16px; border: 0; font-size: 20px; }
.related-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.related-card { display: flex; flex-direction: column; gap: 10px; padding: 16px; border: 1px solid var(--vp-c-divider); border-radius: 14px; color: var(--vp-c-text-1); }
.related-card:hover { border-color: var(--sakura-pink); }
.related-card strong { font-size: 14px; line-height: 1.5; }
.related-card span { color: var(--vp-c-text-3); font-size: 11px; }
@media (max-width: 700px) {
  .post-pagination, .related-grid { grid-template-columns: 1fr; }
  .post-link--empty { display: none; }
  .post-link--newer { text-align: left; }
}
</style>
