import { defineConfig } from 'vitepress'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  // ==================== 站点元数据 ====================
  lang: 'zh-CN',
  title: '海平的博客',
  description: '一个热爱ACGN的程序员小窝 🌸',

  // ==================== 头部配置 ====================
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#fe9600' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap' }],
  ],

  // ==================== 主题配置 ====================
  themeConfig: {
    // Sakura 覆盖配置
    hello: 'Hello, 海平 🌸',
    motto: '至死不渝地追逐清华梦 🩷',
    name: '谭海平',
    cover: '',
    social: [
      { icon: 'fa-github', url: 'https://github.com/TanHaiping' },
    ],

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
      message: '用 ❤️ 和 VitePress + Sakura 构建',
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

  // ==================== Vite 配置 ====================
  vite: {
    resolve: {
      alias: {
        // 主题路径别名
        'sakura-posts-data': path.resolve(
          __dirname,
          'posts.data.mjs'
        ),
        'vitepress-theme-sakura/BlogList.vue': path.resolve(
          __dirname,
          '../node_modules/vitepress-theme-sakura/.vitepress/theme/BlogList.vue'
        ),
        'vitepress-theme-sakura/GlitchText.vue': path.resolve(
          __dirname,
          '../node_modules/vitepress-theme-sakura/.vitepress/theme/GlitchText.vue'
        ),
        'vitepress-theme-sakura/ToTop.vue': path.resolve(
          __dirname,
          '../node_modules/vitepress-theme-sakura/.vitepress/theme/ToTop.vue'
        ),
      },
    },
    ssr: {
      noExternal: ['vitepress-theme-sakura'],
    },
  },

  // ==================== 构建配置 ====================
  srcDir: '.',
  outDir: '.vitepress/dist',
  cleanUrls: true,
  lastUpdated: true,
})
