import { defineConfig } from 'vitepress'
import path from 'node:path'
import matter from 'gray-matter'
import { katex } from '@mdit/plugin-katex'
import { SITE, absoluteAsset, absoluteUrl, toSocialImage } from './site.constants.mjs'
import { gitLastUpdated } from './last-updated.mjs'
import { estimateReadingTime } from './post-utils.mjs'
import { loadPosts } from './posts.mjs'

/**
 * 搜索索引中剔除代码块：源码对正文检索帮助有限，却会随长文迅速撑大索引。
 * 正文里的行内代码（如 `std::vector`）仍然保留，文章标题与摘要不受影响。
 */
function stripCodeBlocks(content: string): string {
  // 同时匹配缩进与引用块内的围栏代码（如 `> ```c`）。
  return content.replace(/^[ \t]*(?:>[ \t]*)*(?:```|~~~)[^\n]*\n[\s\S]*?^[ \t]*(?:>[ \t]*)*(?:```|~~~)[^\n]*$/gm, '')
}

function shortenNavTitle(title: string, maxLength = 24): string {
  const characters = Array.from(title)
  return characters.length > maxLength
    ? `${characters.slice(0, maxLength).join('')}…`
    : title
}

const MATH_POST_PAGES = new Set([
  'posts/calculus-basics.md',
  'posts/differential-equations-basics.md',
])
const STEP_CARD_PAGES = new Set([
  ...MATH_POST_PAGES,
  'posts/japan-master-application.md',
])
const QUIZ_PANEL_PAGES = new Set([
  ...STEP_CARD_PAGES,
  'posts/cet6-practical-guide.md',
  'posts/cpp-tutorial.md',
  'posts/japanese-grammar-watershed.md',
  'posts/ruankao-intermediate-guide.md',
])

const NO_COMMENT_PAGES = new Set([
  'index.md',
  '404.md',
  'posts/index.md',
  'tags/index.md',
  'friends/index.md',
  'about/index.md',
  'projects/index.md',
])

/** 仅在特定页面使用的异步组件 chunk，避免在全站所有页面提前 modulepreload。 */
const SCOPED_PRELOAD_CHUNKS: Record<string, (page: string) => boolean> = {
  HomeHero: (page) => page === 'index.md',
  AboutStrip: (page) => page === 'index.md',
  HomeCategories: (page) => page === 'index.md',
  HomeColumns: (page) => page === 'index.md',
  AnimePreview: (page) => page === 'index.md',
  ProjectsPreview: (page) => page === 'index.md',
  ShuoshuoPreview: (page) => page === 'index.md',
  SiteStats: (page) => page === 'index.md',
  SakuraPetals: (page) => page === 'index.md',
  Live2DWidget: (page) => page === 'index.md',
  ReadingProgress: (page) => page !== 'index.md' && page !== '404.md',
  PostNavigation: (page) => page.startsWith('posts/') && page !== 'posts/index.md',
  GiscusComment: (page) => !NO_COMMENT_PAGES.has(page),
  BlogList: (page) => page === 'index.md' || page === 'posts/index.md',
  BlogTimeline: (page) => page === 'posts/index.md',
  TagCloud: (page) => page === 'tags/index.md',
  FriendLinks: (page) => page === 'friends/index.md',
  AnimeList: (page) => page === 'anime/index.md',
  ShuoshuoTimeline: (page) => page === 'shuoshuo/index.md',
  CalculusMethodTree: (page) => page === 'posts/calculus-basics.md',
  DerivativeIntegralVisual: (page) => page === 'posts/calculus-basics.md',
  OdeDecisionTree: (page) => page === 'posts/differential-equations-basics.md',
  OdeIntegralCurves: (page) => page === 'posts/differential-equations-basics.md',
  MathShowcase: (page) => MATH_POST_PAGES.has(page),
  ExampleBox: (page) => MATH_POST_PAGES.has(page),
  ExampleSolution: (page) => MATH_POST_PAGES.has(page),
  StepCards: (page) => STEP_CARD_PAGES.has(page),
  StepCard: (page) => STEP_CARD_PAGES.has(page),
  QuizPanel: (page) => QUIZ_PANEL_PAGES.has(page),
  MusicPlayer: () => false,
  'medium-zoom': () => false,
  VPLocalSearchBox: () => false,
}

