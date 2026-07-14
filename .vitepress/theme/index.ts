import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import HomeHero from './components/HomeHero.vue'
import BlogList from './components/BlogList.vue'
import BlogTimeline from './components/BlogTimeline.vue'
import TagCloud from './components/TagCloud.vue'
import SiteStats from './components/SiteStats.vue'
import AnimePreview from './components/AnimePreview.vue'
import ProjectsPreview from './components/ProjectsPreview.vue'
import ShuoshuoPreview from './components/ShuoshuoPreview.vue'
import FriendLinks from './components/FriendLinks.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero)
    app.component('BlogList', BlogList)
    app.component('BlogTimeline', BlogTimeline)
    app.component('TagCloud', TagCloud)
    app.component('SiteStats', SiteStats)
    app.component('AnimePreview', AnimePreview)
    app.component('ProjectsPreview', ProjectsPreview)
    app.component('ShuoshuoPreview', ShuoshuoPreview)
    app.component('FriendLinks', FriendLinks)
  },
}
