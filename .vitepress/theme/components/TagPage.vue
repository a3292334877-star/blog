<template>
  <div class="tag-page">
    <!-- 标签页头 -->
    <section class="tag-header">
      <h1>🏷️ 标签</h1>
      <p class="tag-subtitle">
        共 {{ Object.keys(tagMap).length }} 个标签，{{ posts.length }} 篇文章
      </p>
      <!-- 标签云 -->
      <div class="tag-cloud">
        <a
          v-for="(count, tag) in tagMap"
          :key="tag"
          :class="['tag-badge', { active: activeTag === tag }]"
          @click="selectTag(tag)"
          :style="tagStyle(count)"
        >
          <span>{{ tag }}</span>
          <span class="badge-count">{{ count }}</span>
        </a>
      </div>
    </section>

    <!-- 按选中标签筛选 -->
    <BlogList
      v-if="activeTag"
      :posts="tagMap[activeTag]"
      :click="selectTag"
    />

    <!-- 全部分组 -->
    <template v-else>
      <div v-for="(tagPosts, tag) in tagMap" :key="tag" class="tag-section">
        <h2 class="tag-section-title">
          <span>{{ tag }}</span>
          <span class="tag-section-count">{{ tagPosts.length }} 篇</span>
        </h2>
        <div class="tag-section-posts">
          <a
            v-for="p in tagPosts"
            :key="p.href"
            :href="base + p.href"
            class="tag-post-link"
          >
            <span class="tag-post-title">{{ p.title }}</span>
            <span class="tag-post-date">{{ formatDate(p.create) }}</span>
          </a>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../../posts.data.mjs'
import BlogList from './BlogList.vue'

const base = useData().site.value.base
const activeTag = ref<string | null>(null)

// 构建标签->文章映射
const tagMap = computed(() => {
  const map: Record<string, any[]> = {}
  for (const post of posts) {
    if (!post.tags) continue
    for (const tag of post.tags) {
      if (!map[tag]) map[tag] = []
      map[tag].push(post)
    }
  }
  return map
})

function selectTag(tag: string) {
  activeTag.value = activeTag.value === tag ? null : tag
}

function tagStyle(count: number) {
  const lengths = Object.values(tagMap.value).map((a: any) => a.length)
  const max = Math.max(...lengths)
  const scale = 0.8 + (count / max) * 0.5
  return { fontSize: `${scale}rem` }
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  })
}
</script>

<style lang="scss" scoped>
.tag-page {
  margin-top: 64px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 40px 24px;
}

.tag-header {
  text-align: center;
  margin-bottom: 40px;

  h1 {
    font-size: 32px;
    margin-bottom: 8px;
  }
}

.tag-subtitle {
  color: var(--color-gray);
  font-size: 14px;
  margin-bottom: 28px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 16px;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  color: var(--color-gray);
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;

  html.dark & {
    background: #1e1e1e;
  }

  &:hover {
    color: var(--color-accent);
    border-color: var(--color-accent);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(254, 150, 0, 0.15);
  }

  &.active {
    background: var(--color-accent);
    color: #fff;
    border-color: var(--color-accent);
  }
}

.badge-count {
  font-size: 11px;
  background: rgba(0, 0, 0, 0.06);
  padding: 1px 6px;
  border-radius: 10px;
}

.tag-badge.active .badge-count {
  background: rgba(255, 255, 255, 0.25);
}

.tag-section {
  margin-bottom: 36px;
}

.tag-section-title {
  font-size: 20px;
  margin-bottom: 12px;
  display: flex;
  align-items: baseline;
  gap: 10px;

  .tag-section-count {
    font-size: 13px;
    color: var(--color-gray);
    font-weight: 400;
  }
}

.tag-section-posts {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tag-post-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-radius: 8px;
  color: var(--color-text);
  transition: all 0.2s;

  &:hover {
    background: rgba(254, 150, 0, 0.05);
    color: var(--color-accent);
  }
}

.tag-post-title {
  font-size: 15px;
}

.tag-post-date {
  font-size: 13px;
  color: var(--color-gray);
  white-space: nowrap;
  margin-left: 16px;
}
</style>
