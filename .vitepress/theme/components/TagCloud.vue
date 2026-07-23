<template>
  <section class="tag-page" aria-labelledby="tag-page-title">
    <h1 id="tag-page-title">🏷️ 标签</h1>
    <p class="sub">共 {{ Object.keys(tagMap).length }} 个标签，{{ posts.length }} 篇文章</p>

    <!-- 标签云 -->
    <div class="cloud">
      <button
        v-for="(count, tag) in tagMap"
        :key="tag"
        :class="['tag', { active: active === tag }]"
        :style="{ fontSize: 0.8 + (count.length / maxCount) * 0.5 + 'rem' }"
        @click="select(tag)"
      >{{ tag }} <span class="n">{{ count.length }}</span></button>
    </div>

    <!-- 筛选文章 -->
    <div v-if="active" class="filtered">
      <h2>{{ active }} <span class="n">{{ tagMap[active].length }} 篇</span></h2>
      <a v-for="p in tagMap[active]" :key="p.href" :href="withBase(p.href)" class="link">
        <span>{{ p.title }}</span>
        <time>{{ fmt(p.create) }}</time>
      </a>
    </div>

    <!-- 全部分组 -->
    <div v-else>
      <div v-for="(arr, tag) in tagMap" :key="tag" class="group">
        <h2>{{ tag }} <span class="n">{{ arr.length }} 篇</span></h2>
        <a v-for="p in arr" :key="p.href" :href="withBase(p.href)" class="link">
          <span>{{ p.title }}</span>
          <time>{{ fmt(p.create) }}</time>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../../posts.data.mjs'

const { site } = useData()
const base = site.value.base
function withBase(p: string) { return base + p.replace(/^\//, '') }

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

function syncFromUrl() {
  const q = new URLSearchParams(window.location.search).get('q')
  active.value = q && tagMap.value[q] ? q : null
}

// 从 URL 参数读取预选标签
onMounted(syncFromUrl)

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
  box-shadow: 0 4px 12px rgba(254,150,0,0.15);
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
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 16px; border-radius: 8px; color: var(--vp-c-text-1);
  transition: all 0.2s;
}
.link:hover { background: rgba(254,150,0,0.05); color: var(--accent-color); }
.link span { font-size: 15px; }
.link time { font-size: 13px; color: var(--vp-c-text-3); white-space: nowrap; margin-left: 16px; }
</style>
