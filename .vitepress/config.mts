import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { SITE, absoluteAsset, absoluteUrl } from './site.constants.mjs'

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
  base: SITE.base,
  lang: 'zh-CN',
  title: SITE.title,
  description: SITE.description,

  head: [
    // PWA 已关闭，此脚本清除旧 Service Worker
    ['script', {},
      `if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister()))}`],

    ['link', { rel: 'icon', type: 'image/jpeg', href: `${SITE.base}avatar.jpg` }],
    ['link', { rel: 'alternate', type: 'application/atom+xml', title: `${SITE.title} RSS`, href: `${SITE.base}feed.xml` }],
    ['meta', { name: 'theme-color', content: '#e4596f' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: SITE.title }],
    ['meta', { property: 'og:description', content: SITE.description }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.cn' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.cn', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.cn/css2?family=Noto+Serif+SC:wght@400;700&family=Noto+Sans+SC:wght@400;600&display=swap' }],

  ],

  cleanUrls: true,
  lastUpdated: true,

  // Sitemap
  sitemap: {
    hostname: SITE.origin,
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/avatar.jpg',
    siteTitle: '🌸 Sakiko',

    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '标签', link: '/tags/' },
      { text: '项目', link: '/projects/' },
      { text: '追番', link: '/anime/' },
      { text: '说说', link: '/shuoshuo/' },
      { text: '学习', link: '/learn/' },
      { text: '友链', link: '/friends/' },
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
      md.use(mathjax3, {
        // 共享字形定义，避免公式较多时重复嵌入大量 SVG path
        svg: { fontCache: 'global' },
      })
    },
  },

  srcDir: '.',
  outDir: '.vitepress/dist',

  // Vite 配置
  vite: {},

  // SEO meta：文章页注入 og:* / twitter:* （build 时静态注入到 frontmatter.head）
  transformPageData(pageData: any) {
    const fm = pageData.frontmatter || {}
    if (!fm.title) return

    const title = fm.title
    const desc = fm.description || SITE.description
    const cover = fm.cover
      ? (String(fm.cover).startsWith('http')
          ? String(fm.cover)
          : absoluteAsset(fm.cover))
      : null
    const pagePath = pageData.relativePath
      .replace(/\.md$/, '')
      .replace(/(^|\/)index$/, '$1')
    const url = absoluteUrl(pagePath)
    const isPost = pageData.relativePath.startsWith('posts/') && pageData.relativePath !== 'posts/index.md'

    const head: any[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:type', content: isPost ? 'article' : 'website' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: desc }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { name: 'twitter:card', content: cover ? 'summary_large_image' : 'summary' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: desc }],
    ]
    if (cover) {
      head.push(['meta', { property: 'og:image', content: cover }])
      head.push(['meta', { name: 'twitter:image', content: cover }])
    }
    const existingHead = Array.isArray(fm.head) ? fm.head : []
    pageData.frontmatter = { ...fm, head: [...existingHead, ...head] }
  },
})
