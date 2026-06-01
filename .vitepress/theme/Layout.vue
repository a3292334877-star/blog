<template>
  <DefaultTheme.Layout>
    <template #layout-top>
      <SakuraPetals />
    </template>

    <template #home-hero-before>
      <HomeHero />
    </template>

    <template #home-hero-after>
      <BlogList />
      <BlogTimeline />
    </template>

    <template #doc-before>
      <div class="doc-banner" :style="docBannerStyle" v-if="docBannerStyle">
        <h1 class="doc-title">{{ frontmatter.title }}</h1>
        <div class="doc-meta" v-if="frontmatter.date || frontmatter.tags">
          <span v-if="frontmatter.date" class="doc-date">{{ formatDate(frontmatter.date) }}</span>
          <span v-if="frontmatter.tags" class="doc-tags">
            <a v-for="t in frontmatter.tags" :key="t" :href="`/blog/tags/?q=${t}`">{{ t }}</a>
          </span>
        </div>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { computed } from 'vue'
import HomeHero from './components/HomeHero.vue'
import BlogList from './components/BlogList.vue'
import BlogTimeline from './components/BlogTimeline.vue'
import SakuraPetals from './components/SakuraPetals.vue'

const { frontmatter, page } = useData()

// 文章页顶部横幅样式
const docBannerStyle = computed(() => {
  if (!frontmatter.value.title) return ''
  const cover = frontmatter.value.cover
  if (cover) {
    return `background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url(${cover}); background-size: cover; background-position: center;`
  }
  return 'background: linear-gradient(135deg, var(--sakura-pink), var(--sakura-warm));'
})

function formatDate(d: string | Date): string {
  if (!d) return ''
  return new Date(d).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
