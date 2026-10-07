import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, extname, join, relative, resolve } from 'node:path'
import { SITE_URL } from '../.vitepress/site.constants.mjs'

const root = resolve(import.meta.dirname, '..')
const dist = join(root, '.vitepress', 'dist')
const errors = []

function fail(message) { errors.push(message) }

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? filesUnder(path) : [path]
  })
}

if (!existsSync(dist)) {
  fail('missing .vitepress/dist')
} else {
  for (const required of ['index.html', 'CNAME', 'robots.txt', 'sitemap.xml', 'feed.xml']) {
    const target = join(dist, required)
    if (!existsSync(target) || statSync(target).size === 0) fail(`missing or empty ${required}`)
  }

  const homepagePath = join(dist, 'index.html')
  if (existsSync(homepagePath)) {
    const homepage = readFileSync(homepagePath, 'utf8')
    const requiredFragments = [
      '<link rel="canonical" href="https://sakikoblog.info/">',
      '<meta property="og:url" content="https://sakikoblog.info/">',
      '<meta property="og:image" content="https://sakikoblog.info/avatar.webp">',
      '<script type="application/ld+json">',
    ]
    for (const fragment of requiredFragments) {
      if (!homepage.includes(fragment)) fail(`homepage is missing ${fragment}`)
    }
  }

  // 仓库说明文档不应该变成公开页面（之前 README.md 会被编译成 /README 并进 sitemap）。
  if (existsSync(join(dist, 'README.html'))) fail('README.md was built into a public page')

  // 搜索结果里不该出现 404 页。
  const sitemapPath = join(dist, 'sitemap.xml')
  if (existsSync(sitemapPath) && /<loc>[^<]*\/404<\/loc>/.test(readFileSync(sitemapPath, 'utf8'))) {
    fail('sitemap.xml should not list the 404 page')
  }
  const notFoundPath = join(dist, '404.html')
  if (
    existsSync(notFoundPath) &&
    !readFileSync(notFoundPath, 'utf8').includes('<meta name="robots" content="noindex">')
  ) {
    fail('404.html is missing <meta name="robots" content="noindex">')
  }

  const files = filesUnder(dist)

  // 检查构建后的站内链接与资源，避免部署后出现 404。
  const htmlFiles = files.filter((file) => extname(file) === '.html')
  const checkedLinks = new Set()
  for (const htmlFile of htmlFiles) {
    const html = readFileSync(htmlFile, 'utf8')
    for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]+)(?:[?#][^"]*)?"/g)) {
      const urlPath = decodeURIComponent(match[1])
      if (checkedLinks.has(urlPath)) continue
      checkedLinks.add(urlPath)
      const cleanPath = urlPath.replace(/^\//, '')
      const candidates = extname(cleanPath)
        ? [join(dist, cleanPath)]
        : [join(dist, `${cleanPath}.html`), join(dist, cleanPath, 'index.html')]
      if (cleanPath === '') candidates.push(join(dist, 'index.html'))
      if (!candidates.some(existsSync)) {
        fail(`${relative(dist, htmlFile)} links to missing ${urlPath}`)
      }
    }
  }
  console.log(`  ✓ internal links: ${checkedLinks.size} unique targets checked`)

  // og:image 指向分享卡片，缺文件时链接预览会变成空白，这里提前拦截。
  const ogImages = new Set()
  for (const htmlFile of htmlFiles) {
    const html = readFileSync(htmlFile, 'utf8')
    for (const match of html.matchAll(/<meta (?:property="og:image"|name="twitter:image") content="([^"]+)"/g)) {
      ogImages.add(match[1])
    }
  }
  for (const url of ogImages) {
    if (!url.startsWith(`${SITE_URL}/`)) continue
    const assetPath = decodeURIComponent(url.slice(SITE_URL.length + 1))
    if (!existsSync(join(dist, assetPath))) fail(`og:image is missing from build: ${url}`)
  }
  console.log(`  ✓ og:image: ${ogImages.size} unique targets checked`)

  const totalBytes = files.reduce((sum, file) => sum + statSync(file).size, 0)
  // 长篇学习手册会同时生成 HTML 与按需加载的搜索数据；public/og 下还有
  // 文章对应的社交分享图（约 0.4 MB）。首页背景保持轻量 WebP。
  const maxTotalMegabytes = 12.25
  const maxTotalBytes = maxTotalMegabytes * 1024 * 1024
  if (totalBytes > maxTotalBytes) {
    fail(`build size ${(totalBytes / 1024 / 1024).toFixed(2)} MB exceeds ${maxTotalMegabytes.toFixed(2)} MB budget`)
  }

  const maxJavaScriptBytes = 300 * 1024
  for (const file of files.filter((file) => extname(file) === '.js')) {
    const size = statSync(file).size
    // 搜索索引按需加载，允许随文章数量增长，但仍保留独立上限。
    const isSearchIndex = basename(file).startsWith('@localSearchIndex')
    const limit = isSearchIndex ? 600 * 1024 : maxJavaScriptBytes
    if (size > limit) {
      fail(`${relative(dist, file)} is ${(size / 1024).toFixed(1)} KB; limit is ${limit / 1024} KB`)
    }
  }

  console.log(`  ✓ build budget: ${(totalBytes / 1024 / 1024).toFixed(2)} MB across ${files.length} files`)
}

if (errors.length) {
  console.error(`Build check failed with ${errors.length} error(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exitCode = 1
} else {
  console.log('Build output check passed.')
}
