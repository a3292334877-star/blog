import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, extname, join, relative, resolve } from 'node:path'

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

  const totalBytes = files.reduce((sum, file) => sum + statSync(file).size, 0)
  const maxTotalBytes = 10.5 * 1024 * 1024
  if (totalBytes > maxTotalBytes) {
    fail(`build size ${(totalBytes / 1024 / 1024).toFixed(2)} MB exceeds 10.5 MB budget`)
  }

  const maxJavaScriptBytes = 300 * 1024
  for (const file of files.filter((file) => extname(file) === '.js')) {
    const size = statSync(file).size
    // 搜索索引按需加载，允许随文章数量增长，但仍保留独立上限。
    const isSearchIndex = basename(file).startsWith('@localSearchIndex')
    const limit = isSearchIndex ? 400 * 1024 : maxJavaScriptBytes
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
