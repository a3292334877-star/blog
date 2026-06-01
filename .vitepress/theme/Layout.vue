<template>
  <!-- 阅读进度条 (文章页) -->
  <ReadingProgress v-if="isArticle" />

  <!-- 樱花飘落背景 -->
  <SakuraDrop :count="15" />

  <!-- 自定义导航栏 -->
  <CustomNav />

  <main>
    <!-- 首页: Hero + 文章列表 + 时间线 -->
    <template v-if="path === ''">
      <HeroBanner />
      <BlogList :posts="posts" />
      <Timeline />
    </template>

    <!-- 标签页 -->
    <TagPage v-else-if="path === 'tags/'" />

    <!-- 文章页: Markdown body with TOC -->
    <ArticlePage v-else-if="isArticle" />

    <!-- 其他页面 (about等) -->
    <div v-else class="page-wrapper">
      <Content class="markdown-body" />
    </div>
  </main>

  <!-- 自定义页脚 -->
  <CustomFooter />

  <!-- 回到顶部 -->
  <BackToTop />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useData } from 'vitepress'
import { data as posts } from 'sakura-posts-data'

// Sakura 原有组件
import BlogList from 'vitepress-theme-sakura/BlogList.vue'

// 自定义组件
import CustomNav from './components/CustomNav.vue'
import CustomFooter from './components/CustomFooter.vue'
import HeroBanner from './components/HeroBanner.vue'
import ArticlePage from './components/ArticlePage.vue'
import TagPage from './components/TagPage.vue'
import Timeline from './components/Timeline.vue'
import BackToTop from './components/BackToTop.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import SakuraDrop from './components/SakuraDrop.vue'

const base = useData().site.value.base
const route = useRoute()
const path = computed(() => route.path.replace(base, '').replace('index.html', ''))

// 判断是否为文章页 (posts/ 下的md文件)
const isArticle = computed(() => {
  return path.value.startsWith('posts/') && path.value !== 'posts/'
})
</script>

<style lang="scss">
/* ===== 全局基础样式 ===== */
@import './base.scss';

html {
  scroll-behavior: smooth;
  --sakura-pink: #ffb7c5;
  --sakura-deep: #e88a9a;
  --sakura-light: #fff0f3;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--global-font);
  font-size: 16px;
  overflow-x: hidden;
  background: var(--color-background);
  color: var(--color-text);
}

* { box-sizing: border-box; }
a { text-decoration: none; }
img { max-width: 100%; }
hr {
  border: none;
  border-bottom: 1px dashed var(--color-border);
}

/* 页面通用包装 */
.page-wrapper {
  margin-top: 64px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 40px 24px;
}

/* Markdown 通用内容样式 */
.markdown-body {
  color: var(--color-text);
  line-height: 1.8;
  font-size: 16px;

  h1 { font-size: 32px; margin-bottom: 16px; }
  h2 { font-size: 24px; margin-top: 36px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px dashed var(--color-border); }
  h3 { font-size: 20px; margin-top: 28px; margin-bottom: 12px; }
  p { margin-bottom: 16px; }
  ul, ol { padding-left: 24px; margin-bottom: 16px; }
  li { margin-bottom: 6px; }

  a {
    color: #e58700;
    position: relative;
    transition: color 0.2s;
    &:hover { color: var(--color-accent); }
  }

  blockquote {
    margin: 16px 0;
    padding: 12px 20px;
    border-left: 4px solid var(--sakura-pink);
    background: var(--sakura-light);
    border-radius: 0 8px 8px 0;
    color: #666;
  }

  code {
    font-size: 14px;
    border-radius: 4px;
    padding: 2px 6px;
    background: rgba(27, 31, 35, 0.05);
  }

  pre {
    border-radius: 12px;
    overflow: hidden;
    margin: 16px 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    th, td { padding: 10px 14px; border: 1px solid var(--color-border); text-align: left; }
    th { background: var(--sakura-light); font-weight: 600; }
    tr:nth-child(even) { background: rgba(0,0,0,0.02); }
  }

  img {
    border-radius: 12px;
    max-width: 100%;
  }
}

/* 滚动条 */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: var(--sakura-pink);
}
::-webkit-scrollbar-track { background: transparent; }

/* 选中文字 */
::selection {
  background: var(--sakura-light);
  color: #333;
}

/* ===== 暗黑模式 ===== */
html.dark {
  --color-text: #e0e0e0;
  --color-background: #1a1a1a;
  --color-gray: #999;
  --color-border: #333;

  body {
    background: var(--color-background);
    color: var(--color-text);
  }

  .markdown-body {
    color: var(--color-text);

    blockquote {
      background: rgba(255, 183, 197, 0.08);
      color: #aaa;
    }

    code {
      background: rgba(255, 255, 255, 0.08);
    }

    table th {
      background: rgba(255, 183, 197, 0.1);
    }

    a {
      color: var(--color-accent);
    }
  }

  ::selection {
    background: rgba(255, 183, 197, 0.2);
    color: #fff;
  }
}
</style>
