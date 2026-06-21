<template>
  <DefaultTheme.Layout>
    <template #layout-top>
      <ReadingProgress />
      <SakuraPetals />
      <MusicPlayer />
    </template>

    <template #home-hero-before>
      <HomeHero />
    </template>

    <template #home-hero-after>
      <BlogList />
      <BlogTimeline />
      <SiteStats />
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
    <template #doc-after>
      <GiscusComment />
    </template>

    <template #layout-bottom>
      <Live2DWidget />
      <BackToTop />
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import { computed, watch, nextTick, onMounted } from 'vue'
import mediumZoom from 'medium-zoom'
import HomeHero from './components/HomeHero.vue'
import BlogList from './components/BlogList.vue'
import BlogTimeline from './components/BlogTimeline.vue'
import SakuraPetals from './components/SakuraPetals.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import BackToTop from './components/BackToTop.vue'
import GiscusComment from './components/GiscusComment.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import Live2DWidget from './components/Live2DWidget.vue'

const { frontmatter } = useData()
const route = useRoute()

// Image lightbox — re-attach on route change
onMounted(() => {
  watch(
    () => route.path,
    () => nextTick(() => mediumZoom('.main img', {
      background: 'var(--vp-c-bg)',
      margin: 24,
    })),
    { immediate: true },
  )
})

// 文章页顶部横幅样式
// 使用对象绑定而非字符串拼接，避免 cover 字段含 ; / ) 破坏样式或注入新属性
const docBannerStyle = computed<Record<string, string> | null>(() => {
  if (!frontmatter.value.title) return null
  const cover = frontmatter.value.cover
  if (cover) {
    // 对 cover 中的反斜杠和双引号转义，防止 url("...") 闭合注入
    const safe = String(cover).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    return {
      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url("${safe}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return {
    background: 'linear-gradient(135deg, var(--sakura-pink), var(--sakura-warm))',
  }
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
