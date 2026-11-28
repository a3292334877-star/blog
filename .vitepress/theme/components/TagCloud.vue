<template>
  <section class="tag-page" aria-labelledby="tag-page-title">
    <h1 id="tag-page-title">🏷️ 标签</h1>
    <p class="sub">共 {{ Object.keys(tagMap).length }} 个标签，{{ posts.length }} 篇文章</p>

    <!-- 标签云 -->
    <div class="cloud">
      <button
        v-for="[tag, arr] in sortedTags"
        :key="tag"
        type="button"
        :class="['tag', { active: active === tag }]"
        :aria-pressed="active === tag"
        :style="{ fontSize: (0.8 + (arr.length / maxCount) * 0.5).toFixed(3) + 'rem' }"
        @click="select(tag)"
      >{{ tag }} <span class="n">{{ arr.length }}</span></button>
    </div>

    <!-- 筛选文章 -->
    <div v-if="active && tagMap[active]" class="filtered">
      <h2>{{ active }} <span class="n">{{ tagMap[active].length }} 篇</span></h2>
      <a v-for="p in tagMap[active]" :key="p.href" :href="resolveSitePath(p.href)" class="link">
        <span class="link-title">{{ p.title }}</span>
        <span class="link-meta">
          <span class="link-reading">{{ p.readingTime }} 分钟</span>
          <time>{{ fmt(p.create) }}</time>
        </span>
      </a>
    </div>

    <!-- 全部分组 -->
    <div v-else>
      <div v-for="[tag, arr] in sortedTags" :key="tag" class="group">
        <h2>{{ tag }} <span class="n">{{ arr.length }} 篇</span></h2>
        <a v-for="p in arr" :key="p.href" :href="resolveSitePath(p.href)" class="link">
          <span class="link-title">{{ p.title }}</span>
          <span class="link-meta">
            <span class="link-reading">{{ p.readingTime }} 分钟</span>
            <time>{{ fmt(p.create) }}</time>
          </span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { resolveSitePath } from '../utils'
// @ts-expect-error VitePress 在构建时注入 data 导出，.mjs 源文件里没有这个具名导出。
import { data as posts } from '../../posts.data.mjs'

const active = ref<string | null>(null)

const tagMap = computed(() => {
  const m: Record<string, typeof posts> = {}
  for (const p of posts) {
    for (const t of p.tags || []) {
      if (!m[t]) m[t] = []
      m[t].push(p)
    }
  }
  return m
})

const sortedTags = computed(() =>
  Object.entries(tagMap.value).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'zh-CN')),
)

function syncFromUrl() {
  const q = new URLSearchParams(window.location.search).get('q')
  active.value = q && tagMap.value[q] ? q : null
}

// 首次挂载后读取 URL 参数；浏览器前进/后退时同步筛选状态。
onMounted(() => {
  syncFromUrl()
  window.addEventListener('popstate', syncFromUrl)
})
onUnmounted(() => window.removeEventListener('popstate', syncFromUrl))

const maxCount = computed(() => Math.max(...Object.values(tagMap.value).map(a => a.length), 1))

function select(tag: string) {
  active.value = active.value === tag ? null : tag

  // 同步地址栏，让当前筛选结果可以刷新和分享
  const url = new URL(window.location.href)
  if (active.value) {
    url.searchParams.set('q', active.value)
  } else {
    url.searchParams.delete('q')
  }
  window.history.replaceState(window.history.state, '', url)
}

function fmt(ts: number) {
  return new Date(ts).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
</script>

<style scoped>
.tag-page {
  max-width: 800px; margin: 0 auto; padding: 96px 24px 64px;
}
h1 { font-size: 30px; margin-bottom: 8px; }
.sub { color: var(--vp-c-text-2); font-size: 14px; margin-bottom: 28px; }

.cloud {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 48px;
}
.tag {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 6px 16px; background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider); border-radius: 20px;
  color: var(--vp-c-text-2); cursor: pointer; transition: all 0.2s;
  font-family: inherit;
}
.tag:hover, .tag.active {
  color: var(--accent-color); border-color: var(--accent-color);
  box-shadow: 0 4px 12px rgba(217, 122, 140, 0.2);
}
.tag.active { background: var(--accent-solid); color: #fff; }
.n {
  font-size: 11px; background: rgba(0,0,0,0.06); padding: 1px 6px; border-radius: 10px;
}
.tag.active .n { background: rgba(255,255,255,0.25); }

.group, .filtered { margin-bottom: 32px; }
h2 {
  font-size: 19px; margin-bottom: 10px; display: flex; align-items: baseline; gap: 8px;
}
h2 .n { font-size: 13px; color: var(--vp-c-text-3); font-weight: 400; background: none; }

.link {
  display: flex; justify-content: space-between; align-items: center; gap: 16px;
  padding: 10px 16px; border-radius: 8px; color: var(--vp-c-text-1);
  transition: all 0.2s;
}
.link:hover { background: rgba(217, 122, 140, 0.08); color: var(--accent-color); }
.link-title { font-size: 15px; min-width: 0; }
.link-meta { display: inline-flex; align-items: center; gap: 12px; flex-shrink: 0; }
.link-reading { font-size: 12px; color: var(--vp-c-text-3); }
.link time { font-size: 13px; color: var(--vp-c-text-3); white-space: nowrap; }
@media (max-width: 560px) {
  .link-reading { display: none; }
}
</style>
