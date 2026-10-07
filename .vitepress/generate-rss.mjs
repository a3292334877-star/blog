/**
 * RSS / Atom Feed 生成器
 * 在 vitepress build 之后运行，读取 posts 生成 feed.xml
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { SITE as SITE_CONFIG, SITE_URL, absoluteAsset, toSocialImage } from './site.constants.mjs'
import { gitLastUpdated } from './last-updated.mjs'

const SITE = {
  title: SITE_CONFIG.title,
  desc: SITE_CONFIG.description,
  url: SITE_URL,
  author: SITE_CONFIG.author,
}

const DIST = path.join(process.cwd(), '.vitepress/dist')
const POST_DIR = path.join(process.cwd(), 'posts')

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function rfc3339(ts) {
  return new Date(ts).toISOString()
}

function main() {
  const files = fs.readdirSync(POST_DIR).filter(f => f.endsWith('.md') && f !== 'index.md')

  const posts = files
    .map(f => {
      const raw = fs.readFileSync(path.join(POST_DIR, f), 'utf-8')
      const { data, content, excerpt } = matter(raw, { excerpt: true, excerpt_separator: '<!-- more -->' })
      if (!data.title) return null
      const slug = f.replace(/\.md$/, '')
      const date = +new Date(data.date) || fs.statSync(path.join(POST_DIR, f)).mtimeMs
      const coverSource = data.cover === false ? null : (data.cover || `/covers/${slug}.svg`)
      // 阅读器普遍不渲染 SVG，封面改用光栅化后的分享图。
      const coverAsset = coverSource ? toSocialImage(coverSource).path : null
      const cover = coverAsset
        ? (String(coverAsset).startsWith('http') ? String(coverAsset) : absoluteAsset(coverAsset))
        : null
      const desc = data.description || (excerpt || '').trim() || SITE.desc
      // 真实更新时间取 Git 提交时间，且不早于发布时间。
      const gitDate = gitLastUpdated(`posts/${f}`)
      const updated = gitDate ? Math.max(+new Date(gitDate) || date, date) : date
      return { title: data.title, date, slug, excerpt: desc, cover, updated }
    })
    .filter(Boolean)
    .sort((a, b) => b.date - a.date)

  const updated = posts.length > 0
    ? rfc3339(Math.max(...posts.map(p => p.updated)))
    : rfc3339(Date.now())

  const items = posts.map(p => {
    const media = p.cover
      ? `\n      <media:content xmlns:media="http://search.yahoo.com/mrss/" url="${escapeXml(p.cover)}" medium="image"/>`
      : ''
    return `
    <entry>
      <title>${escapeXml(p.title)}</title>
      <link href="${SITE.url}/posts/${p.slug}"/>
      <id>${SITE.url}/posts/${p.slug}</id>
      <published>${rfc3339(p.date)}</published>
      <updated>${rfc3339(p.updated)}</updated>
      <summary type="html">${escapeXml(p.excerpt)}</summary>${media}
      <author><name>${SITE.author}</name></author>
    </entry>`
  }).join('')

  const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE.title)}</title>
  <subtitle>${escapeXml(SITE.desc)}</subtitle>
  <link href="${SITE.url}/feed.xml" rel="self"/>
  <link href="${SITE.url}"/>
  <id>${SITE.url}/</id>
  <updated>${updated}</updated>
  <author><name>${SITE.author}</name></author>
  ${items}
</feed>`

  fs.writeFileSync(path.join(DIST, 'feed.xml'), feed)
  console.log(`  ✓ RSS feed generated (${posts.length} posts)`)
}

main()
