import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { nextTick, watch } from 'vue'
import mediumZoom from 'medium-zoom'
import Layout from './Layout.vue'
import HomeHero from './components/HomeHero.vue'
import BlogList from './components/BlogList.vue'
import BlogTimeline from './components/BlogTimeline.vue'
import TagCloud from './components/TagCloud.vue'
import SiteStats from './components/SiteStats.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router }) {
    app.component('HomeHero', HomeHero)
    app.component('BlogList', BlogList)
    app.component('BlogTimeline', BlogTimeline)
    app.component('TagCloud', TagCloud)
    app.component('SiteStats', SiteStats)

    // Image lightbox — re-attach on route change
    if (typeof window !== 'undefined') {
      const route = useRoute()
      watch(
        () => route.path,
        () => nextTick(() => mediumZoom('.main img', {
          background: 'var(--vp-c-bg)',
          margin: 24,
        })),
        { immediate: true },
      )
    }
  },
}
