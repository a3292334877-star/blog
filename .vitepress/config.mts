import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'

// https://vitepress.dev/reference/site-config
export default withPwa(defineConfig({
  base: '/blog/',
  lang: 'zh-CN',
  title: 'Sakikoの博客',
  description: '一个热爱ACGN的程序员小窝',

  head: [


    ['link', { rel: 'icon', href: '/blog/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#fe9600' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Sakikoの博客' }],
    ['meta', { property: 'og:description', content: '一个热爱ACGN的程序员小窝' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Sans+SC:wght@400;600&display=swap' }],

  ],

  cleanUrls: true,
  lastUpdated: true,

  // Sitemap
  sitemap: {
    hostname: 'https://a3292334877-star.github.io',
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/blog/favicon.ico',
    siteTitle: '🌸 Sakiko',

    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '标签', link: '/tags/' },
      { text: '项目', link: '/projects/' },
      { text: '追番', link: '/anime/' },
      { text: '说说', link: '/shuoshuo/' },
      { text: '学习', link: '/learn/' },
      { text: '关于', link: '/about/' },
    ],

    sidebar: {
      '/posts/': [
        {
          text: '文章列表',
          items: [
            { text: '你好，世界', link: '/posts/hello-world' },
            { text: 'Markdown 写作指南', link: '/posts/markdown-guide' },
            { text: 'Linux Tips 常用命令', link: '/posts/linux-tips' },
            { text: 'Git Tips 常用操作', link: '/posts/git-tips' },
            { text: 'C++ 哈希 Map 应用与竞赛技巧', link: '/posts/hashmap-in-cpp' },
            { text: 'C++ 高精度算法详解与竞赛模板', link: '/posts/bigint-in-cpp' },
            { text: '数据结构基础：从数组到并查集', link: '/posts/data-structure-basics' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/a3292334877-star' },
    ],

    footer: {
      message: '用 ❤️ 和 VitePress 构建',
      copyright: '© 2026 Sakiko | 至死不渝',
    },

    // 文档页编辑链接
    editLink: {
      pattern: 'https://github.com/a3292334877-star/blog/edit/main/:path',
      text: '在 GitHub 上编辑此页',
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      },
    },

    // 搜索
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索',
          },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清空',
            backButtonTitle: '关闭',
            noResultsText: '未找到结果',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
  },

  markdown: {
    image: { lazyLoading: true },
    config: async (md) => {
      const mathjax3 = (await import('markdown-it-mathjax3')).default
      md.use(mathjax3)
    },
  },

  srcDir: '.',
  outDir: '.vitepress/dist',

  // Vite 配置
  vite: {},
}), {
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Sakikoの博客',
      short_name: 'Sakiko',
      description: '一个热爱ACGN的程序员小窝',
      theme_color: '#fe9600',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: '/blog/favicon.ico',
          sizes: '64x64 32x32 24x24 16x16',
          type: 'image/x-icon',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{css,js,html,svg,png,ico,woff,woff2,jpg,webp}'],
    },
  },
})
