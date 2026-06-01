<template>
  <!-- 阅读进度条 (文章页) -->
  <ReadingProgress v-if="frontmatter.layout === 'article'" />

  <!-- 樱花飘落背景 (首页) -->
  <SakuraDrop v-if="frontmatter.layout === 'home'" :count="15" />

  <!-- 自定义导航栏 -->
  <CustomNav />

  <main>
    <!-- 首页: Hero + 文章列表 + 时间线 -->
    <template v-if="frontmatter.layout === 'home'">
      <HeroBanner />
      <BlogList :posts="posts" />
      <Timeline />
    </template>

    <!-- 标签页 -->
    <TagPage v-else-if="frontmatter.layout === 'tags'" />

    <!-- 文章页 -->
    <ArticlePage v-else-if="frontmatter.layout === 'article'" />

    <!-- 其他页面 (about, posts/index 等) -->
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
import { useData } from 'vitepress'
import { data as posts } from '../posts.data.mjs'

// 组件导入
import BlogList from './components/BlogList.vue'
import CustomNav from './components/CustomNav.vue'
import CustomFooter from './components/CustomFooter.vue'
import HeroBanner from './components/HeroBanner.vue'
import ArticlePage from './components/ArticlePage.vue'
import TagPage from './components/TagPage.vue'
import Timeline from './components/Timeline.vue'
import BackToTop from './components/BackToTop.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import SakuraDrop from './components/SakuraDrop.vue'

const { frontmatter } = useData()
</script>

<style lang="scss">
/* ===== 暗黑模式覆盖 ===== */
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
