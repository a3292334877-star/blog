<template>
  <section class="timeline-section">
    <h2 class="section-heading">
      <span class="icon">📅</span> 文章时间线
    </h2>

    <div class="timeline">
      <div v-for="(group, year) in grouped" :key="year" class="year-group">
        <div class="year-mark">
          <span class="dot"></span>
          <span class="text">{{ year }}</span>
        </div>

        <div v-for="p in group" :key="p.href" class="item">
          <div class="marker">
            <span class="mdot"></span>
            <span class="mline"></span>
          </div>
          <a :href="withBase(p.href)" class="card">
            <time class="date">{{ fmtShort(p.create) }}</time>
            <span class="title">{{ p.title }}</span>
            <span class="tags" v-if="p.tags?.length">
              <span v-for="t in p.tags" :key="t" class="tag">{{ t }}</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../../posts.data.mjs'

const { site } = useData()
const base = site.value.base

function withBase(p: string) { return base + p.replace(/^\//, '') }

const grouped = computed(() => {
  const m: Record<string, typeof posts> = {}
  for (const p of posts) {
    const y = new Date(p.create).getFullYear().toString()
    if (!m[y]) m[y] = []
    m[y].push(p)
  }
  return m
})

function fmtShort(ts: number) {
  return new Date(ts).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.timeline-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}
.section-heading {
  font-size: 22px;
  margin-bottom: 36px;
}

.timeline { padding-left: 28px; position: relative; }

.year-group { margin-bottom: 32px; }

.year-mark {
  display: flex; align-items: center; gap: 12px;
  margin-left: -28px; margin-bottom: 18px;
  position: sticky; top: 64px; z-index: 2;
  padding: 6px 0;
  background: var(--vp-c-bg);
}
.dot {
  width: 14px; height: 14px; border-radius: 50%;
  background: var(--accent-color);
  box-shadow: 0 0 0 4px rgba(254,150,0,0.2);
  flex-shrink: 0;
}
.text { font-size: 20px; font-weight: 700; color: var(--accent-color); }

.item { display: flex; position: relative; margin-bottom: 18px; }

.marker {
  position: absolute; left: -22px; top: 0; bottom: -18px;
  width: 16px; display: flex; flex-direction: column; align-items: center;
}
.mdot {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--vp-c-divider); margin-top: 10px; flex-shrink: 0;
  transition: all 0.3s;
}
.mline {
  width: 2px; flex: 1; background: var(--vp-c-divider); margin-top: 4px;
}
.item:last-child .mline { display: none; }
.item:hover .mdot {
  background: var(--accent-color);
  box-shadow: 0 0 0 4px rgba(254,150,0,0.15);
  transform: scale(1.3);
}

.card {
  display: flex; align-items: center; gap: 14px; padding: 14px 20px;
  background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider);
  border-radius: 12px; transition: all 0.3s; color: var(--vp-c-text-1);
  width: 100%;
}
.card:hover {
  transform: translateX(6px);
  border-color: var(--sakura-pink);
}
.date { font-size: 13px; color: var(--vp-c-text-3); min-width: 60px; white-space: nowrap; }
.title { font-size: 15px; font-weight: 500; flex: 1; }
.tags { display: flex; gap: 6px; }
.tag {
  font-size: 11px; padding: 2px 8px;
  background: var(--sakura-light); border-radius: 10px;
  color: var(--vp-c-text-2); white-space: nowrap;
}

@media (max-width: 600px) {
  .card { flex-direction: column; align-items: flex-start; gap: 6px; }
}
</style>
