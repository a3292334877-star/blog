import { defineConfig } from 'vitepress'

export default defineConfig({
  // ==================== 站点元数据 ====================
  lang: 'zh-CN',
  title: '海平的博客',
  description: '一个热爱ACGN的程序员小窝 🌸',

  // ==================== 头部配置 ====================
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#fe9600' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '海平的博客' }],
    ['meta', { property: 'og:description', content: '一个热爱ACGN的程序员小窝 🌸' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap' }],
  ],

  // ==================== 外观 ====================
  appearance: true,  // 使用 VitePress 原生暗黑模式

  // ==================== 搜索 ====================
  search: {
    provider: 'local',
  },

  // ==================== 主题配置 ====================
  themeConfig: {
    // 博客自定义数据 (被组件使用)
    hello: 'Hello, 海平 🌸',
    motto: '至死不渝地追逐清华梦 🩷',
    name: '谭海平',
    cover: '',

    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '📝 文章', link: '/posts/' },
      { text: '🏷️ 标签', link: '/tags/' },
      { text: '👤 关于', link: '/about/' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/TanHaiping' },
    ],
    footer: {
      message: '用 ❤️ 和 VitePress 构建',
      copyright: `© ${new Date().getFullYear()} 谭海平 | 至死不渝 🩷`,
    },
  },

  // ==================== Markdown 配置 ====================
  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true,
    },
    config: async (md) => {
      // 数学公式
      const mathjax3 = (await import('markdown-it-mathjax3')).default
      md.use(mathjax3)
      // 代码块标签页
      const tabs = await import('vitepress-plugin-tabs')
      md.use(tabs.tabsMarkdownPlugin)
      // 分组图标
      const groupIcons = await import('vitepress-plugin-group-icons')
      md.use(groupIcons.groupIconMdPlugin)
    },
  },

  // ==================== 构建配置 ====================
  base: '/blog/',
  srcDir: '.',
  outDir: '.vitepress/dist',
  cleanUrls: true,
  lastUpdated: true,
})
