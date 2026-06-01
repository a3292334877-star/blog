<template>
  <div class="bloglist">
    <div class="section">
      📖 文章列表
      <hr />
    </div>
    <article class="card blog-item" v-for="p in posts" :key="p.href">
      <div class="info">
        <div class="date">
          🕐 发布于 {{ formatDate(p.create) }}
        </div>
        <a :href="base + p.href">
          <div class="title">{{ p.title }}</div>
        </a>
        <div class="content" v-html="p.excerpt"></div>
        <div v-if="click" class="tags">
          <a v-for="t in p.tags" :key="t" href="#" @click.prevent="click(t)">
            🏷️ {{ t }}
          </a>
        </div>
        <div v-else class="tags">
          <a v-for="t in p.tags" :key="t" :href="`${base}tags/?q=${t}`">
            🏷️ {{ t }}
          </a>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'

interface PostData {
  title: string
  href: string
  create: number
  update: number
  tags?: string[]
  cover?: string
  excerpt: string
}

const base = useData().site.value.base

const { posts, click = null } = defineProps<{
  posts: PostData[]
  click?: ((tag: string) => void) | null
}>()

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style lang="scss" scoped>
.bloglist {
  max-width: 800px;
  margin: auto;
  padding: 0 24px;

  .section {
    padding-top: 24px;
    font-size: 20px;
    font-weight: 600;
  }

  .date {
    font-size: 14px;
    color: var(--color-gray);
    margin-bottom: 8px;
  }

  .tags {
    margin-top: 12px;
    font-size: 14px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    a {
      color: var(--color-gray);
      transition: color 0.2s ease-out;

      &:hover {
        color: var(--color-accent);
      }
    }
  }

  .card {
    color: var(--color-gray);
    margin: 20px 0;
    padding: 24px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 1px 20px -6px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    html.dark & {
      background: #1e1e1e;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(254, 150, 0, 0.15);
    }
  }

  .title {
    color: #333;
    font-size: 24px;
    margin: 20px 0;
    transition: color 0.2s ease-out;

    html.dark & {
      color: #e0e0e0;
    }

    &:hover {
      color: var(--color-accent);
    }
  }
}

@media (max-width: 720px) {
  .bloglist {
    .card {
      margin: 0;
      border-radius: 0;
      box-shadow: none;

      &:hover {
        box-shadow: none;
        transform: none;
      }
    }
  }
}
</style>
