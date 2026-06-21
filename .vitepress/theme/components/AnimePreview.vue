<template>
  <section class="home-preview anime-preview">
    <h2 class="section-heading">
      <span class="icon">🎬</span> 最近追番
      <a :href="withBase('anime/')" class="more-link">全部 →</a>
    </h2>

    <div class="anime-grid">
      <a
        v-for="a in anime"
        :key="a.name"
        :href="withBase('anime/')"
        class="anime-card"
        :style="{ animationDelay: indexDelay(a) }"
      >
        <div class="anime-rank">#{{ rank(a) }}</div>
        <div class="anime-info">
          <div class="anime-name">{{ a.name }}</div>
          <div class="anime-year">{{ a.year }}</div>
        </div>
        <div class="anime-remark">{{ a.remark }}</div>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { data } from '../../home.data.mjs'

const { site } = useData()
const base = site.value.base
function withBase(p: string) { return base + p.replace(/^\//, '') }

const anime = data.anime
function rank(a: { name: string }) { return anime.findIndex(x => x.name === a.name) + 1 }
function indexDelay(a: { name: string }) {
  const i = anime.findIndex(x => x.name === a.name)
  return i * 60 + 'ms'
}
</script>

<style scoped>
.home-preview {
  max-width: 1080px;
  margin: 0 auto;
  padding: 32px 24px;
}

.section-heading {
  font-size: 22px;
  margin-bottom: 24px;
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.more-link {
  margin-left: auto;
  font-size: 13px;
  font-weight: 400;
  color: var(--vp-c-text-3);
  transition: color 0.2s;
}
.more-link:hover { color: var(--accent-color); }

.anime-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
@media (max-width: 720px) {
  .anime-grid { grid-template-columns: 1fr; }
}

.anime-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
  opacity: 0;
  transform: translateY(12px);
  animation: card-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
@keyframes card-in {
  to { opacity: 1; transform: translateY(0); }
}
.anime-card:hover {
  transform: translateY(-3px);
  border-color: var(--sakura-pink);
  box-shadow: 0 8px 24px rgba(245,184,196,0.2);
}

.anime-rank {
  flex-shrink: 0;
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--sakura-pink), var(--sakura-warm));
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.anime-info {
  flex-shrink: 0;
  min-width: 0;
}
.anime-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}
.anime-year {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: 2px;
}

.anime-remark {
  flex: 1;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-width: 0;
}
</style>