function shouldKeepPreloadTag(tag: string, page: string): boolean {
  const match = tag.match(/href="[^"]*\/assets\/chunks\/([^./"]+)\.[^"]+\.js"/)
  if (!match) return true
  const rule = SCOPED_PRELOAD_CHUNKS[match[1]]
  return rule ? rule(page) : true
}

/** 取日期（或日期字符串）的 YYYY-MM-DD，用于比较“发布”与“更新”是否同一天。 */
function dayKey(value: unknown): string {
  const date = new Date(value as string)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

/**
 * MiniSearch 默认以空格分词，无法命中连续中文中间的词组。
 * 使用浏览器原生分词器拆分中文，同时保留英文、数字和技术术语。
 *
 * 此函数会被 VitePress 序列化到客户端，因此必须保持自包含。
 */
function tokenizeSearchText(text: string): string[] {
  const normalized = String(text)
    .normalize('NFKC')
    .toLowerCase()

  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const fn = tokenizeSearchText as typeof tokenizeSearchText & { _seg?: Intl.Segmenter }
    fn._seg ??= new Intl.Segmenter('zh-CN', { granularity: 'word' })
    return Array.from(fn._seg.segment(normalized))
      .filter((part) => part.isWordLike)
      .map((part) => part.segment)
  }

  // 老旧浏览器回退：中日韩字符按单字，其余内容按连续词组切分。
  return normalized.match(
    /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]|[\p{Letter}\p{Number}_+#.-]+/gu,
  ) ?? []
}

/**
 * 过滤高频中文虚词（的、与、是……）、下划线占位符以及 1～2 位孤立数字。
 * 它们几乎出现在每个段落或题干中，却无法区分结果；查询时同样会被忽略。
 * 日语假名助词和 3 位以上数字（年份、状态码等）不在此列，保留可检索性。
 *
 * 此函数会被 VitePress 序列化到客户端，因此必须保持自包含。
 */
function processSearchTerm(term: string): string | null {
  return /^(?:的|了|与|和|及|或|是|在|从|到|为|对|把|被|将|让|也|就|都|而|并|则|等|着|之|其|这|那|个|吗|呢|吧|啊|呀|地|得|又|再|还|很|即|且|但|若|如|因|所|以|于|此|些|_+|\d{1,2}(?:[.,:/-]\d+)*)$/.test(term)
    ? null
    : term
}

const posts = loadPosts(path.join(process.cwd(), 'posts'))
const postReadingTimes = new Map<string, number>(
  posts.map((post) => [post.slug, estimateReadingTime(post.content)]),
)
const latestPostTimestamp = posts.reduce((latest, post) => {
  const gitIso = gitLastUpdated(`posts/${post.file}`)
  const gitMs = gitIso ? +new Date(gitIso) || 0 : 0
  return Math.max(latest, post.date, gitMs)
}, 0)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: SITE.base,
  lang: 'zh-CN',
  title: SITE.title,
  description: SITE.description,

  head: [
    ['link', { rel: 'icon', type: 'image/webp', href: `${SITE.base}avatar.webp` }],
    ['link', { rel: 'alternate', type: 'application/atom+xml', title: `${SITE.title} RSS`, href: `${SITE.base}feed.xml` }],
    ['meta', { name: 'theme-color', content: '#e4596f' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: SITE.title }],
    ['meta', { property: 'og:description', content: SITE.description }],
  ],

  cleanUrls: true,
  lastUpdated: true,

  // README 是给仓库看的说明，之前会被编译成 /README 页面并进入 sitemap 和搜索索引。
  srcExclude: ['README.md', 'AGENTS.md', '**/AGENTS.md', '**/CODEX-HANDOFF.md'],

  // Sitemap
  sitemap: {
    hostname: SITE.origin,
    transformItems: (items) =>
      items
        // 404 页不需要被搜索引擎收录。
        .filter((item) => !/(^|\/)404\/?$/.test(String(item.url)))
        // 聚合页（首页 / 文章列表 / 标签页）的内容随新文章自动变化，同步更新 lastmod。
        .map((item) => {
          const clean = String(item.url).replace(/^\/+|\/+$/g, '')
          if (latestPostTimestamp > 0 && (clean === '' || clean === 'posts' || clean === 'tags')) {
            const existing = item.lastmod ? +new Date(item.lastmod) || 0 : 0
            return {
              ...item,
              lastmod: new Date(Math.max(existing, latestPostTimestamp)).toISOString(),
            }
          }
          return item
        }),
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/avatar.webp',
    siteTitle: '🌸 Sakiko',
    outline: {
      level: [2, 3],
      label: '本页目录',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '文章导航',
    returnToTopLabel: '返回顶部',
    skipToContentLabel: '跳到正文',

    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '标签', link: '/tags/' },
      { text: '项目', link: '/projects/' },
      { text: '学习', link: '/learn/' },
      {
        text: '更多',
        items: [
          { text: '追番', link: '/anime/' },
          { text: '说说', link: '/shuoshuo/' },
          { text: '友链', link: '/friends/' },
          { text: '关于', link: '/about/' },
        ],
      },
    ],

    sidebar: {
      '/posts/': [
        {
          text: '文章导航',
          items: [
            { text: '全部文章', link: '/posts/' },
            { text: '标签分类', link: '/tags/' },
          ],
        },
        {
          text: '最近更新',
          items: posts.slice(0, 5).map((p) => ({
            text: shortenNavTitle(p.title),
            link: `/posts/${p.slug}`,
          })),
        },
      ],
      '/learn/standard-japanese/': [
        {
          text: '标日同步手册',
          items: [
            { text: '三卷总目录', link: '/learn/standard-japanese/' },
            { text: '词类与变形总览', link: '/learn/standard-japanese/conjugation-guide' },
            { text: '第一卷：初级篇', link: '/learn/standard-japanese/elementary' },
            { text: '第二卷：中级篇', link: '/learn/standard-japanese/intermediate' },
            { text: '第三卷：高级篇', link: '/learn/standard-japanese/advanced' },
          ],
        },
        {
          text: '学习导航',
          items: [
            { text: '返回学习路线', link: '/learn/' },
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
        // 将 frontmatter 的标题、摘要和标签一起写入搜索索引。
        _render(src, env, md) {
          const { data, content } = matter(src)
          if (data.search === false) return ''

          const title = data.title ? `# ${String(data.title)}` : ''
          const description = data.description ? String(data.description) : ''
          const tags = Array.isArray(data.tags) ? data.tags.join(' ') : ''
          const body = stripCodeBlocks(
            title
              ? content.replace(/^\s*#\s+[^\n]+\n+/, '')
              : content,
          )

          const html = md.render(
            [title, description, tags, body].filter(Boolean).join('\n\n'),
            env,
          )
          // 兜底剔除残余代码块（如缩进代码块）与 KaTeX MathML，避免无关源码/公式符号膨胀搜索索引。
          return html
            .replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/g, '')
            .replace(/<span class="lang">[^<]*<\/span>/g, '')
            .replace(/<math\b[^>]*>[\s\S]*?<\/math>/g, ' ')
            .replace(/<annotation[^>]*>[\s\S]*?<\/annotation>/g, '')
        },
        miniSearch: {
          options: {
            tokenize: tokenizeSearchText,
            processTerm: processSearchTerm,
          },
          searchOptions: {
            combineWith: 'AND',
          },
        },
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
    config: (md) => {
      md.use(katex, {
        delimiters: 'dollars',
        throwOnError: false,
        strict: 'warn',
        output: 'mathml',
      })
    },
  },

  srcDir: '.',
  outDir: '.vitepress/dist',

  // Vite 配置
  vite: {
    server: {
      host: '127.0.0.1',
      strictPort: true,
      cors: {
        origin: /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/,
      },
    },
    build: {
      chunkSizeWarningLimit: 650,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('minisearch')) {
                return 'vendor-minisearch'
              }
            }
          },
        },
      },
    },
  },

  // SEO meta：文章页注入 og:* / twitter:* （build 时静态注入到 frontmatter.head）
  transformPageData(pageData: any) {
    const fm = pageData.frontmatter || {}
    const isHome = pageData.relativePath === 'index.md'
    if (!fm.title && !isHome) return

    const title = fm.title || SITE.title
    const desc = fm.description || SITE.description
    const isPost = pageData.relativePath.startsWith('posts/') && pageData.relativePath !== 'posts/index.md'
    const slug = pageData.relativePath.replace(/^posts\//, '').replace(/\.md$/, '')
    const defaultCover = isPost ? `/covers/${slug}.svg` : null
    const coverSource = fm.cover === false ? null : (fm.cover || defaultCover)
    const socialCover = coverSource && !String(coverSource).startsWith('http')
      ? toSocialImage(String(coverSource))
      : null
    // 栏目页没有专属封面时回退到站点默认分享图（scripts/generate-og-images.mjs 生成），
    // 否则 /posts/、/tags/、/about/ 等页面分享出去没有缩略图。
    const usesDefaultSocial = !coverSource && !isHome
    const cover = coverSource
      ? (String(coverSource).startsWith('http')
          ? String(coverSource)
          : absoluteAsset(socialCover!.path))
      : (isHome ? absoluteAsset('/avatar.webp') : absoluteAsset('/og/site.webp'))
    const pagePath = pageData.relativePath
      .replace(/\.md$/, '')
      .replace(/(^|\/)index$/, '$1')
    const url = absoluteUrl(pagePath)

    // “更新于”取 Git 提交时间，且只在确实晚于发布日期时显示；
    // 否则页面上会出现“发布于 X … 更新于 X”这种重复又误导的信息。
    const gitUpdated = fm.date && fm.lastUpdated == null ? gitLastUpdated(pageData.relativePath) : null
    const lastUpdated =
      gitUpdated && gitUpdated.slice(0, 10) !== dayKey(fm.date) ? gitUpdated.slice(0, 10) : null
    // 头部横幅已经展示“发布于 / 更新于”的文章页，不再让 VitePress 页脚重复同一条信息。
    const lastModifiedAt = pageData.lastUpdated ?? (gitUpdated ? +new Date(gitUpdated) : undefined)
    if (fm.date) delete pageData.lastUpdated

    const head: any[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:type', content: isPost ? 'article' : 'website' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: desc }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:locale', content: 'zh_CN' }],
      ['meta', { name: 'twitter:card', content: cover ? 'summary_large_image' : 'summary' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: desc }],
    ]
    if (cover) {
      head.push(['meta', { property: 'og:image', content: cover }])
      head.push(['meta', { name: 'twitter:image', content: cover }])
      head.push(['meta', { property: 'og:image:alt', content: title }])
      head.push(['meta', { name: 'twitter:image:alt', content: title }])
      if (socialCover?.rasterized || usesDefaultSocial) {
        head.push(['meta', { property: 'og:image:type', content: 'image/webp' }])
        head.push(['meta', { property: 'og:image:width', content: '1200' }])
        head.push(['meta', { property: 'og:image:height', content: '630' }])
      }
    }

    // 文章页补充 Open Graph / Twitter 之外的时间信息，社交平台和阅读器可直接读取。
    if (isPost && fm.date) {
      head.push(['meta', { property: 'article:published_time', content: new Date(fm.date).toISOString() }])
      if (lastModifiedAt) {
        head.push(['meta', { property: 'article:modified_time', content: new Date(lastModifiedAt).toISOString() }])
      }
    }

    const relPath = String(pageData.relativePath)
    const isPostsSection = relPath.startsWith('posts/')
    const isProjectDetail = relPath.startsWith('projects/') && relPath !== 'projects/index.md'
    const isLearnJapaneseIndex = relPath === 'learn/standard-japanese/index.md'
    const isLearnJapaneseSubpage = relPath.startsWith('learn/standard-japanese/') && !isLearnJapaneseIndex

    const parentCrumbs: Array<{ name: string; url: string }> = []
    if (isPost) {
      parentCrumbs.push({ name: '文章', url: absoluteUrl('posts/') })
    } else if (isProjectDetail) {
      parentCrumbs.push({ name: '项目', url: absoluteUrl('projects/') })
    } else if (isLearnJapaneseIndex) {
      parentCrumbs.push({ name: '学习路线', url: absoluteUrl('learn/') })
    } else if (isLearnJapaneseSubpage) {
      parentCrumbs.push(
        { name: '学习路线', url: absoluteUrl('learn/') },
        { name: '标日同步手册', url: absoluteUrl('learn/standard-japanese/') },
      )
    }

    const breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: '首页', item: absoluteUrl() },
      ...parentCrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: crumb.name,
        item: crumb.url,
      })),
      ...(!isHome
        ? [{ '@type': 'ListItem', position: parentCrumbs.length + 2, name: title, item: url }]
        : []),
    ]
    const structuredData: Record<string, any>[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems,
      },
    ]
    const readingTime = isPost ? postReadingTimes.get(slug) : undefined
    if (isPost) {
      structuredData.push({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: desc,
        inLanguage: 'zh-CN',
        url,
        mainEntityOfPage: url,
        image: cover || undefined,
        keywords: Array.isArray(fm.tags) && fm.tags.length ? fm.tags.join(', ') : undefined,
        timeRequired: readingTime ? `PT${readingTime}M` : undefined,
        datePublished: fm.date ? new Date(fm.date).toISOString() : undefined,
        dateModified: lastModifiedAt ? new Date(lastModifiedAt).toISOString() : undefined,
        author: {
          '@type': 'Person',
          name: SITE.author,
          url: absoluteUrl('about/'),
          sameAs: ['https://github.com/a3292334877-star'],
        },
        publisher: {
          '@type': 'Person',
          name: SITE.author,
          url: absoluteUrl(),
        },
      })
    }
    head.push(['script', { type: 'application/ld+json' }, JSON.stringify(structuredData).replace(/</g, '\\u003c')])
    const existingHead = Array.isArray(fm.head) ? fm.head : []
    pageData.frontmatter = {
      ...fm,
      ...(isPost && fm.cover == null ? { cover: defaultCover } : {}),
      ...(readingTime && fm.readingTime == null ? { readingTime } : {}),
      ...(isPostsSection && fm.prev == null ? { prev: false } : {}),
      ...(isPostsSection && fm.next == null ? { next: false } : {}),
      ...(lastUpdated ? { lastUpdated } : {}),
      head: [...existingHead, ...head],
    }
  },

  transformHtml(code: string, _id: string, ctx: { page: string }) {
    return code.replace(
      /[ \t]*<link rel="modulepreload" href="[^"]+">\r?\n?/g,
      (tag) => (shouldKeepPreloadTag(tag, ctx.page) ? tag : ''),
    )
  },
})
