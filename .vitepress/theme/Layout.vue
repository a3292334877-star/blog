<template>
  <DefaultTheme.Layout>
    <template #layout-top>
      <CursorGlow />
      <ReadingProgress v-if="!isHome" />
      <SakuraPetals v-if="isHome" />
    </template>

    <template #home-hero-before>
      <main class="home-main">
        <HomeHero />
        <AboutStrip />
        <HomeCategories />
        <HomeColumns />
        <AnimePreview />
        <ProjectsPreview />
        <ShuoshuoPreview />
        <SiteStats />
      </main>
    </template>

    <template #doc-before>
      <div class="doc-banner" :style="docBannerStyle" v-if="docBannerStyle">
        <nav class="doc-breadcrumb" aria-label="面包屑导航">
          <a :href="withBase('/')">首页</a>
          <template v-if="route.path.startsWith('/posts/')">
            <span aria-hidden="true">/</span>
            <a :href="withBase('/posts/')">文章</a>
          </template>
          <span class="doc-breadcrumb-current-separator" aria-hidden="true">/</span>
          <span class="doc-breadcrumb-current" aria-current="page">{{ frontmatter.title }}</span>
        </nav>
        <h1 class="doc-title">{{ frontmatter.title }}</h1>
        <div class="doc-meta" v-if="frontmatter.date || frontmatter.tags">
          <span v-if="frontmatter.date" class="doc-date">发布于 {{ formatDate(frontmatter.date) }}</span>
          <span v-if="frontmatter.type || frontmatter.tags" class="doc-type">{{ frontmatter.type || inferredType }}</span>
          <span v-if="frontmatter.source" class="doc-source">来源：{{ frontmatter.source }}</span>
          <span v-if="frontmatter.lastUpdated" class="doc-updated">更新于 {{ formatDate(frontmatter.lastUpdated) }}</span>
          <span v-if="frontmatter.tags" class="doc-tags">
            <a v-for="t in frontmatter.tags" :key="t" :href="tagHref(t)">{{ t }}</a>
          </span>
        </div>
      </div>
    </template>
    <template #doc-after>
      <PostNavigation v-if="isPostPage" />
      <GiscusComment v-if="frontmatter.comments !== false" />
    </template>

    <template #layout-bottom>
      <MusicPlayer />
      <Live2DWidget v-if="isHome" />
      <BackToTop />
      <CopyToast />
    </template>
  </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme-without-fonts'
import { useData, useRoute, withBase } from 'vitepress'
import { computed, watch, nextTick, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import BackToTop from './components/BackToTop.vue'
import CursorGlow from './components/CursorGlow.vue'
import CopyToast from './components/CopyToast.vue'
import { inferPostType } from '../post-utils.mjs'
import { normalizeSitePath } from './utils'

const MusicPlayer = defineAsyncComponent(() => import('./components/MusicPlayer.vue'))

const HomeHero = defineAsyncComponent(() => import('./components/HomeHero.vue'))
const AboutStrip = defineAsyncComponent(() => import('./components/AboutStrip.vue'))
const HomeCategories = defineAsyncComponent(() => import('./components/HomeCategories.vue'))
const HomeColumns = defineAsyncComponent(() => import('./components/HomeColumns.vue'))
const AnimePreview = defineAsyncComponent(() => import('./components/AnimePreview.vue'))
const ProjectsPreview = defineAsyncComponent(() => import('./components/ProjectsPreview.vue'))
const ShuoshuoPreview = defineAsyncComponent(() => import('./components/ShuoshuoPreview.vue'))
const SiteStats = defineAsyncComponent(() => import('./components/SiteStats.vue'))
const SakuraPetals = defineAsyncComponent(() => import('./components/SakuraPetals.vue'))
const Live2DWidget = defineAsyncComponent(() => import('./components/Live2DWidget.vue'))
const ReadingProgress = defineAsyncComponent(() => import('./components/ReadingProgress.vue'))
const PostNavigation = defineAsyncComponent(() => import('./components/PostNavigation.vue'))
const GiscusComment = defineAsyncComponent(() => import('./components/GiscusComment.vue'))

const { frontmatter, site } = useData()
const route = useRoute()
const isHome = computed(() => route.path === withBase('/'))
const isPostPage = computed(() => {
  const normalized = normalizeSitePath(route.path, site.value.base)
  return normalized.startsWith('posts/') && normalized !== 'posts'
})

// Image lightbox — re-attach on route change
let zoom: { detach: () => void } | null = null
let zoomRequestId = 0

async function attachZoom() {
  const requestId = ++zoomRequestId
  zoom?.detach()
  zoom = null
  const targets = document.querySelectorAll('.main img:not([data-no-zoom])')
  if (!targets.length) return
  const { default: mediumZoom } = await import('medium-zoom')
  if (requestId !== zoomRequestId) return
  zoom = mediumZoom(targets, {
    background: 'var(--vp-c-bg)',
    margin: 24,
  })
}

onMounted(() => {
  watch(
    () => route.path,
    () => nextTick(() => { void attachZoom() }),
    { immediate: true },
  )
})

onUnmounted(() => {
  zoomRequestId++
  zoom?.detach()
  zoom = null
})

// 文章页顶部横幅样式
// 使用对象绑定而非字符串拼接，避免 cover 字段含 ; / ) 破坏样式或注入新属性
const docBannerStyle = computed<Record<string, string> | null>(() => {
  if (!frontmatter.value.title || frontmatter.value.banner === false) return null
  const cover = frontmatter.value.cover
  if (cover) {
    // 对 cover 中的反斜杠和双引号转义，防止 url("...") 闭合注入
    const safe = String(cover).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    return {
      backgroundImage: `linear-gradient(110deg, rgba(30,21,29,.88), rgba(62,37,48,.72) 56%, rgba(28,22,31,.84)), url("${safe}")`,
      backgroundColor: '#2f252c',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return {
    background: 'linear-gradient(135deg, var(--sakura-pink), var(--sakura-warm))',
  }
})

function tagHref(tag: string): string {
  return withBase(`/tags/?q=${encodeURIComponent(tag)}`)
}

function formatDate(d: string | Date): string {
  if (!d) return ''
  return new Date(d).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const inferredType = computed(() =>
  inferPostType(frontmatter.value.tags || [], frontmatter.value.title || ''),
)
</script>
