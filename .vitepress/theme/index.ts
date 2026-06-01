import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import HomeHero from './components/HomeHero.vue'
import BlogList from './components/BlogList.vue'
import BlogTimeline from './components/BlogTimeline.vue'
import TagCloud from './components/TagCloud.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero)
    app.component('BlogList', BlogList)
    app.component('BlogTimeline', BlogTimeline)
    app.component('TagCloud', TagCloud)
  },
}
