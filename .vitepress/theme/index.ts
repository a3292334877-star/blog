import Layout from './Layout.vue'
import './custom.css'
// Font Awesome (sakura主题依赖)
import '@fortawesome/fontawesome-free/css/fontawesome.css'
import '@fortawesome/fontawesome-free/css/brands.css'
import '@fortawesome/fontawesome-free/css/solid.css'

export default {
  Layout,
  NotFound: () => '404 - 页面找不到了呢~ 🍂',
  enhanceApp({ app, router, siteData }) {},
}
