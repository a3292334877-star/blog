import Layout from './Layout.vue'
import './styles/vars.css'
import './styles/base.css'
import './styles/markdown.css'

export default {
  Layout,
  NotFound: () => '404 - 页面找不到了呢~ 🍂',
  enhanceApp({ app, router, siteData }) {},
}
