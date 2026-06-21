import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

interface PostMeta {
  title: string
  date: number
  slug: string
}

function loadPosts(): PostMeta[] {
  const cwd = process.cwd()
  const postDir = path.join(cwd, 'posts')
  if (!fs.existsSync(postDir)) return []

  return fs
    .readdirSync(postDir)
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .map((f) => {
      const raw = fs.readFileSync(path.join(postDir, f), 'utf-8')
      const { data } = matter(raw)
      if (!data.title) return null
      return {
        title: data.title as string,
        date: +new Date(data.date) || fs.statSync(path.join(postDir, f)).mtimeMs,
        slug: f.replace(/\.md$/, ''),
      }
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => b.date - a.date)
}

const posts = loadPosts()

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/blog/',
  lang: 'zh-CN',
  title: 'Sakikoの博客',
  description: '一个热爱ACGN的程序员小窝',

  head: [
    // PWA 已关闭，此脚本清除旧 Service Worker
    ['script', {},
      `if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister()))}`],

    ['link', { rel: 'icon', href: '/blog/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#fe9600' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Sakikoの博客' }],
    ['meta', { property: 'og:description', content: '一个热爱ACGN的程序员小窝' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.cn' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.cn', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.cn/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Sans+SC:wght@400;600&display=swap' }],

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
          items: posts.map((p) => ({
            text: p.title,
            link: `/posts/${p.slug}`,
          })),
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
})
