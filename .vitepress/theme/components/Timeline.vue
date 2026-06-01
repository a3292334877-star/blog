<template>
  <section class="timeline-section">
    <h2 class="timeline-heading">
      <span class="heading-icon">📅</span>
      文章时间线
    </h2>

    <div class="timeline">
      <div
        v-for="(group, year) in groupedPosts"
        :key="year"
        class="timeline-year-group"
      >
        <!-- 年份标记 -->
        <div class="timeline-year">
          <span class="year-dot"></span>
          <span class="year-text">{{ year }}</span>
        </div>

        <!-- 该年份下的文章 -->
        <div
          v-for="post in group"
          :key="post.href"
          class="timeline-item"
        >
          <div class="timeline-marker">
            <div class="marker-dot"></div>
            <div class="marker-line"></div>
          </div>
          <a :href="base + post.href" class="timeline-card">
            <span class="timeline-date">{{ formatMonth(post.create) }}</span>
            <span class="timeline-title">{{ post.title }}</span>
            <span class="timeline-tags" v-if="post.tags?.length">
              <span v-for="t in post.tags" :key="t" class="tl-tag">{{ t }}</span>
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
import { data as posts, type PostData } from 'sakura-posts-data'

const base = useData().site.value.base

// 按年份分组
const groupedPosts = computed(() => {
  const map: Record<string, PostData[]> = {}
  for (const post of posts) {
    const year = new Date(post.create).getFullYear().toString()
    if (!map[year]) map[year] = []
    map[year].push(post)
  }
  return map
})

function formatMonth(ts: number): string {
  return new Date(ts).toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style lang="scss" scoped>
.timeline-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 24px;
}

.timeline-heading {
  font-size: 24px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 10px;

  .heading-icon { font-size: 28px; }
}

.timeline {
  position: relative;
  padding-left: 32px;
}

/* 年份 */
.timeline-year-group {
  margin-bottom: 36px;
}

.timeline-year {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  margin-left: -32px;
  position: sticky;
  top: 80px;
  padding: 8px 0;
  background: var(--color-background);
  z-index: 2;
}

.year-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 4px rgba(254, 150, 0, 0.2);
  flex-shrink: 0;
}

.year-text {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-accent);
}

/* 文章条目 */
.timeline-item {
  display: flex;
  position: relative;
  margin-bottom: 20px;
}

.timeline-marker {
  position: absolute;
  left: -24px;
  top: 0;
  bottom: -20px;
  width: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.marker-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-border);
  margin-top: 10px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.marker-line {
  width: 2px;
  flex: 1;
  background: var(--color-border);
  margin-top: 4px;
}

.timeline-item:hover .marker-dot {
  background: var(--color-accent);
  box-shadow: 0 0 0 4px rgba(254, 150, 0, 0.15);
  transform: scale(1.3);
}

.timeline-item:last-child .marker-line {
  display: none;
}

/* 卡片 */
.timeline-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  color: var(--color-text);
  width: 100%;

  html.dark & {
    background: #1e1e1e;
  }

  &:hover {
    transform: translateX(6px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    color: var(--color-accent);
  }
}

.timeline-date {
  font-size: 13px;
  color: var(--color-gray);
  white-space: nowrap;
  min-width: 60px;
}

.timeline-title {
  font-size: 15px;
  font-weight: 500;
  flex: 1;
}

.timeline-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tl-tag {
  font-size: 11px;
  padding: 2px 8px;
  background: var(--sakura-light);
  border-radius: 10px;
  color: var(--color-gray);
  white-space: nowrap;
}

@media (max-width: 600px) {
  .timeline-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
